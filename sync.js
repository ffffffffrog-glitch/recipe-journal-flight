// ===== 雲端同步（Supabase）=====
// Local-first：所有操作仍先寫 localStorage；本檔只負責「登入 + 每 5 分鐘與雲端同步」。
// 合併策略：每個資料鍵各帶時間戳，同步時「較新者勝」（跨裝置改到不同鍵都會保留）。

const SUPABASE_URL = 'https://auayrnjefzxdfellottr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-K9YUdArrHEeJejUBxQYiw_UuBToL0C';

// 會同步的資料鍵（使用者內容）。裝置本地/暫存性質的不同步（如 cachedTasks、提醒日期、遷移版本）。
const SYNC_KEYS = [
  'diary', 'foodDB', 'recipes', 'workoutLog', 'weightLog',
  'habits', 'habitLog', 'inbody', 'gamification', 'profile',
  'dailyQuestsDone', 'appTheme', 'askWeightDaily',
];
const SYNC_INTERVAL_MS = 5 * 60 * 1000;   // 5 分鐘

let _sb = null;               // supabase client
let _session = null;
let _syncTimer = null;
let _syncing = false;
let _applyingRemote = false;  // 套用雲端資料期間，不把變更回報成本地變更

// ---- 本地變更時間戳 ----
function _syncMeta() { return getData('syncMeta', { ts: {} }); }

// setData() 會呼叫這個（見 app.js）
window._onLocalDataChanged = function (key) {
  if (_applyingRemote) return;
  if (!SYNC_KEYS.includes(key)) return;
  const m = _syncMeta();
  m.ts[key] = Date.now();
  localStorage.setItem('syncMeta', JSON.stringify(m));
};

// ---- Supabase 初始化 ----
function initSupabase() {
  if (typeof supabase === 'undefined' || !supabase.createClient) {
    console.warn('[sync] Supabase SDK 未載入，僅本地運作');
    _renderAccountUI();
    return;
  }
  _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  _sb.auth.getSession().then(({ data }) => {
    _session = data.session || null;
    _renderAccountUI();
    if (_session) _startSync();
  });
  _sb.auth.onAuthStateChange((_event, session) => {
    _session = session || null;
    _renderAccountUI();
    if (_session) _startSync(); else _stopSync();
  });
}

async function signInWithGoogle() {
  if (!_sb) { showToast?.('雲端服務未就緒，請檢查網路'); return; }
  await _sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: location.href.split('#')[0] },
  });
}

async function signOutCloud() {
  if (!_sb) return;
  _stopSync();
  await _sb.auth.signOut();
  showToast?.('已登出（本地資料保留）');
}

// ---- 同步引擎 ----
function _startSync() {
  if (_syncTimer) return;
  syncNow();                                   // 登入/開啟時先同步一次
  _syncTimer = setInterval(syncNow, SYNC_INTERVAL_MS);
  document.addEventListener('visibilitychange', _onVisible);
}
function _stopSync() {
  if (_syncTimer) { clearInterval(_syncTimer); _syncTimer = null; }
  document.removeEventListener('visibilitychange', _onVisible);
}
function _onVisible() { if (document.visibilityState === 'visible') syncNow(); }

async function syncNow() {
  if (!_sb || !_session || _syncing) return;
  _syncing = true;
  _renderAccountUI('同步中…');
  try {
    await _pullAndMerge();
    await _pushLocal();
    setData('lastCloudSync', Date.now());
    _renderAccountUI();
  } catch (e) {
    console.error('[sync] 失敗', e);
    _renderAccountUI('同步失敗，稍後重試');
  } finally {
    _syncing = false;
  }
}

// 從雲端拉取，逐鍵「較新者勝」合併到本地
async function _pullAndMerge() {
  const uid = _session.user.id;
  const { data, error } = await _sb.from('user_data').select('data').eq('user_id', uid).maybeSingle();
  if (error) throw error;
  if (!data || !data.data) return;                 // 雲端尚無資料
  const remote = data.data;                        // { values:{}, ts:{} }
  const rTs = remote.ts || {}, rVal = remote.values || {};
  const meta = _syncMeta();
  let changed = false;
  _applyingRemote = true;
  try {
    SYNC_KEYS.forEach(key => {
      const rt = rTs[key] || 0, lt = meta.ts[key] || 0;
      if (rt > lt && rVal[key] !== undefined) {
        localStorage.setItem(key, JSON.stringify(rVal[key]));
        meta.ts[key] = rt;
        changed = true;
      }
    });
  } finally { _applyingRemote = false; }
  localStorage.setItem('syncMeta', JSON.stringify(meta));
  if (changed) _refreshUI();
}

// 把本地目前狀態（含時間戳）推上雲端
async function _pushLocal() {
  const uid = _session.user.id;
  const meta = _syncMeta();
  const values = {};
  SYNC_KEYS.forEach(key => {
    const v = getData(key, undefined);
    if (v !== undefined) values[key] = v;
    if (meta.ts[key] === undefined) meta.ts[key] = Date.now();  // 初次上傳補時間戳
  });
  localStorage.setItem('syncMeta', JSON.stringify(meta));
  const { error } = await _sb.from('user_data').upsert({
    user_id: uid,
    data: { values, ts: meta.ts },
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
  if (error) throw error;
}

function _refreshUI() {
  const p = (typeof state !== 'undefined' && state.currentPage) || 'profile';
  const map = {
    profile: 'renderProfile', diary: 'renderDiary', recipes: 'renderRecipeList',
    fooddb: 'renderFoodDB', workout: 'renderWorkout', habits: 'renderHabits',
    quests: 'renderQuests', inbody: 'renderInbody', achievements: 'renderAchievements',
    settings: 'renderSettings',
  };
  try { window[map[p]]?.(); } catch (_) {}
  try { if (p !== 'profile') window.renderProfile?.(); } catch (_) {}
}

// ---- 帳號 UI（設定頁）----
function _renderAccountUI(statusOverride) {
  const el = document.getElementById('settings-account');
  if (!el) return;
  if (!_session) {
    el.innerHTML = `
      <button class="settings-row" onclick="signInWithGoogle()">
        <div class="settings-row-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.5a9 9 0 1 1-3-6.7"/><polyline points="21 3 21 9 15 9"/></svg>
        </div>
        <div class="settings-row-body">
          <div class="settings-row-label">使用 Google 登入</div>
          <div class="settings-row-desc">跨手機／電腦同步你的紀錄（未登入仍可本地使用）</div>
        </div>
        <svg class="settings-row-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>`;
    return;
  }
  const email = _session.user?.email || _session.user?.user_metadata?.email || '已登入';
  const last = getData('lastCloudSync', null);
  const lastTxt = statusOverride || (last ? `上次同步：${_fmtSyncTime(last)}` : '尚未同步');
  el.innerHTML = `
    <div class="settings-row settings-row-static">
      <div class="settings-row-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </div>
      <div class="settings-row-body">
        <div class="settings-row-label">${email}</div>
        <div class="settings-row-desc" id="sync-status-line">${lastTxt}</div>
      </div>
    </div>
    <div class="settings-row-divider"></div>
    <button class="settings-row" onclick="syncNow()">
      <div class="settings-row-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.4"/><polyline points="21 3 21 9 15 9"/></svg>
      </div>
      <div class="settings-row-body"><div class="settings-row-label">立即同步</div></div>
    </button>
    <div class="settings-row-divider"></div>
    <button class="settings-row" onclick="signOutCloud()">
      <div class="settings-row-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      </div>
      <div class="settings-row-body"><div class="settings-row-label">登出</div></div>
    </button>`;
}

function _fmtSyncTime(ms) {
  const d = new Date(ms);
  const p = n => String(n).padStart(2, '0');
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const t = `${p(d.getHours())}:${p(d.getMinutes())}`;
  return sameDay ? `今天 ${t}` : `${d.getMonth() + 1}/${d.getDate()} ${t}`;
}

document.addEventListener('DOMContentLoaded', initSupabase);
