// ===== 雲端同步（Supabase）=====
// Local-first：所有操作仍先寫 localStorage；本檔只負責「登入 + 每 5 分鐘與雲端同步」。
// 合併策略：每個資料鍵各帶時間戳，同步時「較新者勝」（跨裝置改到不同鍵都會保留）。

const SUPABASE_URL = 'https://auayrnjefzxdfellottr.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-K9YUdArrHEeJejUBxQYiw_UuBToL0C';

// 會同步的資料鍵（使用者內容）。裝置本地/暫存性質的不同步（如 cachedTasks、提醒日期、遷移版本）。
const SYNC_KEYS = [
  'diary', 'foodDB', 'recipes', 'workoutLog', 'weightLog',
  'habits', 'habitLog', 'inbody', 'gamification', 'profile',
  'dailyQuestsDone', 'appTheme', 'askWeightDaily', 'avatarData',
  'deletions',
];
// 墓碑保留天數：超過此天數的刪除記錄會被回收（假設所有裝置都在此期間內同步過一次）
const TOMBSTONE_TTL_MS = 180 * 24 * 60 * 60 * 1000;

// 以 id 為主鍵的「集合」：合併時做「聯集」而非整包覆蓋，避免任一裝置的新增品項被另一裝置蓋掉。
const ID_COLLECTIONS = ['foodDB', 'recipes', 'inbody', 'workoutLog', 'habits'];
// 以日期為 key 的「對照表」：合併日期鍵的聯集（同一天以較新一方為準）。
const DATE_MAPS = ['diary', 'habitLog', 'weightLog'];

// 合併單一鍵：集合做聯集、日期表做鍵聯集，其餘沿用「較新者勝」。
function _mergeValue(key, localVal, remoteVal, remoteNewer) {
  if (ID_COLLECTIONS.includes(key) && Array.isArray(localVal) && Array.isArray(remoteVal)) {
    // 以 id 聯集；同一 id 兩邊都有時，用「該筆的 updatedAt」較新者為準（不是用整包時間戳），
    // 避免「A 裝置整包較新」就把 B 裝置對某一筆的較新編輯蓋掉。平手（含都沒 updatedAt）時保留 primary。
    const primary   = remoteNewer ? remoteVal : localVal;
    const secondary = remoteNewer ? localVal : remoteVal;
    const byId = new Map();
    primary.forEach(x => { if (x && x.id != null) byId.set(x.id, x); });
    secondary.forEach(x => {
      if (!x || x.id == null) return;
      const cur = byId.get(x.id);
      if (!cur) { byId.set(x.id, x); return; }
      if ((x.updatedAt || 0) > (cur.updatedAt || 0)) byId.set(x.id, x);   // 逐筆較新者勝
    });
    return [...byId.values()];
  }
  if (DATE_MAPS.includes(key) && localVal && remoteVal
      && typeof localVal === 'object' && typeof remoteVal === 'object'
      && !Array.isArray(localVal) && !Array.isArray(remoteVal)) {
    const primary   = remoteNewer ? remoteVal : localVal;
    const secondary = remoteNewer ? localVal : remoteVal;
    return Object.assign({}, secondary, primary);   // 同一天的 key 以 primary（較新方）為準
  }
  // 遊戲化資料：成就/稱號聯集、XP/Gold/等級取較高者，避免被較空的一方整包歸零
  if (key === 'gamification' && localVal && remoteVal
      && typeof localVal === 'object' && typeof remoteVal === 'object'
      && !Array.isArray(localVal) && !Array.isArray(remoteVal)) {
    const primary   = remoteNewer ? remoteVal : localVal;   // 非集合欄位以較新方為準
    const secondary = remoteNewer ? localVal : remoteVal;
    const merged = Object.assign({}, secondary, primary);
    // 成就 / 稱號：聯集（任一裝置解過的都保留，不會被另一方蓋成 0）
    merged.achievements = [...new Set([...(localVal.achievements || []), ...(remoteVal.achievements || [])])];
    merged.titles       = [...new Set([...(localVal.titles || []), ...(remoteVal.titles || [])])];
    // 成就取得日期：兩邊聯集，同一成就取較早日期（首次達成才正確）
    const dA = localVal.achievementDates || {}, dB = remoteVal.achievementDates || {};
    const dates = Object.assign({}, dA, dB);
    Object.keys(dates).forEach(id => {
      if (dA[id] && dB[id]) dates[id] = (dA[id] < dB[id] ? dA[id] : dB[id]);
    });
    merged.achievementDates = dates;
    // XP / 金幣 / 等級：較高者勝；等級由合併後的 xp 重算以保持一致
    merged.xp    = Math.max(localVal.xp   || 0, remoteVal.xp   || 0);
    merged.gold  = Math.max(localVal.gold || 0, remoteVal.gold || 0);
    merged.level = (typeof _calcLevel === 'function')
      ? _calcLevel(merged.xp)
      : Math.max(localVal.level || 1, remoteVal.level || 1);
    merged.activeTitle = primary.activeTitle || secondary.activeTitle || '旅人';
    return merged;
  }
  // 墓碑登記表 { 集合鍵: { id: 刪除時間ms } }：深層聯集，同一 id 取較晚的刪除時間
  if (key === 'deletions' && localVal && remoteVal
      && typeof localVal === 'object' && typeof remoteVal === 'object'
      && !Array.isArray(localVal) && !Array.isArray(remoteVal)) {
    const out = {};
    new Set([...Object.keys(localVal), ...Object.keys(remoteVal)]).forEach(coll => {
      const a = localVal[coll] || {}, b = remoteVal[coll] || {};
      const m = {};
      new Set([...Object.keys(a), ...Object.keys(b)]).forEach(id => {
        m[id] = Math.max(a[id] || 0, b[id] || 0);
      });
      out[coll] = m;
    });
    return out;
  }
  return remoteNewer ? remoteVal : localVal;
}
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
      if (rVal[key] === undefined) return;
      const rt = rTs[key] || 0, lt = meta.ts[key] || 0;
      const localVal = getData(key, undefined);
      const remoteNewer = rt > lt;
      const mergedVal = (localVal === undefined)
        ? rVal[key]
        : _mergeValue(key, localVal, rVal[key], remoteNewer);
      const nextStr = JSON.stringify(mergedVal);
      if (nextStr !== JSON.stringify(localVal)) {
        localStorage.setItem(key, nextStr);
        changed = true;
      }
      // 合併後時間戳取兩邊較大值；集合聯集有補進新內容時，標記為本地已更新以便回推雲端
      meta.ts[key] = Math.max(rt, lt);
      if (ID_COLLECTIONS.includes(key) && nextStr !== JSON.stringify(rVal[key])) {
        meta.ts[key] = Date.now();
      }
    });
  } finally { _applyingRemote = false; }

  // ---- 套用墓碑：移除已被刪除的集合項目（含經聯集又被補回來的）----
  const tombs = getData('deletions', {});
  const now = Date.now();
  let tombsChanged = false;
  ID_COLLECTIONS.forEach(key => {
    const arr = getData(key, undefined);
    const t = tombs[key];
    if (!Array.isArray(arr) || !t) return;
    const kept = arr.filter(item => {
      const del = (item && item.id != null) ? t[item.id] : undefined;
      if (del == null) return true;
      return (item.updatedAt || 0) > del;   // 只有「刪除之後又被編輯」才保留，否則移除
    });
    if (kept.length !== arr.length) {
      localStorage.setItem(key, JSON.stringify(kept));
      meta.ts[key] = now;                    // 標記本地已變更，讓刪除結果回推雲端
      changed = true;
    }
  });
  // ---- 回收過期墓碑（超過 TTL）----
  Object.keys(tombs).forEach(coll => {
    Object.keys(tombs[coll]).forEach(id => {
      if (now - (tombs[coll][id] || 0) > TOMBSTONE_TTL_MS) { delete tombs[coll][id]; tombsChanged = true; }
    });
    if (!Object.keys(tombs[coll]).length) { delete tombs[coll]; tombsChanged = true; }
  });
  if (tombsChanged) { localStorage.setItem('deletions', JSON.stringify(tombs)); }

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
