// ================================================================
//  冒險者食譜典籍 — app.js  v9
// ================================================================

// ===== CONSTANTS =====
const PAGE_ORDER = ['recipes', 'fooddb', 'diary', 'quests', 'workout', 'habits', 'habit-detail', 'profile', 'settings', 'achievements', 'inbody'];
const SUB_PAGE_PARENT = { fooddb: 'recipes', inbody: 'profile', 'habit-detail': 'habits', achievements: 'profile', settings: 'profile' };

// ===== THEMES =====
const THEMES = [
  { id:'sage',     name:'鼠尾草綠', sage:'#4D6A55', sageMid:'#6A8B72', sageLight:'#A0BDA8', sagePale:'#EBF2EC', sageFaint:'#F4F8F5', sageMuted:'#C8D8CA' },
  { id:'ocean',    name:'深海藍',   sage:'#2E6B9E', sageMid:'#4A8BBF', sageLight:'#82B4D8', sagePale:'#E3EFF8', sageFaint:'#F2F7FC', sageMuted:'#B0CCE4' },
  { id:'rose',     name:'玫瑰粉',   sage:'#9E4E6B', sageMid:'#BF6A87', sageLight:'#D8A0B4', sagePale:'#F8E8EE', sageFaint:'#FCF3F6', sageMuted:'#E4B8C8' },
  { id:'amber',    name:'琥珀金',   sage:'#8A6520', sageMid:'#AA8038', sageLight:'#C8A565', sagePale:'#F5EDD8', sageFaint:'#FAF6ED', sageMuted:'#E0C88A' },
  { id:'teal',     name:'湖水青',   sage:'#2A7A7A', sageMid:'#3D9898', sageLight:'#6DBDBD', sagePale:'#D8F0F0', sageFaint:'#ECF8F8', sageMuted:'#8AD8D8' },
  { id:'lavender', name:'薰衣草紫', sage:'#5D4A8A', sageMid:'#7D64A8', sageLight:'#A898CC', sagePale:'#EDE8F5', sageFaint:'#F5F3FA', sageMuted:'#C8B8E0' },
];

function applyTheme(id) {
  const t = THEMES.find(x => x.id === id) || THEMES[0];
  const s = document.documentElement.style;
  s.setProperty('--sage',       t.sage);
  s.setProperty('--sage-mid',   t.sageMid);
  s.setProperty('--sage-light', t.sageLight);
  s.setProperty('--sage-pale',  t.sagePale);
  s.setProperty('--sage-faint', t.sageFaint);
  s.setProperty('--sage-muted', t.sageMuted);
  s.setProperty('--gold-dark',  t.sage);
  s.setProperty('--gold-light', t.sageMid);
}

function selectTheme(id) {
  setData('appTheme', id);
  applyTheme(id);
  renderThemePicker();
}

function renderThemePicker() {
  const el = document.getElementById('theme-picker');
  if (!el) return;
  const current = getData('appTheme', 'sage');
  el.innerHTML = THEMES.map(t => `
    <button class="theme-swatch ${t.id === current ? 'active' : ''}" onclick="selectTheme('${t.id}')">
      <div class="theme-swatch-circle" style="background:${t.sage}">
        ${t.id === current ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` : ''}
      </div>
      <div class="theme-swatch-name">${t.name}</div>
    </button>`).join('');
}
const MEALS = ['早餐', '午餐', '晚餐', '點心'];
const MEAL_ICONS = { '早餐':'sunrise', '午餐':'sun', '晚餐':'moon', '點心':'apple' };

// ===== ICON SYSTEM =====
const ICONS = {
  'activity':   '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  'apple':      '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06z"/><path d="M10 2c1 .5 2 2 2 5"/>',
  'book-open':  '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  'calculator': '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="11" y2="11"/><line x1="12" x2="12" y1="11" y2="11"/><line x1="8" x2="8" y1="11" y2="11"/><line x1="16" x2="16" y1="15" y2="15"/><line x1="12" x2="12" y1="15" y2="15"/><line x1="8" x2="8" y1="15" y2="15"/><line x1="16" x2="16" y1="19" y2="19"/><line x1="12" x2="12" y1="19" y2="19"/><line x1="8" x2="8" y1="19" y2="19"/>',
  'calendar':   '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
  'dumbbell':   '<path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/>',
  'flame':      '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z"/>',
  'image':      '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
  'info':       '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  'leaf':       '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
  'list':       '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/>',
  'moon':       '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  'search':     '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'sun':        '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  'sunrise':    '<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>',
  'target':     '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  'timer':      '<line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/>',
  'trash-2':    '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  'user':       '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'utensils':   '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  'zap':          '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  'trophy':       '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>',
  'star':         '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  'chevron-right':'<path d="m9 18 6-6-6-6"/>',
  'award':        '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',
  'flag':         '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  'circle-dot':   '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>',
  'coins':        '<circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18"/><path d="M7 6h1v4"/>',
  'pencil':       '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  'pen-left':     '<path style="fill:currentColor;stroke:none" d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
  'bell':         '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  'alert-triangle':'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>',
  'lightbulb':    '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  'droplet':      '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  'book':         '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 11h8"/><path d="M8 7h6"/>',
};
function icon(name, size = 16) {
  const p = ICONS[name] || '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;flex-shrink:0">${p}</svg>`;
}

// ================================================================
//  GAMIFICATION CONSTANTS
// ================================================================
const LEVEL_TABLE = [
  { level:1,  name:'旅人',       xp:0 },
  { level:2,  name:'廚房學徒',   xp:100 },
  { level:3,  name:'食材採集者', xp:250 },
  { level:4,  name:'行腳廚師',   xp:500 },
  { level:5,  name:'健康冒險者', xp:900 },
  { level:6,  name:'鍛鍊勇士',   xp:1400 },
  { level:7,  name:'飲食騎士',   xp:2100 },
  { level:8,  name:'精英戰士',   xp:3000 },
  { level:9,  name:'體能賢者',   xp:4200 },
  { level:10, name:'傳說廚師',   xp:6000 },
  { level:11, name:'不滅勇者',   xp:8500 },
  { level:12, name:'奧義探求者', xp:12000 },
  { level:13, name:'健康守護者', xp:17000 },
  { level:14, name:'龍的傳人',   xp:24000 },
  { level:15, name:'奇幻大師',   xp:34000 },
];

const ACHIEVEMENTS_DEF = {
  // food
  first_meal:   { name:'第一口',     desc:'記錄第一筆飲食',                     icon:'utensils', cat:'food' },
  meal_10:      { name:'十日糧草',   desc:'累計有飲食記錄的日子達 10 天',       icon:'calendar', cat:'food' },
  meal_30:      { name:'月之倉庫',   desc:'累計有飲食記錄的日子達 30 天',       icon:'calendar', cat:'food' },
  diary_50:     { name:'勤奮紀錄者', desc:'累計有飲食記錄的日子達 50 天',       icon:'list',     cat:'food' },
  diary_100:    { name:'百日廚師',   desc:'累計有飲食記錄的日子達 100 天',      icon:'list',     cat:'food' },
  diary_365:    { name:'歲月廚神',   desc:'累計有飲食記錄的日子達 365 天',      icon:'trophy',   cat:'food' },
  triple_crown: { name:'三餐勇士',   desc:'同一天記錄早、午、晚三餐',           icon:'sun',      cat:'food' },
  goal_hit:     { name:'精準打擊',   desc:'當日熱量達成目標（±10% 以內）',     icon:'target',   cat:'food' },
  goal_week:    { name:'均衡使者',   desc:'連續 7 天達成熱量目標',              icon:'flame',    cat:'food' },
  goal_month:   { name:'月度達標',   desc:'連續 30 天達成熱量目標',             icon:'star',     cat:'food' },
  variety_5:    { name:'食材探險家', desc:'在日誌中記錄超過 5 種不同食物',      icon:'leaf',     cat:'food' },
  variety_15:   { name:'百草採集',   desc:'在日誌中記錄超過 15 種不同食物',     icon:'leaf',     cat:'food' },
  variety_30:   { name:'食材圖鑑',   desc:'在日誌中記錄超過 30 種不同食物',     icon:'leaf',     cat:'food' },
  // workout
  first_workout:     { name:'初次鍛鍊',   desc:'記錄第一筆運動',                icon:'dumbbell', cat:'workout' },
  cardio_10:         { name:'心肺鬥士',   desc:'累計記錄 10 次有氧運動',        icon:'activity', cat:'workout' },
  cardio_30:         { name:'風馳電掣',   desc:'累計記錄 30 次有氧運動',        icon:'activity', cat:'workout' },
  strength_10:       { name:'鐵器之魂',   desc:'累計記錄 10 次無氧訓練',        icon:'dumbbell', cat:'workout' },
  strength_30:       { name:'力拔山河',   desc:'累計記錄 30 次無氧訓練',        icon:'dumbbell', cat:'workout' },
  both_same_day:     { name:'全能戰士',   desc:'同一天同時記錄有氧和無氧',      icon:'zap',      cat:'workout' },
  workout_streak_7:  { name:'不休勇者',   desc:'連續 7 天都有運動記錄',         icon:'flame',    cat:'workout' },
  workout_streak_30: { name:'鐵人之志',   desc:'連續 30 天都有運動記錄',        icon:'flame',    cat:'workout' },
  workout_30_total:  { name:'三十日磨劍', desc:'累計運動記錄達 30 次',          icon:'target',   cat:'workout' },
  workout_100_total: { name:'百鍊成鋼',   desc:'累計運動記錄達 100 次',         icon:'trophy',   cat:'workout' },
  // streak
  streak_3:   { name:'三日之約', desc:'飲食連續記錄 3 天',    icon:'zap',   cat:'streak' },
  streak_7:   { name:'週行不怠', desc:'飲食連續記錄 7 天',    icon:'flame', cat:'streak' },
  streak_14:  { name:'兩週磨礪', desc:'飲食連續記錄 14 天',   icon:'flame', cat:'streak' },
  streak_30:  { name:'月之誓約', desc:'飲食連續記錄 30 天',   icon:'star',  cat:'streak' },
  streak_100: { name:'傳說連鎖', desc:'飲食連續記錄 100 天',  icon:'trophy',cat:'streak' },
  streak_200: { name:'神話之路', desc:'飲食連續記錄 200 天',  icon:'trophy',cat:'streak' },
  streak_365: { name:'歲月長河', desc:'飲食連續記錄整整一年', icon:'trophy',cat:'streak' },
  // recipe
  recipe_first:    { name:'初心料理人', desc:'建立第一道食譜',                     icon:'utensils', cat:'recipe' },
  recipe_10:       { name:'食譜收藏家', desc:'累積收藏食譜達 10 道',               icon:'book-open',cat:'recipe' },
  recipe_30:       { name:'私房食譜庫', desc:'累積收藏食譜達 30 道',               icon:'list',     cat:'recipe' },
  recipe_with_img: { name:'用心擺盤',   desc:'建立一道附有照片的食譜',             icon:'camera',   cat:'recipe' },
  // quest
  quest_first:     { name:'踏上旅途',   desc:'完成第一個每日任務',             icon:'flag',    cat:'quest' },
  quest_main_done: { name:'主線完成者', desc:'完成一天所有的主線任務',          icon:'target',  cat:'quest' },
  quest_all_done:  { name:'全任務達成', desc:'一天內完成全部主線＋支線任務',    icon:'trophy',  cat:'quest' },
  quest_week:      { name:'七日英雄',   desc:'連續 7 天完成所有主線任務',       icon:'flame',   cat:'quest' },
  quest_month:     { name:'月之勇者',   desc:'連續 30 天完成所有主線任務',      icon:'star',    cat:'quest' },
  quest_100:       { name:'傳說主線',   desc:'累計完成主線任務達 100 天',       icon:'trophy',  cat:'quest' },
  // habit
  habit_first:      { name:'習慣萌芽',  desc:'第一次打卡完成任意習慣',          icon:'leaf',    cat:'habit', trigger:'打卡任意習慣一次即可' },
  habit_streak_7:   { name:'有恆之心',  desc:'任意習慣連續達成 7 天',           icon:'flame',   cat:'habit', trigger:'任意習慣連續打卡即可' },
  habit_streak_30:  { name:'意志磐石',  desc:'任意習慣連續達成 30 天',          icon:'star',    cat:'habit', trigger:'任意習慣連續打卡即可' },
  habit_streak_100: { name:'習慣大師',  desc:'任意習慣連續達成 100 天',         icon:'trophy',  cat:'habit', trigger:'任意習慣連續打卡即可' },
  read_7:           { name:'書頁初翻',  desc:'閱讀習慣連續達成 7 天',           icon:'book',    cat:'habit', trigger:'習慣名稱含：閱讀、讀書、看書' },
  read_30:          { name:'書蟲',      desc:'閱讀習慣連續達成 30 天',          icon:'book',    cat:'habit', trigger:'習慣名稱含：閱讀、讀書、看書' },
  read_100:         { name:'書香傳說',  desc:'閱讀習慣連續達成 100 天',         icon:'book',    cat:'habit', trigger:'習慣名稱含：閱讀、讀書、看書' },
  water_7:          { name:'補水戰士',  desc:'喝水習慣連續達成 7 天',           icon:'droplet', cat:'habit', trigger:'習慣名稱含：喝水、飲水、補水' },
  water_30:         { name:'水之門徒',  desc:'喝水習慣連續達成 30 天',          icon:'droplet', cat:'habit', trigger:'習慣名稱含：喝水、飲水、補水' },
  no_sugar_7:       { name:'甜蜜抵抗',  desc:'戒含糖飲料習慣連續達成 7 天',     icon:'zap',     cat:'habit', trigger:'習慣名稱含：戒糖、含糖、戒飲料、無糖、戒含糖' },
  no_sugar_30:      { name:'戒糖英雄',  desc:'戒含糖飲料習慣連續達成 30 天',    icon:'star',    cat:'habit', trigger:'習慣名稱含：戒糖、含糖、戒飲料、無糖、戒含糖' },
  no_sugar_100:     { name:'純淨傳說',  desc:'戒含糖飲料習慣連續達成 100 天',   icon:'trophy',  cat:'habit', trigger:'習慣名稱含：戒糖、含糖、戒飲料、無糖、戒含糖' },
  // food_item (食材成就)
  chicken_30:       { name:'雞肉常客',   desc:'雞肉類食材累計記錄 30 次',        icon:'utensils', cat:'food_item', trigger:'食物名稱含：雞肉、雞胸、雞腿、雞里肌、雞翅、雞柳等' },
  chicken_100:      { name:'雞的殺手',   desc:'雞肉類食材累計記錄 100 次',       icon:'utensils', cat:'food_item', trigger:'食物名稱含：雞肉、雞胸、雞腿、雞里肌、雞翅、雞柳等' },
  beef_30:          { name:'牛排戰士',   desc:'牛肉類食材累計記錄 30 次',        icon:'utensils', cat:'food_item', trigger:'食物名稱含：牛肉、牛排、牛腩、漢堡排、沙朗、菲力等' },
  beef_80:          { name:'牛肉征服者', desc:'牛肉類食材累計記錄 80 次',        icon:'trophy',   cat:'food_item', trigger:'食物名稱含：牛肉、牛排、牛腩、漢堡排、沙朗、菲力等' },
  pork_30:          { name:'豬肉達人',   desc:'豬肉類食材累計記錄 30 次',        icon:'utensils', cat:'food_item', trigger:'食物名稱含：豬肉、豬排、豬里肌、五花肉、梅花肉等' },
  pork_80:          { name:'豬肉傳說',   desc:'豬肉類食材累計記錄 80 次',        icon:'trophy',   cat:'food_item', trigger:'食物名稱含：豬肉、豬排、豬里肌、五花肉、梅花肉等' },
  egg_50:           { name:'蛋的狂徒',   desc:'蛋類食材累計記錄 50 次',          icon:'sun',      cat:'food_item', trigger:'食物名稱含：雞蛋、全蛋、蛋白、水煮蛋、荷包蛋、溏心蛋等' },
  egg_150:          { name:'健身蛋神',   desc:'蛋類食材累計記錄 150 次',         icon:'trophy',   cat:'food_item', trigger:'食物名稱含：雞蛋、全蛋、蛋白、水煮蛋、荷包蛋、溏心蛋等' },
  fish_30:          { name:'漁獲常客',   desc:'魚類食材累計記錄 30 次',          icon:'activity', cat:'food_item', trigger:'食物名稱含：鮭魚、鯖魚、鱈魚、秋刀魚、鮪魚、魚等' },
  fish_100:         { name:'海洋掠食者', desc:'魚類食材累計記錄 100 次',         icon:'trophy',   cat:'food_item', trigger:'食物名稱含：鮭魚、鯖魚、鱈魚、秋刀魚、鮪魚、魚等' },
  broccoli_30:      { name:'健康先知',   desc:'花椰菜類累計記錄 30 次',          icon:'leaf',     cat:'food_item', trigger:'食物名稱含：花椰菜、青花菜、白花椰、綠花椰' },
  sweet_potato_30:  { name:'地瓜信徒',   desc:'地瓜類食材累計記錄 30 次',        icon:'leaf',     cat:'food_item', trigger:'食物名稱含：地瓜、甘薯、番薯' },
  tofu_30:          { name:'豆腐俠',     desc:'豆腐類食材累計記錄 30 次',        icon:'leaf',     cat:'food_item', trigger:'食物名稱含：豆腐、嫩豆腐、板豆腐、豆干、百頁豆腐' },
  avocado_20:       { name:'酪梨貴族',   desc:'酪梨累計記錄 20 次',              icon:'leaf',     cat:'food_item', trigger:'食物名稱含：酪梨、牛油果' },
  oat_60:           { name:'燕麥傳道士', desc:'燕麥類食材累計記錄 60 次',        icon:'list',     cat:'food_item', trigger:'食物名稱含：燕麥、麥片、燕麥片' },
  // progress (等級與金幣)
  level_3:    { name:'初露鋒芒',  desc:'達到等級 3：食材採集者',             icon:'star',   cat:'progress' },
  level_5:    { name:'冒險者',    desc:'達到等級 5：健康冒險者',             icon:'trophy', cat:'progress' },
  level_10:   { name:'傳說十級',  desc:'達到等級 10：傳說廚師',              icon:'trophy', cat:'progress' },
  max_level:  { name:'奇幻大師',  desc:'達到等級 15，登頂',                  icon:'trophy', cat:'progress' },
  gold_500:   { name:'財富初現',  desc:'累計持有金幣達 500',                 icon:'coins',  cat:'progress' },
  gold_2000:  { name:'黃金獵手',  desc:'累計持有金幣達 2000',                icon:'coins',  cat:'progress' },
  gold_5000:  { name:'金幣精通',  desc:'累計持有金幣達 5000',                icon:'coins',  cat:'progress' },
  gold_10000: { name:'黃金帝國',  desc:'累計持有金幣達 10000',               icon:'coins',  cat:'progress' },
  gold_50000: { name:'傳說富豪',  desc:'累計持有金幣達 50000',               icon:'coins',  cat:'progress' },
  // combo (複合成就)
  goal_workout_same:     { name:'完美一擊',   desc:'同一天達成熱量目標且有運動記錄',          icon:'zap',      cat:'combo' },
  diet_workout_7:        { name:'動靜均衡',   desc:'連續 7 天同時有飲食記錄和運動記錄',       icon:'flame',    cat:'combo' },
  diet_workout_30:       { name:'均衡鬥士',   desc:'連續 30 天同時有飲食記錄和運動記錄',      icon:'flame',    cat:'combo' },
  goal_workout_7:        { name:'完美週',     desc:'連續 7 天達成熱量目標且有運動記錄',       icon:'star',     cat:'combo' },
  variety_workout_combo: { name:'探索之道',   desc:'食材種類達 20 種且累計運動達 50 次',      icon:'leaf',     cat:'combo' },
  streak_habit_combo:    { name:'雙軌並行',   desc:'飲食連續 30 天且任意習慣連續 30 天',      icon:'activity', cat:'combo' },
  quest_diary_7:         { name:'任務廚師',   desc:'連續 7 天完成所有主線任務且有飲食記錄',   icon:'flag',     cat:'combo' },
  // hidden (desc shown only after unlock)
  new_year:       { name:'年初立志',   desc:'在特別的日子記錄',              icon:'star',   cat:'hidden', hint:'在特別的日子記錄' },
  all_4_meals:    { name:'完整一日',   desc:'四餐全記',                      icon:'sun',    cat:'hidden', hint:'四餐全記' },
  comeback:       { name:'浴火重生',   desc:'跌倒了再站起來',                icon:'flame',  cat:'hidden', hint:'跌倒了再站起來' },
  comeback_epic:  { name:'傳奇重生',   desc:'沉寂一個月後東山再起',          icon:'flame',  cat:'hidden', hint:'沉寂一個月後東山再起' },
  night_owl:      { name:'夜梟廚師',   desc:'深夜也沒忘記記錄',              icon:'moon',   cat:'hidden', hint:'深夜也沒忘記記錄' },
  early_bird:     { name:'晨曦使者',   desc:'黎明之前就開始記錄',            icon:'sun',    cat:'hidden', hint:'黎明之前就開始記錄' },
  perfect_day:    { name:'完美一日',   desc:'吃好、動好、任務全清',          icon:'star',   cat:'hidden', hint:'吃好、動好、任務全清' },
  protein_7:      { name:'蛋白霸主',   desc:'連續 7 天達成蛋白質目標',       icon:'zap',    cat:'hidden', hint:'連續 7 天達成蛋白質目標' },
  weekend_warrior:{ name:'假日英雄',   desc:'週末也不停歇的鐵人',            icon:'dumbbell',cat:'hidden', hint:'週末也不停歇的鐵人' },
};

const HABIT_KEYWORD_GROUPS = {
  read:     ['閱讀','讀書','看書','reading','read'],
  water:    ['喝水','飲水','補水','water','drink water'],
  no_sugar: ['戒糖','含糖','戒飲料','無糖','no sugar','戒含糖'],
};

const FOOD_KEYWORD_GROUPS = {
  chicken:      ['雞肉','雞胸','雞腿','雞里肌','雞翅','雞柳','雞絞肉','雞腿排','雞胸肉','雞心','雞肝'],
  beef:         ['牛肉','牛排','牛腩','牛絞肉','牛里肌','牛腱','漢堡排','沙朗','菲力','牛小排'],
  pork:         ['豬肉','豬排','豬里肌','豬腩','豬絞肉','豬腳','梅花肉','五花肉','腰內肉'],
  egg:          ['雞蛋','全蛋','蛋白','水煮蛋','荷包蛋','炒蛋','溏心蛋'],
  fish:         ['鮭魚','鯖魚','鱈魚','秋刀魚','吳郭魚','石斑魚','鰻魚','鮪魚','旗魚','鯛魚'],
  broccoli:     ['花椰菜','青花菜','白花椰','綠花椰','花椰'],
  sweet_potato: ['地瓜','甘薯','番薯'],
  tofu:         ['豆腐','嫩豆腐','板豆腐','豆干','百頁豆腐'],
  avocado:      ['酪梨','牛油果'],
  oat:          ['燕麥','麥片','燕麥片'],
};

const TITLES_DEF = [
  { id:'旅人',       unlock:'default' },
  { id:'三餐勇士',   unlock:'triple_crown' },
  { id:'心肺鬥士',   unlock:'cardio_10' },
  { id:'鐵器之魂',   unlock:'strength_10' },
  { id:'全能戰士',   unlock:'both_same_day' },
  { id:'均衡使者',   unlock:'goal_week' },
  { id:'月度達標',   unlock:'goal_month' },
  { id:'不休勇者',   unlock:'workout_streak_7' },
  { id:'鐵人之志',   unlock:'workout_streak_30' },
  { id:'百鍊成鋼',   unlock:'workout_100_total' },
  { id:'風馳電掣',   unlock:'cardio_30' },
  { id:'力拔山河',   unlock:'strength_30' },
  { id:'月之誓約者', unlock:'streak_30' },
  { id:'傳說連鎖',   unlock:'streak_100' },
  { id:'神話之路',   unlock:'streak_200' },
  { id:'歲月長河',   unlock:'streak_365' },
  { id:'百日廚師',   unlock:'diary_100' },
  { id:'歲月廚神',   unlock:'diary_365' },
  { id:'食材圖鑑',   unlock:'variety_30' },
  { id:'浴火重生',   unlock:'comeback' },
  { id:'傳奇重生',   unlock:'comeback_epic' },
  { id:'奇幻大師',   unlock:'max_level' },
  { id:'踏上旅途',   unlock:'quest_first' },
  { id:'全任務達成', unlock:'quest_all_done' },
  { id:'七日英雄',   unlock:'quest_week' },
  { id:'月之勇者',   unlock:'quest_month' },
  { id:'傳說主線',   unlock:'quest_100' },
  { id:'意志磐石',   unlock:'habit_streak_30' },
  { id:'習慣大師',   unlock:'habit_streak_100' },
  { id:'書香傳說',   unlock:'read_100' },
  { id:'水之門徒',   unlock:'water_30' },
  { id:'純淨傳說',   unlock:'no_sugar_100' },
  { id:'晨曦使者',   unlock:'early_bird' },
  { id:'完美鬥士',   unlock:'perfect_day' },
  { id:'蛋白霸主',   unlock:'protein_7' },
  { id:'假日英雄',   unlock:'weekend_warrior' },
  // progress titles
  { id:'初露鋒芒',   unlock:'level_3' },
  { id:'冒險者',     unlock:'level_5' },
  { id:'傳說廚師',   unlock:'level_10' },
  { id:'奇幻大師',   unlock:'max_level' },
  { id:'黃金獵手',   unlock:'gold_2000' },
  { id:'黃金帝國',   unlock:'gold_10000' },
  { id:'傳說富豪',   unlock:'gold_50000' },
  // combo titles
  { id:'均衡鬥士',   unlock:'diet_workout_30' },
  { id:'完美週士',   unlock:'goal_workout_7' },
  { id:'雙軌並行',   unlock:'streak_habit_combo' },
  { id:'任務廚師',   unlock:'quest_diary_7' },
  // food_item titles
  { id:'雞的殺手',   unlock:'chicken_100' },
  { id:'牛肉征服者', unlock:'beef_80' },
  { id:'豬肉傳說',   unlock:'pork_80' },
  { id:'健身蛋神',   unlock:'egg_150' },
  { id:'海洋掠食者', unlock:'fish_100' },
  { id:'健康先知',   unlock:'broccoli_30' },
  { id:'地瓜信徒',   unlock:'sweet_potato_30' },
  { id:'豆腐俠',     unlock:'tofu_30' },
  { id:'酪梨貴族',   unlock:'avocado_20' },
  { id:'燕麥傳道士', unlock:'oat_60' },
];

// 16 preset habit colors
const HABIT_COLORS = [
  '#4D6A55','#2D6B44','#3D7A73','#4A7FA5',
  '#3A4E78','#6B4E8A','#A85478','#C44060',
  '#D98866','#D4732A','#C49A2A','#7A9E3B',
  '#4D9E7A','#B8956A','#5A6E7A','#7A6E5A'
];

// ===== STATE =====
const state = {
  currentPage: 'profile',
  currentDate: todayStr(),
  habitCalYear: new Date().getFullYear(),
  habitCalMonth: new Date().getMonth(),
  editingRecipeId: null,
  selectedFoodForDiary: null,
  selectedRecipeForDiary: null,
  currentFoodCategory: '全部',
  currentFoodSearch: '',
  ingredientCount: 0,
  stepCount: 0,
  isAnimating: false,
};

// ===== STORAGE =====
function getData(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
  catch { return def; }
}
function setData(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) { console.error(e); }
}

function initStorage() {
  if (!getData('foodDB', null)) setData('foodDB', DEFAULT_FOOD_DB);
  if (!getData('recipes', null)) setData('recipes', []);
  if (!getData('diary', null)) setData('diary', {});
  if (!getData('profile', null)) setData('profile', { name:'冒險者', goals: defaultGoals() });
  if (!getData('gamification', null)) setData('gamification', {
    xp: 0, level: 1, achievements: [], titles: ['旅人'], activeTitle: '旅人', gold: 0,
  });
}

function defaultGoals() {
  return { calories: 2000, protein: 120, fat: 65, carbs: 250, fiber: 25 };
}

// ===== UTILITIES =====
function r(n, dec=1) { return Math.round(n * Math.pow(10,dec)) / Math.pow(10,dec); }

function generateId(prefix) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2,5);
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function formatDisplayDate(ds) {
  if (!ds) return '';
  const [y, m, d] = ds.split('-').map(Number);
  const date = new Date(y, m-1, d);
  const days = ['日','一','二','三','四','五','六'];
  const wd = days[date.getDay()];
  const isToday = ds === todayStr();
  const label = isToday ? ' (今日)' : '';
  return `${y}年${m}月${d}日（${wd}）${label}`;
}

function stateBadgeClass(state) {
  const map = { '生食':'badge-raw', '熟食':'badge-cooked', '加工品':'badge-processed', '飲品':'badge-drink' };
  return map[state] || 'badge-processed';
}

function calcNutrition(food, grams) {
  const m = grams / 100;
  return {
    calories: r(food.per100g.calories * m),
    protein:  r(food.per100g.protein  * m),
    fat:      r(food.per100g.fat      * m),
    carbs:    r(food.per100g.carbs    * m),
    fiber:    r(food.per100g.fiber    * m),
  };
}

function getDailyTotals(ds) {
  const diary = getData('diary', {});
  const entries = diary[ds] || [];
  return entries.reduce((acc, e) => {
    acc.calories += e.nutrition?.calories || 0;
    acc.protein  += e.nutrition?.protein  || 0;
    acc.fat      += e.nutrition?.fat      || 0;
    acc.carbs    += e.nutrition?.carbs    || 0;
    acc.fiber    += e.nutrition?.fiber    || 0;
    return acc;
  }, { calories:0, protein:0, fat:0, carbs:0, fiber:0 });
}

// ===== TOAST =====
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ===== CONFIRM DIALOG =====
function showConfirm(msg, onConfirm, confirmLabel = '確認刪除') {
  const overlay = document.createElement('div');
  overlay.className = 'confirm-overlay';
  const isDanger = confirmLabel === '確認刪除' || confirmLabel.includes('刪除');
  overlay.innerHTML = `
    <div class="confirm-box">
      <div class="confirm-msg">${msg}</div>
      <div class="confirm-actions">
        <button class="btn-ghost" id="conf-cancel">取消</button>
        <button class="${isDanger ? 'btn-danger' : 'btn-primary'}" id="conf-ok">${confirmLabel}</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.querySelector('#conf-cancel').onclick = () => overlay.remove();
  overlay.querySelector('#conf-ok').onclick = () => { overlay.remove(); onConfirm(); };
}

// ===== NAVIGATION =====
function navigateTo(pageId) {
  if (pageId === state.currentPage || state.isAnimating) return;
  state.isAnimating = true;

  const fromId = state.currentPage;
  const fromIdx = PAGE_ORDER.indexOf(fromId);
  const toIdx   = PAGE_ORDER.indexOf(pageId);
  const dir = toIdx > fromIdx ? 'forward' : 'backward';

  const fromPage = document.getElementById(`page-${fromId}`);
  const toPage   = document.getElementById(`page-${pageId}`);

  // Glare sweep
  const glare = document.createElement('div');
  glare.className = 'page-glare';
  document.getElementById('app').appendChild(glare);
  setTimeout(() => glare.remove(), 520);

  fromPage.classList.remove('active');
  fromPage.classList.add(`flip-out-${dir}`);
  toPage.classList.add(`flip-in-${dir}`);

  state.currentPage = pageId;
  updateNavBar(pageId);

  setTimeout(() => {
    fromPage.classList.remove(`flip-out-${dir}`);
    toPage.classList.remove(`flip-in-${dir}`);
    toPage.classList.add('active');
    state.isAnimating = false;
    onPageEnter(pageId);
  }, 300);
}

function updateNavBar(pageId) {
  // For sub-pages, highlight the parent tab instead
  const navPage = SUB_PAGE_PARENT[pageId] || pageId;
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === navPage);
  });
}

function onPageEnter(pageId) {
  if (pageId === 'recipes') renderRecipeList();
  if (pageId === 'fooddb')  renderFoodDB();
  if (pageId === 'diary')   renderDiary();
  if (pageId === 'quests')  renderQuests();
  if (pageId === 'workout') renderWorkout();
  if (pageId === 'habits')       renderHabits();
  if (pageId === 'habit-detail') renderHabitDetail();
  if (pageId === 'profile')       renderProfile();
  if (pageId === 'achievements')  renderAchievements();
  if (pageId === 'inbody')        renderInbody();
  if (pageId === 'settings')      renderThemePicker();
}

// ===== MODAL & SHEET =====
function openModal(id) {
  const el = document.getElementById(id);
  el.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
  document.body.style.overflow = '';
}
function openBottomSheet(id) {
  const el = document.getElementById(id);
  el.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeBottomSheet(id) {
  document.getElementById(id).style.display = 'none';
  document.body.style.overflow = '';
}

// ===== RECIPES =====
function renderRecipeList() {
  filterRecipes();
}

function filterRecipes() {
  const q = (document.getElementById('recipe-search-q')?.value || '').trim().toLowerCase();
  const recipes = getData('recipes', []);
  const container = document.getElementById('recipe-list');
  if (!container) return;

  if (!recipes.length) {
    container.innerHTML = `<div class="recipe-empty"><div class="empty-icon">${icon('book-open', 48)}</div><p>尚無食譜<br>點擊右下角「＋」新增第一道料理！</p></div>`;
    return;
  }

  const filtered = q ? recipes.filter(r =>
    r.name.toLowerCase().includes(q)
    || (r.notes || '').toLowerCase().includes(q)
    || (r.ingredients || []).some(i => i.name.toLowerCase().includes(q))
    || (r.steps || []).some(s => s.toLowerCase().includes(q))
  ) : recipes;

  if (!filtered.length) {
    container.innerHTML = `<div class="recipe-empty"><p style="padding-top:60px">找不到相符的食譜</p></div>`;
    return;
  }
  container.innerHTML = filtered.map(recipe => `
    <div class="recipe-card" onclick="openRecipeDetail('${recipe.id}')">
      ${recipe.image
        ? `<img class="recipe-card-img" src="${recipe.image}" alt="${recipe.name}" loading="lazy">`
        : `<div class="recipe-card-img-placeholder">${icon('utensils', 32)}</div>`}
      <div class="recipe-card-body">
        <div class="recipe-card-name">${recipe.name}</div>
        <div class="recipe-card-meta">
          <span>${icon('timer', 13)} ${recipe.time || '?'}分</span>
          <span>${icon('flame', 13)} ${recipe.nutrition?.calories || 0}kcal</span>
        </div>
      </div>
    </div>`).join('');
}

function openRecipeDetail(recipeId) {
  const recipe = getData('recipes', []).find(r => r.id === recipeId);
  if (!recipe) return;
  state.editingRecipeId = recipeId;
  document.getElementById('detail-title').textContent = recipe.name;

  document.getElementById('recipe-detail-body').innerHTML = `
    ${recipe.image
      ? `<img class="recipe-detail-img" src="${recipe.image}" alt="${recipe.name}">`
      : `<div class="recipe-detail-img-placeholder">${icon('utensils', 48)}</div>`}
    <div class="recipe-detail-body">
      <div class="recipe-meta-row">
        <div class="recipe-meta-item">
          <div class="recipe-meta-value">${icon('timer', 16)} ${recipe.time || '?'}</div>
          <div class="recipe-meta-label">分鐘</div>
        </div>
        <div class="recipe-meta-item">
          <div class="recipe-meta-value">${icon('flame', 16)} ${recipe.nutrition?.calories || 0}</div>
          <div class="recipe-meta-label">kcal</div>
        </div>
        <div class="recipe-meta-item">
          <div class="recipe-meta-value">${icon('dumbbell', 16)} ${recipe.nutrition?.protein || 0}g</div>
          <div class="recipe-meta-label">蛋白質</div>
        </div>
      </div>

      <div class="nutrition-card">
        <div class="nutrition-card-title">✦ 完整營養素資訊 ✦</div>
        <div class="nutrition-row">
          <div class="nut-cell"><span class="nut-value">${recipe.nutrition?.calories||0}</span><span class="nut-label">熱量 kcal</span></div>
          <div class="nut-cell"><span class="nut-value">${recipe.nutrition?.protein||0}</span><span class="nut-label">蛋白質 g</span></div>
          <div class="nut-cell"><span class="nut-value">${recipe.nutrition?.fat||0}</span><span class="nut-label">脂肪 g</span></div>
          <div class="nut-cell"><span class="nut-value">${recipe.nutrition?.carbs||0}</span><span class="nut-label">碳水 g</span></div>
          <div class="nut-cell"><span class="nut-value">${recipe.nutrition?.fiber||0}</span><span class="nut-label">纖維 g</span></div>
        </div>
      </div>

      ${recipe.ingredients?.length ? `
        <div class="section-title">食材清單</div>
        <ul class="ingredient-list-display">
          ${recipe.ingredients.map(ing => `
            <li>
              <span>${ing.name}${ing.grams ? ` &nbsp;${ing.grams}g` : ''}</span>
              ${ing.nutrition?.calories ? `<span class="ingredient-kcal-badge">${ing.nutrition.calories} kcal</span>` : ''}
            </li>`).join('')}
        </ul>` : ''}

      ${recipe.steps?.length ? `
        <div class="section-title" style="margin-top:16px">料理步驟</div>
        <ol class="steps-list">
          ${recipe.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>` : ''}

      ${recipe.notes ? `
        <div class="section-title" style="margin-top:16px">備註</div>
        <div class="notes-box">${recipe.notes}</div>` : ''}

      <div style="margin-top:20px;display:flex;gap:10px">
        <button class="btn-danger" style="flex:1" onclick="deleteRecipeConfirm('${recipe.id}')">刪除食譜</button>
      </div>
    </div>`;

  openModal('modal-recipe-detail');
}

function editCurrentRecipe() {
  closeModal('modal-recipe-detail');
  openEditRecipeForm(state.editingRecipeId);
}

function openNewRecipeForm() {
  state.editingRecipeId = null;
  document.getElementById('recipe-form-title').textContent = '新增食譜';
  document.getElementById('recipe-id').value = '';
  document.getElementById('recipe-name').value = '';
  document.getElementById('recipe-time').value = '';
  document.getElementById('recipe-notes').value = '';
  document.getElementById('recipe-image-data').value = '';
  document.getElementById('recipe-image-area').innerHTML = `
    <div class="upload-placeholder">
      <span class="upload-icon">🖼</span>
      <span>點擊上傳食譜圖片</span>
    </div>`;
  // Init ingredient rows (3 default)
  state.ingredientCount = 0;
  document.getElementById('ingredient-rows').innerHTML = '';
  addIngredientRow(); addIngredientRow(); addIngredientRow();
  // Init step rows (4 default)
  state.stepCount = 0;
  document.getElementById('step-rows').innerHTML = '';
  for (let i = 0; i < 4; i++) addStepRow();
  recalcRecipeTotals();
  openModal('modal-recipe');
}

function openEditRecipeForm(recipeId) {
  const recipe = getData('recipes', []).find(r => r.id === recipeId);
  if (!recipe) return;
  state.editingRecipeId = recipeId;

  document.getElementById('recipe-form-title').textContent = '編輯食譜';
  document.getElementById('recipe-id').value = recipe.id;
  document.getElementById('recipe-name').value = recipe.name || '';
  document.getElementById('recipe-time').value = recipe.time || '';
  document.getElementById('recipe-notes').value = recipe.notes || '';
  document.getElementById('recipe-image-data').value = recipe.image || '';

  const imgArea = document.getElementById('recipe-image-area');
  if (recipe.image) {
    imgArea.innerHTML = `<img src="${recipe.image}" style="width:100%;height:100%;object-fit:cover">`;
  } else {
    imgArea.innerHTML = `<div class="upload-placeholder"><span class="upload-icon">${icon('image', 28)}</span><span>點擊上傳食譜圖片</span></div>`;
  }

  // Ingredients
  state.ingredientCount = 0;
  document.getElementById('ingredient-rows').innerHTML = '';
  const ingredients = recipe.ingredients || [];
  if (!ingredients.length) { addIngredientRow(); addIngredientRow(); addIngredientRow(); }
  else {
    ingredients.forEach(ing => {
      addIngredientRow();
      const idx = state.ingredientCount - 1;
      const nameInput = document.querySelector(`#ing-row-${idx} .ing-name`);
      const gramsInput = document.querySelector(`#ing-row-${idx} .ing-grams`);
      if (nameInput) { nameInput.value = ing.name; nameInput.dataset.foodId = ing.foodId || ''; }
      if (gramsInput) gramsInput.value = ing.amount ?? ing.grams ?? '';
      const unitSel = document.querySelector(`#ing-row-${idx} .unit-select`);
      if (unitSel) {
        const targetUnit = ing.unit || 'g';
        // Inject serving option if needed before setting value
        if (targetUnit !== 'g' && targetUnit !== 'ml' && !['份','茶匙','大匙','個','片','條','顆'].includes(targetUnit)) {
          unitSel.querySelector('[data-serving]')?.remove();
          const opt = document.createElement('option');
          opt.value = targetUnit; opt.textContent = targetUnit; opt.dataset.serving = '1';
          unitSel.insertBefore(opt, unitSel.firstChild);
        }
        unitSel.value = targetUnit;
      }
      const kcalEl = document.getElementById(`ing-kcal-${idx}`);
      if (kcalEl && ing.nutrition?.calories) kcalEl.textContent = `${ing.nutrition.calories}kcal`;
    });
  }

  // Steps
  state.stepCount = 0;
  document.getElementById('step-rows').innerHTML = '';
  const steps = recipe.steps || ['', '', '', ''];
  steps.forEach((s, i) => {
    addStepRow();
    const ta = document.querySelectorAll('.step-textarea')[i];
    if (ta) ta.value = s;
  });

  recalcRecipeTotals();
  openModal('modal-recipe');
}

function handleRecipeImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  event.target.value = '';
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => _openRecipeCropModal(img);
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

// ===== RECIPE IMAGE CROP (4:3) =====
const RC_W = 300, RC_H = 225;
let _rcImg = null, _rcScale = 1, _rcOffX = 0, _rcOffY = 0;
let _rcDrag = false, _rcDragSX = 0, _rcDragSY = 0;
let _rcPinchDist0 = 0, _rcPinchScale0 = 1;
let _rcMouseMove = null, _rcMouseUp = null;

function _openRecipeCropModal(img) {
  _rcImg = img;
  const minS = Math.max(RC_W / img.width, RC_H / img.height);
  _rcScale = minS;
  _rcOffX = (RC_W - img.width * _rcScale) / 2;
  _rcOffY = (RC_H - img.height * _rcScale) / 2;
  document.getElementById('recipe-crop-modal').style.display = 'flex';
  _drawRecipeCrop();
  const stage = document.getElementById('recipe-crop-stage');
  if (stage && !stage._rcReady) {
    stage._rcReady = true;
    stage.addEventListener('touchstart', ev => {
      ev.preventDefault();
      if (ev.touches.length === 1) {
        _rcDrag = true; _rcDragSX = ev.touches[0].clientX - _rcOffX; _rcDragSY = ev.touches[0].clientY - _rcOffY;
      } else if (ev.touches.length === 2) {
        _rcDrag = false;
        _rcPinchDist0 = Math.hypot(ev.touches[0].clientX - ev.touches[1].clientX, ev.touches[0].clientY - ev.touches[1].clientY);
        _rcPinchScale0 = _rcScale;
      }
    }, { passive: false });
    stage.addEventListener('touchmove', ev => {
      ev.preventDefault();
      if (ev.touches.length === 1 && _rcDrag) {
        _rcOffX = ev.touches[0].clientX - _rcDragSX; _rcOffY = ev.touches[0].clientY - _rcDragSY; _drawRecipeCrop();
      } else if (ev.touches.length === 2) {
        const dist = Math.hypot(ev.touches[0].clientX - ev.touches[1].clientX, ev.touches[0].clientY - ev.touches[1].clientY);
        const minS = Math.max(RC_W / _rcImg.width, RC_H / _rcImg.height);
        _rcScale = Math.max(minS, Math.min(_rcPinchScale0 * (dist / _rcPinchDist0), minS * 6)); _drawRecipeCrop();
      }
    }, { passive: false });
    stage.addEventListener('touchend', () => { _rcDrag = false; });
    stage.addEventListener('mousedown', ev => { _rcDrag = true; _rcDragSX = ev.clientX - _rcOffX; _rcDragSY = ev.clientY - _rcOffY; ev.preventDefault(); });
    stage.addEventListener('wheel', ev => {
      ev.preventDefault();
      const factor = ev.deltaY < 0 ? 1.08 : 0.93;
      const rect = stage.getBoundingClientRect();
      const mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
      _rcOffX = mx - (mx - _rcOffX) * factor; _rcOffY = my - (my - _rcOffY) * factor;
      const minS = Math.max(RC_W / _rcImg.width, RC_H / _rcImg.height);
      _rcScale = Math.max(minS, Math.min(_rcScale * factor, minS * 6)); _drawRecipeCrop();
    }, { passive: false });
  }
  if (_rcMouseMove) document.removeEventListener('mousemove', _rcMouseMove);
  if (_rcMouseUp)   document.removeEventListener('mouseup',   _rcMouseUp);
  document.addEventListener('mousemove', _rcMouseMove = ev => { if (!_rcDrag) return; _rcOffX = ev.clientX - _rcDragSX; _rcOffY = ev.clientY - _rcDragSY; _drawRecipeCrop(); });
  document.addEventListener('mouseup',   _rcMouseUp   = () => { _rcDrag = false; });
}

function _drawRecipeCrop() {
  const canvas = document.getElementById('recipe-crop-canvas');
  if (!canvas || !_rcImg) return;
  const stage = document.getElementById('recipe-crop-stage');
  const sw = stage ? stage.offsetWidth : RC_W;
  const sh = sw * RC_H / RC_W;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = sw * dpr; canvas.height = sh * dpr;
  canvas.style.width = sw + 'px'; canvas.style.height = sh + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, sw, sh);
  const scaleAdj = sw / RC_W;
  ctx.drawImage(_rcImg, _rcOffX * scaleAdj, _rcOffY * scaleAdj, _rcImg.width * _rcScale * scaleAdj, _rcImg.height * _rcScale * scaleAdj);
}

function confirmRecipeCrop() {
  if (!_rcImg) return;
  const out = document.createElement('canvas');
  out.width = 640; out.height = 480;
  const ratio = 640 / RC_W;
  out.getContext('2d').drawImage(_rcImg, _rcOffX * ratio, _rcOffY * ratio, _rcImg.width * _rcScale * ratio, _rcImg.height * _rcScale * ratio);
  try {
    const data = out.toDataURL('image/jpeg', 0.85);
    document.getElementById('recipe-image-data').value = data;
    document.getElementById('recipe-image-area').innerHTML = `<img src="${data}" style="width:100%;height:100%;object-fit:cover">`;
    document.getElementById('recipe-crop-modal').style.display = 'none';
    _rcImg = null;
  } catch(err) { showToast('儲存失敗，請嘗試較小的圖片'); }
}

function cancelRecipeCrop() {
  document.getElementById('recipe-crop-modal').style.display = 'none';
  _rcImg = null;
}

// Ingredient rows
function addIngredientRow() {
  const idx = state.ingredientCount++;
  const row = document.createElement('div');
  row.className = 'ingredient-row';
  row.id = `ing-row-${idx}`;
  row.innerHTML = `
    <div class="ingredient-name-wrap">
      <input type="text" class="form-input ing-name" placeholder="食材名稱" autocomplete="off"
             data-food-id="" data-row="${idx}"
             oninput="searchIngredient(this)" onblur="hideIngredientSuggestions(${idx})">
      <div class="ingredient-suggestions" id="ing-sug-${idx}" style="display:none"></div>
    </div>
    <div class="ingredient-amount-wrap">
      <input type="number" class="form-input ing-grams" placeholder="份量" min="0"
             data-row="${idx}" oninput="updateIngredientNutrition(this)">
      <select class="unit-select" onchange="updateIngredientNutrition(document.querySelector('#ing-row-${idx} .ing-grams'))">
        <option value="g">g</option>
        <option value="ml">ml</option>
        <option value="份">份</option>
        <option value="茶匙">茶匙</option>
        <option value="大匙">大匙</option>
        <option value="個">個</option>
        <option value="片">片</option>
        <option value="條">條</option>
        <option value="顆">顆</option>
      </select>
    </div>
    <div class="ingredient-kcal" id="ing-kcal-${idx}">—</div>
    <button type="button" class="remove-row-btn" onclick="removeIngredientRow(this)">✕</button>`;
  document.getElementById('ingredient-rows').appendChild(row);
}

function removeIngredientRow(btn) {
  btn.closest('.ingredient-row').remove();
  recalcRecipeTotals();
}

function searchIngredient(input) {
  const q = input.value.trim().toLowerCase();
  const idx = input.dataset.row;
  const sugBox = document.getElementById(`ing-sug-${idx}`);
  if (!q) { sugBox.style.display = 'none'; return; }

  const foods = getData('foodDB', []);
  const matches = foods.filter(f => f.name.toLowerCase().includes(q)).slice(0, 7);

  const matchesHtml = matches.map(f => `
    <div class="suggestion-item"
         onmousedown="selectIngredient(${idx},'${f.id}','${f.name.replace(/'/g,"\\'")}',event)"
         ontouchstart="selectIngredient(${idx},'${f.id}','${f.name.replace(/'/g,"\\'")}',event)">
      <span class="sug-name">${f.name}</span>
      <span class="food-state-badge ${stateBadgeClass(f.state)} sug-state">${f.state}</span>
      <span class="sug-kcal">${f.per100g.calories}kcal</span>
    </div>`).join('');

  sugBox.innerHTML = matchesHtml || `<div class="sug-empty">無符合食材</div>`;
  sugBox.style.display = 'block';
}

function removeIngredientRowLast() {
  const rows = document.querySelectorAll('.ingredient-row');
  if (rows.length <= 1) { showToast('至少需要一個食材欄位'); return; }
  rows[rows.length - 1].remove();
  recalcRecipeTotals();
}

let _quickFoodTargetRow = null;

function openQuickCreateIngredientModal() {
  // Find the last empty ingredient row to apply to
  const rows = [...document.querySelectorAll('.ingredient-row')];
  const emptyRows = rows.filter(r => !r.querySelector('.ing-name')?.value?.trim());
  const emptyRow = emptyRows[emptyRows.length - 1] || null;
  _quickFoodTargetRow = emptyRow ? emptyRow.id?.replace('ing-row-', '') : null;
  if (!_quickFoodTargetRow) {
    // Add a new row and target it
    addIngredientRow();
    _quickFoodTargetRow = String(state.ingredientCount - 1);
  }

  document.getElementById('qcf-modal-name').value = '';
  document.getElementById('qcf-modal-amount').value = '';
  document.getElementById('qcf-modal-unit').value = 'g';
  document.getElementById('qcf-modal-cal').value = '';
  document.getElementById('qcf-modal-pro').value = '';
  document.getElementById('qcf-modal-fat').value = '';
  document.getElementById('qcf-modal-carb').value = '';
  document.getElementById('modal-quick-food').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('qcf-modal-name')?.focus(), 80);
}

function closeQuickCreateIngredientModal() {
  document.getElementById('modal-quick-food').style.display = 'none';
  document.body.style.overflow = '';
}

function saveQuickCreateIngredientModal() {
  const name = document.getElementById('qcf-modal-name').value.trim();
  if (!name) { showToast('請填寫食材名稱'); return; }
  const cal  = parseFloat(document.getElementById('qcf-modal-cal').value)  || 0;
  const pro  = parseFloat(document.getElementById('qcf-modal-pro').value)  || 0;
  const fat  = parseFloat(document.getElementById('qcf-modal-fat').value)  || 0;
  const carb = parseFloat(document.getElementById('qcf-modal-carb').value) || 0;
  const amount = parseFloat(document.getElementById('qcf-modal-amount').value) || 0;
  const unit = document.getElementById('qcf-modal-unit').value;

  const food = {
    id: generateId('f'), name, state: '一般',
    per100g: { calories: cal, protein: pro, fat, carbs: carb, fiber: 0 },
    createdAt: new Date().toISOString().slice(0, 10),
  };
  const foods = getData('foodDB', []);
  foods.push(food);
  setData('foodDB', foods);

  // Apply to target row
  const rowIdx = _quickFoodTargetRow;
  if (rowIdx !== null) {
    const nameInput = document.querySelector(`#ing-row-${rowIdx} .ing-name`);
    if (nameInput) {
      nameInput.value = name;
      nameInput.dataset.foodId = food.id;
    }
    const gramsInput = document.querySelector(`#ing-row-${rowIdx} .ing-grams`);
    if (gramsInput && amount) gramsInput.value = amount;
    const unitSel = document.querySelector(`#ing-row-${rowIdx} .unit-select`);
    if (unitSel) unitSel.value = unit;
    if (gramsInput) updateIngredientNutrition(gramsInput);
  }

  closeQuickCreateIngredientModal();
  showToast(`「${name}」已建立並套用`);
}

function selectIngredient(rowIdx, foodId, foodName, event) {
  if (event) event.preventDefault();
  const nameInput = document.querySelector(`#ing-row-${rowIdx} .ing-name`);
  const sugBox = document.getElementById(`ing-sug-${rowIdx}`);
  if (!nameInput) return;
  nameInput.value = foodName;
  nameInput.dataset.foodId = foodId;
  sugBox.style.display = 'none';
  // Inject serving unit option if this food has one
  const food = getData('foodDB', []).find(f => f.id === foodId);
  const unitSel = document.querySelector(`#ing-row-${rowIdx} .unit-select`);
  if (unitSel) {
    unitSel.querySelector('[data-serving]')?.remove();
    if (food?.serving?.unit) {
      const opt = document.createElement('option');
      opt.value = food.serving.unit;
      opt.textContent = food.serving.unit;
      opt.dataset.serving = '1';
      unitSel.insertBefore(opt, unitSel.firstChild);
      unitSel.value = food.serving.unit;
    }
  }
  const gramsInput = document.querySelector(`#ing-row-${rowIdx} .ing-grams`);
  if (gramsInput?.value) updateIngredientNutrition(gramsInput);
  recalcRecipeTotals();
}

function hideIngredientSuggestions(idx) {
  setTimeout(() => {
    const el = document.getElementById(`ing-sug-${idx}`);
    if (el) el.style.display = 'none';
  }, 180);
}

function updateIngredientNutrition(gramsInput) {
  if (!gramsInput) return;
  const idx = gramsInput.dataset.row;
  const nameInput = document.querySelector(`#ing-row-${idx} .ing-name`);
  const kcalEl = document.getElementById(`ing-kcal-${idx}`);
  const unitSel = document.querySelector(`#ing-row-${idx} .unit-select`);
  const unit = unitSel?.value || 'g';
  const foodId = nameInput?.dataset?.foodId;
  const amount = parseFloat(gramsInput.value);
  if (!foodId || !amount) { if (kcalEl) kcalEl.textContent = '—'; recalcRecipeTotals(); return; }
  const food = getData('foodDB', []).find(f => f.id === foodId);
  if (!food) { recalcRecipeTotals(); return; }
  let kcal;
  if (unit === 'g') {
    kcal = r(food.per100g.calories * amount / 100);
  } else if (food.serving && unit === food.serving.unit) {
    kcal = r(food.serving.calories * amount);
  } else {
    if (kcalEl) kcalEl.textContent = '—'; recalcRecipeTotals(); return;
  }
  if (kcalEl) kcalEl.textContent = `${kcal}kcal`;
  recalcRecipeTotals();
}

function recalcRecipeTotals() {
  const foods = getData('foodDB', []);
  let tot = { calories:0, protein:0, fat:0, carbs:0, fiber:0 };
  document.querySelectorAll('.ingredient-row').forEach(row => {
    const ni = row.querySelector('.ing-name');
    const gi = row.querySelector('.ing-grams');
    const us = row.querySelector('.unit-select');
    const foodId = ni?.dataset?.foodId;
    const grams = parseFloat(gi?.value) || 0;
    const unit = us?.value || 'g';
    const amount = parseFloat(gi?.value) || 0;
    if (!foodId || !amount) return;
    const food = foods.find(f => f.id === foodId);
    if (!food) return;
    if (unit === 'g') {
      const m = amount / 100;
      tot.calories += food.per100g.calories * m;
      tot.protein  += food.per100g.protein  * m;
      tot.fat      += food.per100g.fat      * m;
      tot.carbs    += food.per100g.carbs    * m;
      tot.fiber    += food.per100g.fiber    * m;
    } else if (food.serving && unit === food.serving.unit) {
      tot.calories += food.serving.calories * amount;
      tot.protein  += food.serving.protein  * amount;
      tot.fat      += food.serving.fat      * amount;
      tot.carbs    += food.serving.carbs    * amount;
      tot.fiber    += food.serving.fiber    * amount;
    }
  });
  const el = id => document.getElementById(id);
  if (el('tot-kcal'))    el('tot-kcal').textContent    = r(tot.calories);
  if (el('tot-protein')) el('tot-protein').textContent = r(tot.protein);
  if (el('tot-fat'))     el('tot-fat').textContent     = r(tot.fat);
  if (el('tot-carbs'))   el('tot-carbs').textContent   = r(tot.carbs);
  if (el('tot-fiber'))   el('tot-fiber').textContent   = r(tot.fiber);
  if (el('recipe-quick-kcal')) el('recipe-quick-kcal').textContent = tot.calories > 0 ? `合計 ${r(tot.calories)} kcal` : '';
}

// Step rows
function addStepRow() {
  const idx = state.stepCount++;
  const row = document.createElement('div');
  row.className = 'step-row';
  row.innerHTML = `
    <div class="step-num">${idx + 1}</div>
    <textarea class="form-textarea step-textarea" rows="2" placeholder="第 ${idx+1} 步驟…"></textarea>`;
  document.getElementById('step-rows').appendChild(row);
}

function removeStepRow() {
  const rows = document.querySelectorAll('.step-row');
  if (rows.length <= 1) { showToast('至少需要一個步驟'); return; }
  rows[rows.length - 1].remove();
  state.stepCount--;
}

function saveRecipeForm() {
  const name = document.getElementById('recipe-name').value.trim();
  if (!name) { showToast('請填寫食譜名稱'); return; }

  const id = document.getElementById('recipe-id').value || generateId('r');
  const time = parseInt(document.getElementById('recipe-time').value) || 0;
  const notes = document.getElementById('recipe-notes').value.trim();
  const imageData = document.getElementById('recipe-image-data').value;
  const foods = getData('foodDB', []);

  const ingredients = [];
  document.querySelectorAll('.ingredient-row').forEach(row => {
    const ni = row.querySelector('.ing-name');
    const gi = row.querySelector('.ing-grams');
    const ingName = ni?.value?.trim();
    if (!ingName) return;
    const foodId = ni.dataset.foodId || '';
    const amount = parseFloat(gi?.value) || 0;
    const unit = row.querySelector('.unit-select')?.value || 'g';
    const food = foods.find(f => f.id === foodId);
    const grams = unit === 'g' ? amount : 0;
    let nutrition;
    if (food && unit === 'g' && grams) {
      nutrition = calcNutrition(food, grams);
    } else if (food?.serving && unit === food.serving.unit && amount) {
      nutrition = {
        calories: r(food.serving.calories * amount),
        protein:  r(food.serving.protein  * amount),
        fat:      r(food.serving.fat      * amount),
        carbs:    r(food.serving.carbs    * amount),
        fiber:    r(food.serving.fiber    * amount),
      };
    } else {
      nutrition = { calories:0, protein:0, fat:0, carbs:0, fiber:0 };
    }
    ingredients.push({ foodId, name: ingName, amount, unit, grams, nutrition });
  });

  const steps = [];
  document.querySelectorAll('.step-textarea').forEach(ta => {
    const v = ta.value.trim();
    if (v) steps.push(v);
  });

  const nutrition = ingredients.reduce((acc, ing) => {
    Object.keys(acc).forEach(k => acc[k] += ing.nutrition[k] || 0);
    return acc;
  }, { calories:0, protein:0, fat:0, carbs:0, fiber:0 });
  Object.keys(nutrition).forEach(k => nutrition[k] = r(nutrition[k]));

  const recipe = { id, name, time, notes, image: imageData, ingredients, steps, nutrition };
  const recipes = getData('recipes', []);
  const idx = recipes.findIndex(r => r.id === id);
  if (idx >= 0) recipes[idx] = recipe; else recipes.push(recipe);
  setData('recipes', recipes);

  const gd = getGameData();
  const prevLevel = gd.level;
  const newAch = _runAchievementChecks(gd);
  setData('gamification', gd);
  _showRewards(prevLevel, gd.level, newAch);

  closeModal('modal-recipe');
  renderRecipeList();
  showToast(idx >= 0 ? '食譜已更新 ✦' : '食譜已新增！✦');
}

function deleteRecipeConfirm(id) {
  const recipe = getData('recipes', []).find(r => r.id === id);
  if (!recipe) return;
  showConfirm(`確定要刪除食譜<strong>「${recipe.name}」</strong>嗎？`, () => {
    const recipes = getData('recipes', []).filter(r => r.id !== id);
    setData('recipes', recipes);
    closeModal('modal-recipe-detail');
    renderRecipeList();
    showToast('食譜已刪除');
  });
}

// ===== FOOD DB =====
function renderFoodDB() {
  let foods = getData('foodDB', []);
  if (state.currentFoodCategory !== '全部')
    foods = foods.filter(f => f.category === state.currentFoodCategory);
  if (state.currentFoodSearch)
    foods = foods.filter(f => f.name.toLowerCase().includes(state.currentFoodSearch));

  const container = document.getElementById('food-list');
  if (!foods.length) {
    container.innerHTML = `<div style="text-align:center;padding:40px;color:var(--ink-light);opacity:0.6;font-style:italic">找不到符合條件的食材</div>`;
    return;
  }
  container.innerHTML = foods.map(f => `
    <div class="food-item">
      <span class="food-state-badge ${stateBadgeClass(f.state)}">${f.state}</span>
      <div class="food-item-main">
        <div class="food-item-name">${f.name}</div>
        <div class="food-item-cat">${f.category} · 每100g</div>
        <div class="food-item-macros">
          <span class="macro-chip kcal">${icon('flame', 12)} ${f.per100g.calories}kcal</span>
          <span class="macro-chip">蛋白 ${f.per100g.protein}g</span>
          <span class="macro-chip">脂 ${f.per100g.fat}g</span>
          <span class="macro-chip">碳 ${f.per100g.carbs}g</span>
        </div>
      </div>
      <div class="food-item-actions">
        <button class="icon-btn edit" onclick="openEditFoodForm('${f.id}')" title="編輯">${icon('pen-left', 15)}</button>
        <button class="icon-btn delete" onclick="deleteFoodConfirm('${f.id}')" title="刪除">${icon('trash-2', 15)}</button>
      </div>
    </div>`).join('');
}

function searchFoodDB(q) {
  state.currentFoodSearch = q.toLowerCase();
  renderFoodDB();
}

function filterFoodByCategory(cat, btn) {
  state.currentFoodCategory = cat;
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderFoodDB();
}

function openAddFoodForm() {
  document.getElementById('food-form-title').textContent = '新增食材';
  document.getElementById('food-id').value = '';
  document.getElementById('food-name').value = '';
  document.getElementById('food-state').value = '生食';
  document.getElementById('food-category').value = '蔬菜';
  ['food-calories','food-protein','food-fat','food-carbs','food-fiber'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('food-serving-unit').value = '';
  ['food-sv-calories','food-sv-protein','food-sv-fat','food-sv-carbs','food-sv-fiber'].forEach(id => document.getElementById(id).value = '');
  openBottomSheet('sheet-food');
}

function openEditFoodForm(foodId) {
  const food = getData('foodDB', []).find(f => f.id === foodId);
  if (!food) return;
  document.getElementById('food-form-title').textContent = '編輯食材';
  document.getElementById('food-id').value = food.id;
  document.getElementById('food-name').value = food.name;
  document.getElementById('food-state').value = food.state;
  document.getElementById('food-category').value = food.category;
  document.getElementById('food-calories').value = food.per100g.calories;
  document.getElementById('food-protein').value  = food.per100g.protein;
  document.getElementById('food-fat').value      = food.per100g.fat;
  document.getElementById('food-carbs').value    = food.per100g.carbs;
  document.getElementById('food-fiber').value    = food.per100g.fiber;
  const sv = food.serving || {};
  document.getElementById('food-serving-unit').value  = sv.unit     || '';
  document.getElementById('food-sv-calories').value   = sv.calories ?? '';
  document.getElementById('food-sv-protein').value    = sv.protein  ?? '';
  document.getElementById('food-sv-fat').value        = sv.fat      ?? '';
  document.getElementById('food-sv-carbs').value      = sv.carbs    ?? '';
  document.getElementById('food-sv-fiber').value      = sv.fiber    ?? '';
  openBottomSheet('sheet-food');
}

function saveFoodForm() {
  const name = document.getElementById('food-name').value.trim();
  if (!name) { showToast('請填寫食材名稱'); return; }
  const id = document.getElementById('food-id').value || generateId('f');
  const svUnit = document.getElementById('food-serving-unit').value.trim();
  const serving = svUnit ? {
    unit:     svUnit,
    calories: parseFloat(document.getElementById('food-sv-calories').value) || 0,
    protein:  parseFloat(document.getElementById('food-sv-protein').value)  || 0,
    fat:      parseFloat(document.getElementById('food-sv-fat').value)      || 0,
    carbs:    parseFloat(document.getElementById('food-sv-carbs').value)    || 0,
    fiber:    parseFloat(document.getElementById('food-sv-fiber').value)    || 0,
  } : null;
  const food = {
    id, name,
    state:    document.getElementById('food-state').value,
    category: document.getElementById('food-category').value,
    per100g: {
      calories: parseFloat(document.getElementById('food-calories').value) || 0,
      protein:  parseFloat(document.getElementById('food-protein').value)  || 0,
      fat:      parseFloat(document.getElementById('food-fat').value)      || 0,
      carbs:    parseFloat(document.getElementById('food-carbs').value)    || 0,
      fiber:    parseFloat(document.getElementById('food-fiber').value)    || 0,
    },
    ...(serving && { serving })
  };
  const db = getData('foodDB', []);
  const idx = db.findIndex(f => f.id === id);
  if (idx >= 0) db[idx] = food; else db.push(food);
  setData('foodDB', db);
  closeBottomSheet('sheet-food');
  renderFoodDB();
  showToast(idx >= 0 ? '食材已更新 ✦' : '食材已新增！✦');
}

function deleteFoodConfirm(id) {
  const food = getData('foodDB', []).find(f => f.id === id);
  if (!food) return;
  showConfirm(`確定要刪除食材<strong>「${food.name}」</strong>嗎？`, () => {
    const db = getData('foodDB', []).filter(f => f.id !== id);
    setData('foodDB', db);
    renderFoodDB();
    showToast('食材已刪除');
  });
}

// ===== DIARY =====
let _diarySX = 0, _diarySY = 0;

function renderDiary() {
  const ds = state.currentDate;
  document.getElementById('diary-date-display').textContent = formatDisplayDate(ds);
  const nextBtn = document.querySelector('#page-diary .date-nav .date-nav-btn:last-child');
  if (nextBtn) { const atToday = ds >= todayStr(); nextBtn.style.opacity = atToday ? '0.25' : ''; nextBtn.style.pointerEvents = atToday ? 'none' : ''; }

  const diary = getData('diary', {});
  const entries = diary[ds] || [];
  const profile = getData('profile', { goals: defaultGoals() });
  const goals = profile.goals || defaultGoals();
  const tot = getDailyTotals(ds);
  const kcalPct = goals.calories ? Math.min((tot.calories / goals.calories) * 100, 150) : 0;
  const displayPct = Math.min(kcalPct, 100);

  const isOver = goals.calories && tot.calories > goals.calories;
  document.getElementById('daily-summary').innerHTML = `
    <div class="kcal-slash-row">
      <span class="kcal-current">${r(tot.calories)}</span>
      <span class="kcal-divider"> / </span>
      <span class="kcal-target">${goals.calories || 0}</span>
      <span class="kcal-unit">kcal</span>
    </div>
    <div class="kcal-bar-track">
      <div class="kcal-bar-fill${isOver ? ' over' : ''}" style="width:${displayPct}%"></div>
    </div>
    <div class="macro-pills-row">
      <div class="macro-pill"><span class="mp-val">${r(tot.protein)}g</span><span class="mp-lbl">蛋白質</span></div>
      <div class="macro-pill"><span class="mp-val">${r(tot.fat)}g</span><span class="mp-lbl">脂肪</span></div>
      <div class="macro-pill"><span class="mp-val">${r(tot.carbs)}g</span><span class="mp-lbl">碳水</span></div>
      <div class="macro-pill"><span class="mp-val">${r(tot.fiber)}g</span><span class="mp-lbl">纖維</span></div>
    </div>`;

  const grouped = {};
  MEALS.forEach(m => grouped[m] = []);
  entries.forEach(e => { (grouped[e.meal] || grouped['點心']).push(e); });

  let html = '';
  MEALS.forEach(meal => {
    const items = grouped[meal];
    if (!items.length) return;
    const mealTot = r(items.reduce((s, e) => s + (e.nutrition?.calories || 0), 0));
    html += `<div class="meal-group">
      <div class="meal-group-title">
        ${icon(MEAL_ICONS[meal], 14)} ${meal}
        <span style="margin-left:auto;font-size:0.68rem;font-weight:400;opacity:0.8">${mealTot} kcal</span>
      </div>
      ${items.map(entry => `
        <div class="diary-entry">
          <div style="flex:1;min-width:0">
            <div class="diary-entry-name">${entry.name}</div>
            ${entry.amount ? `<div class="diary-entry-amount">${entry.amount}</div>` : ''}
          </div>
          <div class="diary-entry-kcal">${r(entry.nutrition?.calories || 0)} kcal</div>
          <button class="diary-entry-delete" onclick="deleteDiaryEntry('${ds}','${entry.id}')">✕</button>
        </div>`).join('')}
    </div>`;
  });

  if (!entries.length) {
    html = `<div style="text-align:center;padding:40px;color:var(--ink-light);opacity:0.6;font-style:italic">今日尚無飲食記錄<br>點擊右下角「＋」開始記錄</div>`;
  }
  document.getElementById('diary-entries').innerHTML = html;
}

function changeDiaryDate(delta) {
  const [y, m, d] = state.currentDate.split('-').map(Number);
  const nd = new Date(y, m - 1, d + delta);
  const newDate = `${nd.getFullYear()}-${String(nd.getMonth()+1).padStart(2,'0')}-${String(nd.getDate()).padStart(2,'0')}`;
  if (newDate > todayStr()) return;
  state.currentDate = newDate;
  renderDiary();
}

function setDiaryDate(ds) {
  if (ds) { state.currentDate = ds; renderDiary(); }
}

function openDatePicker() {
  const input = document.getElementById('diary-date-input');
  input.value = state.currentDate;
  input.showPicker ? input.showPicker() : input.click();
}

function getFrequentFoods() {
  const diary = getData('diary', {});
  const counts = {};
  const latest = {};
  Object.values(diary).forEach(dayEntries => {
    (dayEntries || []).forEach(e => {
      const name = (e.name || '').trim();
      if (!name) return;
      counts[name] = (counts[name] || 0) + 1;
      if (!latest[name] || e.loggedAt > latest[name].loggedAt) latest[name] = e;
    });
  });
  return Object.keys(counts)
    .sort((a, b) => counts[b] - counts[a])
    .slice(0, 10)
    .map(name => ({ name, count: counts[name], entry: latest[name] }));
}

function renderFrequentFoods() {
  const row = document.getElementById('frequent-foods-row');
  if (!row) return;
  const foods = getFrequentFoods();
  if (!foods.length) { row.innerHTML = ''; return; }
  const chips = foods.map(f => {
    const btn = document.createElement('button');
    btn.className = 'freq-chip';
    btn.textContent = f.name;
    btn.addEventListener('click', () => quickAddFood(f.name));
    return btn;
  });
  row.innerHTML = '<div class="freq-label">常用食物</div>';
  const wrap = document.createElement('div');
  wrap.className = 'freq-chips';
  chips.forEach(b => wrap.appendChild(b));
  row.appendChild(wrap);
}

function quickAddFood(name) {
  const diaryObj = getData('diary', {});
  const entries = Object.values(diaryObj).flat().filter(e => (e.name || '').trim() === name);
  if (!entries.length) return;
  const src = entries.sort((a, b) => (b.loggedAt || '') > (a.loggedAt || '') ? 1 : -1)[0];
  const entry = {
    id: Date.now().toString(),
    meal: getAddMeal(),
    name: src.name,
    amount: src.amount || '',
    source: 'frequent',
    nutrition: { ...src.nutrition },
    loggedAt: new Date().toISOString()
  };
  const d = getData('diary', {});
  const ds = todayStr();
  if (!d[ds]) d[ds] = [];
  d[ds].push(entry);
  setData('diary', d);
  showToast(`已加入：${name}`);
  closeBottomSheet('sheet-diary-add');
  renderDiary();
  onDiaryAdded();
}

function openAddDiaryEntrySheet() {
  // Auto-detect meal from current time
  const h = new Date().getHours();
  const meal = h < 10 ? '早餐' : h < 14 ? '午餐' : h < 19 ? '晚餐' : '點心';
  setAddMeal(meal);
  switchDiaryTab('manual');
  ['dm-name','dm-amount','dm-calories','dm-protein','dm-fat','dm-carbs','dm-fiber']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  renderFrequentFoods();
  openBottomSheet('sheet-diary-add');
}

function setAddMeal(meal) {
  const v = document.getElementById('add-meal-value');
  if (v) v.value = meal;
  document.querySelectorAll('.meal-pill').forEach(b =>
    b.classList.toggle('active', b.dataset.meal === meal));
}

function getAddMeal() {
  return (document.getElementById('add-meal-value') || {}).value || '午餐';
}

function switchDiaryTab(tabName) {
  document.querySelectorAll('.add-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tabName));
  document.querySelectorAll('.add-panel').forEach(p =>
    p.classList.toggle('active', p.id === `add-panel-${tabName}`));
  if (tabName === 'fooddb') {
    state.selectedFoodForDiary = null;
    const s = document.getElementById('dfdb-search');
    if (s) s.value = '';
    const a = document.getElementById('dfdb-amount-section');
    if (a) a.style.display = 'none';
    filterDiaryFoodDB('');
  }
  if (tabName === 'recipe') {
    state.selectedRecipeForDiary = null;
    const sec = document.getElementById('dr-serving-section');
    if (sec) sec.style.display = 'none';
    const recipes = getData('recipes', []);
    const list = document.getElementById('dr-list');
    if (list) {
      list.innerHTML = recipes.length
        ? recipes.map(rc => `
            <div class="select-item" onclick="selectRecipeForDiary('${rc.id}')">
              <div style="flex:1">
                <div class="select-item-name">${rc.name}</div>
                <div class="select-item-sub">${icon('timer', 12)} ${rc.time||'?'}分 · ${rc.ingredients?.length||0}樣食材</div>
              </div>
              <div class="select-item-kcal">${rc.nutrition?.calories||0}kcal</div>
            </div>`).join('')
        : `<div style="padding:24px;text-align:center;color:var(--text-3);font-size:.88rem">尚無食譜，請先在書卷食譜頁建立</div>`;
    }
  }
}

function openManualDiaryEntry() {
  switchDiaryTab('manual');
  openBottomSheet('sheet-diary-add');
}

function saveManualDiaryEntry() {
  const name = document.getElementById('dm-name').value.trim();
  if (!name) { showToast('請填寫食物名稱'); return; }
  const entry = {
    id: generateId('d'),
    meal: getAddMeal(),
    name,
    amount: document.getElementById('dm-amount').value.trim(),
    source: 'manual',
    nutrition: {
      calories: parseFloat(document.getElementById('dm-calories').value) || 0,
      protein:  parseFloat(document.getElementById('dm-protein').value)  || 0,
      fat:      parseFloat(document.getElementById('dm-fat').value)      || 0,
      carbs:    parseFloat(document.getElementById('dm-carbs').value)    || 0,
      fiber:    parseFloat(document.getElementById('dm-fiber').value)    || 0,
    }
  };
  addDiaryEntry(entry);
  closeBottomSheet('sheet-diary-add');
  renderDiary();
  showToast('已新增飲食記錄');
  onDiaryAdded();
}

function openFromFoodDB() {
  switchDiaryTab('fooddb');
  openBottomSheet('sheet-diary-add');
}

function filterDiaryFoodDB(q) {
  const lq = q.toLowerCase();
  const foods = getData('foodDB', []).filter(f => !lq || f.name.toLowerCase().includes(lq));
  document.getElementById('dfdb-list').innerHTML = foods.slice(0, 30).map(f => `
    <div class="select-item" onclick="selectFoodForDiary('${f.id}')">
      <div style="flex:1">
        <div class="select-item-name">${f.name}</div>
        <div class="select-item-sub">${f.category} · ${f.state}</div>
      </div>
      <span class="food-state-badge ${stateBadgeClass(f.state)}" style="margin-right:6px">${f.state}</span>
      <div class="select-item-kcal">${f.per100g.calories}kcal/100g</div>
    </div>`).join('');
}

function selectFoodForDiary(foodId) {
  state.selectedFoodForDiary = getData('foodDB', []).find(f => f.id === foodId);
  if (!state.selectedFoodForDiary) return;
  const f = state.selectedFoodForDiary;
  document.getElementById('dfdb-selected-info').textContent = `${f.name}（${f.state}）— 每100g ${f.per100g.calories}kcal`;
  document.getElementById('dfdb-amount').value = '100';
  document.getElementById('dfdb-amount-section').style.display = 'block';
  updateFoodDBPreview();
}

function updateFoodDBPreview() {
  const f = state.selectedFoodForDiary;
  if (!f) return;
  const g = parseFloat(document.getElementById('dfdb-amount').value) || 0;
  const n = calcNutrition(f, g);
  document.getElementById('prev-kcal').textContent    = n.calories;
  document.getElementById('prev-protein').textContent = n.protein;
  document.getElementById('prev-fat').textContent     = n.fat;
  document.getElementById('prev-carbs').textContent   = n.carbs;
}

function saveFoodDBDiaryEntry() {
  const f = state.selectedFoodForDiary;
  if (!f) { showToast('請先選擇食材'); return; }
  const g = parseFloat(document.getElementById('dfdb-amount').value);
  if (!g || g <= 0) { showToast('請輸入有效的份量'); return; }
  const entry = {
    id: generateId('d'),
    meal: getAddMeal(),
    name: f.name,
    amount: `${g}g`,
    source: 'fooddb',
    nutrition: calcNutrition(f, g)
  };
  addDiaryEntry(entry);
  closeBottomSheet('sheet-diary-add');
  renderDiary();
  showToast('已新增飲食記錄');
  onDiaryAdded();
}

function openFromRecipes() {
  switchDiaryTab('recipe');
  openBottomSheet('sheet-diary-add');
}

function selectRecipeForDiary(recipeId) {
  state.selectedRecipeForDiary = getData('recipes', []).find(r => r.id === recipeId);
  if (!state.selectedRecipeForDiary) return;
  const rc = state.selectedRecipeForDiary;
  document.getElementById('dr-selected-info').textContent = `${rc.name} — ${rc.nutrition?.calories||0}kcal／份`;
  document.getElementById('dr-serving').value = '1';
  document.getElementById('dr-serving-section').style.display = 'block';
  updateRecipeServingPreview();
}

function updateRecipeServingPreview() {
  const rc = state.selectedRecipeForDiary;
  if (!rc) return;
  const srv = parseFloat(document.getElementById('dr-serving').value) || 1;
  const n = rc.nutrition || {};
  document.getElementById('rp-kcal').textContent    = r((n.calories||0)*srv);
  document.getElementById('rp-protein').textContent = r((n.protein||0)*srv);
  document.getElementById('rp-fat').textContent     = r((n.fat||0)*srv);
  document.getElementById('rp-carbs').textContent   = r((n.carbs||0)*srv);
}

function saveRecipeDiaryEntry() {
  const rc = state.selectedRecipeForDiary;
  if (!rc) { showToast('請先選擇食譜'); return; }
  const srv = parseFloat(document.getElementById('dr-serving').value) || 1;
  const n = rc.nutrition || {};
  const entry = {
    id: generateId('d'),
    meal: getAddMeal(),
    name: rc.name,
    amount: srv === 1 ? '1份' : `${srv}份`,
    source: 'recipe',
    nutrition: {
      calories: r((n.calories||0)*srv),
      protein:  r((n.protein||0)*srv),
      fat:      r((n.fat||0)*srv),
      carbs:    r((n.carbs||0)*srv),
      fiber:    r((n.fiber||0)*srv),
    }
  };
  addDiaryEntry(entry);
  closeBottomSheet('sheet-diary-add');
  renderDiary();
  showToast('已新增飲食記錄');
  onDiaryAdded();
}

function addDiaryEntry(entry) {
  const diary = getData('diary', {});
  if (!diary[state.currentDate]) diary[state.currentDate] = [];
  entry.loggedAt = new Date().toISOString();
  diary[state.currentDate].push(entry);
  setData('diary', diary);
}

function deleteDiaryEntry(ds, entryId) {
  const diary = getData('diary', {});
  if (diary[ds]) diary[ds] = diary[ds].filter(e => e.id !== entryId);
  setData('diary', diary);
  renderDiary();
}

// ===== PROFILE =====
function renderProfile() {
  const profile = getData('profile', {});
  const goals   = profile.goals || defaultGoals();
  const body    = profile.body  || {};
  const tot     = getDailyTotals(state.currentDate);

  const inbodyRecords = getData('inbody', []);
  const lastInbody = inbodyRecords.length ? inbodyRecords[inbodyRecords.length - 1] : null;

  // 7-day average weight (weightLog first, then any InBody record for that date)
  const wLog = getData('weightLog', {});
  const inbodyByDate = {};
  inbodyRecords.forEach(rec => { inbodyByDate[rec.date] = rec.weight; });
  const w7 = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    if (wLog[ds] != null) w7.push(wLog[ds]);
    else if (inbodyByDate[ds] != null) w7.push(inbodyByDate[ds]);
  }
  const avg7 = w7.length ? r(w7.reduce((s, v) => s + v, 0) / w7.length, 1) : null;
  const tdee = calcTDEE(body, lastInbody);

  // --- Avatar ---
  const avatarData  = getData('avatarData', null);
  const avatarInner = avatarData ? `<img src="${avatarData}" alt="頭貼">` : icon('user', 36);

  // --- Gamification ---
  const gd = getGameData();
  const curLvEntry  = LEVEL_TABLE.find(e => e.level === gd.level) || LEVEL_TABLE[0];
  const nextLvEntry = LEVEL_TABLE.find(e => e.level === gd.level + 1);
  const xpInLevel   = gd.xp - curLvEntry.xp;
  const xpNeeded    = nextLvEntry ? nextLvEntry.xp - curLvEntry.xp : 1;
  const xpPct       = nextLvEntry ? Math.min(100, Math.round(xpInLevel / xpNeeded * 100)) : 100;
  const achTotal    = Object.keys(ACHIEVEMENTS_DEF).length;
  const achDone     = (gd.achievements || []).length;

  // --- Body stats strip ---
  const infoItems = [
    body.age    ? `${body.age} 歲`    : null,
    body.height ? `${body.height} cm` : null,
    body.weight ? `${body.weight} kg` : null,
  ].filter(Boolean);

  // --- Notifications badge ---
  const notifs = computeNotifications();
  const hasBadge = notifs.some(n => n.type !== 'ok');
  const notifDot = document.getElementById('profile-notif-dot');
  if (notifDot) notifDot.style.display = hasBadge ? '' : 'none';

  // --- Profile header card (view vs edit mode) ---
  const headerCard = _profileEditMode ? `
    <div class="profile-header-card">
      <label for="avatar-file-input" style="cursor:pointer;display:block;text-align:center;margin-bottom:14px">
        <div class="avatar-circle">${avatarInner}</div>
      </label>
      <div class="profile-setup-grid">
        <div class="profile-setup-item" style="grid-column:1/-1">
          <label>暱稱</label>
          <input type="text" id="body-name" value="${profile.name||''}" placeholder="使用者">
        </div>
        <div class="profile-setup-item" style="grid-column:1/-1">
          <label>個人簡介</label>
          <input type="text" id="body-bio" value="${profile.bio||''}" placeholder="減脂計畫第 1 個月…">
        </div>
        <div class="profile-setup-item">
          <label>年齡</label>
          <input type="number" id="body-age" value="${body.age||''}" placeholder="25" min="10" max="99">
        </div>
        <div class="profile-setup-item">
          <label>身高 (cm)</label>
          <input type="number" id="body-height" value="${body.height||''}" placeholder="170">
        </div>
        <div class="profile-setup-item">
          <label>體重 (kg)</label>
          <input type="number" id="body-weight" value="${body.weight||lastInbody?.weight||''}" placeholder="65" step="0.1">
        </div>
        <div class="profile-setup-item">
          <label>性別</label>
          <select id="body-gender">
            <option value="male"   ${body.gender==='male'  ?'selected':''}>男</option>
            <option value="female" ${body.gender==='female'?'selected':''}>女</option>
          </select>
        </div>
        <div class="profile-setup-item" style="grid-column:1/-1">
          <label>活動量</label>
          <select id="body-activity">
            <option value="1.2"   ${body.activity==='1.2'   ?'selected':''}>久坐（幾乎不運動）</option>
            <option value="1.375" ${body.activity==='1.375' ?'selected':''}>輕度（週1-3天）</option>
            <option value="1.55"  ${body.activity==='1.55'  ?'selected':''}>中度（週3-5天）</option>
            <option value="1.725" ${body.activity==='1.725' ?'selected':''}>高度（週6-7天）</option>
            <option value="1.9"   ${body.activity==='1.9'  ?'selected':''}>極高（每天高強度）</option>
          </select>
        </div>
      </div>
      <div style="display:flex;gap:10px;margin-top:14px">
        <button class="btn-ghost" style="flex:1" onclick="cancelProfileEdit()">取消</button>
        <button class="btn-primary" style="flex:2" onclick="saveProfileSetup()">儲存</button>
      </div>
    </div>` : `
    <div class="profile-header-card">
      <button class="phc-edit-btn" onclick="editProfileInfo()" title="編輯基本資料">${icon('pen-left', 16)}</button>
      <label for="avatar-file-input" style="cursor:pointer;display:block;text-align:center">
        <div class="avatar-with-badge">
          <div class="avatar-circle">${avatarInner}</div>
          <div class="avatar-level-badge">Lv.${gd.level}</div>
        </div>
      </label>
      <div class="profile-name" style="margin-top:10px">${profile.name || '使用者'}</div>
      ${gd.activeTitle ? `<div class="profile-active-title">${gd.activeTitle}</div>` : ''}
      ${profile.bio
        ? `<div class="profile-bio">${profile.bio}</div>`
        : `<div class="profile-bio-placeholder">輕點右上角 ✎ 新增個人簡介</div>`}
      ${infoItems.length
        ? `<div class="profile-header-stats">${infoItems.join(' · ')}</div>`
        : ''}
      <div class="xp-block">
        <div class="xp-bar"><div class="xp-bar-fill" style="width:${xpPct}%"></div></div>
        <div class="profile-gold-chip">${icon('coins', 13)} ${gd.gold || 0} 金幣</div>
        <div class="xp-bar-labels">
          <span>${curLvEntry.name}</span>
          <span>${nextLvEntry ? `${gd.xp} / ${nextLvEntry.xp} XP` : 'MAX'}</span>
        </div>
      </div>
    </div>`;

  // --- 4-section stats card ---
  const statsCard = `
    <div class="profile-stats-card">
      <div class="psc-item">
        <span class="psc-val">${avg7 ?? '—'}</span>
        <span class="psc-unit">kg</span>
        <span class="psc-lbl">7日均重</span>
      </div>
      <div class="psc-sep"></div>
      <div class="psc-item">
        <span class="psc-val">${lastInbody?.fatPct ?? '—'}</span>
        <span class="psc-unit">%</span>
        <span class="psc-lbl">體脂</span>
      </div>
      <div class="psc-sep"></div>
      <div class="psc-item">
        <span class="psc-val">${tdee?.bmr ?? '—'}</span>
        <span class="psc-unit">kcal</span>
        <span class="psc-lbl">基礎代謝</span>
      </div>
      <div class="psc-sep"></div>
      <div class="psc-item">
        <span class="psc-val">${tdee?.tdee ?? '—'}</span>
        <span class="psc-unit">kcal</span>
        <span class="psc-lbl">每日消耗</span>
      </div>
    </div>`;

  // --- Goals section ---
  const hasGoals = goals.calories > 0;
  const goalsSection = `
    <div class="goals-section">
      <div class="section-heading-row">
        <div class="section-heading">每日飲食目標</div>
        <button class="edit-link-btn" onclick="openGoalsWizard()">${icon('calculator', 13)} 計算</button>
      </div>
      ${hasGoals ? `
      <div class="goals-inline-display">
        <div class="goals-inline-row">
          <span class="gc-label">熱量</span><span class="gc-val">${goals.calories} kcal</span>
          <span class="gc-label" style="margin-left:12px">蛋白質</span><span class="gc-val">${goals.protein} g</span>
        </div>
        <div style="font-size:.75rem;color:var(--text-3);margin-top:6px">
          脂肪 ${goals.fat}g · 碳水 ${goals.carbs}g · 纖維 ${goals.fiber}g
        </div>
      </div>` : `
      <div style="text-align:center;padding:12px 0">
        <div style="color:var(--text-3);font-size:.85rem;margin-bottom:12px">尚未設定飲食目標</div>
        <button class="btn-primary" onclick="openGoalsWizard()">${icon('calculator', 14)} 自動計算目標</button>
      </div>`}
    </div>`;

  // --- Trend section ---
  const allInbody = getData('inbody', []);
  const hasTrend = allInbody.length >= 2;
  const trendSection = hasTrend ? `
    <div class="trend-mini-section">
      <div class="section-heading-row">
        <div class="section-heading">體組成趨勢</div>
        <button class="edit-link-btn" onclick="navigateTo('inbody')">詳情 ›</button>
      </div>
      <div class="trend-mini-sublabel">體重 (kg)</div>
      <canvas id="pm-weight" class="trend-canvas" height="65"></canvas>
      <div class="trend-mini-sublabel">體脂率 (%)</div>
      <canvas id="pm-fat" class="trend-canvas" height="65"></canvas>
      <div class="trend-mini-sublabel">肌肉量 (kg)</div>
      <canvas id="pm-muscle" class="trend-canvas" height="65"></canvas>
    </div>` : '';

  // --- Build page ---
  document.getElementById('profile-content').innerHTML = `
    ${headerCard}
    ${statsCard}
    ${goalsSection}
    <div class="progress-section">
      <div class="section-heading">今日達標進度</div>
      ${renderProgressBar('熱量', tot.calories, goals.calories, 'kcal')}
      ${renderProgressBar('蛋白質', tot.protein, goals.protein, 'g')}
    </div>
    <div class="ach-link-card" onclick="navigateTo('achievements')">
      ${icon('trophy', 14)} 成就館
      <span class="alc-count">${achDone} / ${achTotal}</span>
    </div>
    <div class="ach-link-card" onclick="navigateTo('inbody')">
      ${icon('activity', 14)} 體組成記錄
      <span class="alc-count">${allInbody.length} 筆</span>
    </div>
    ${trendSection}
    <button class="knowledge-entry-btn" onclick="openQASheet()">${icon('book-open', 14)} 科學飲食知識庫</button>
  `;

  if (hasTrend) {
    drawSingleTrendChart('pm-weight', allInbody, 'weight', 'kg', '#4D6A55', true);
    drawSingleTrendChart('pm-fat',    allInbody, 'fatPct', '%',  '#D98866', false);
    drawSingleTrendChart('pm-muscle', allInbody, 'muscle', 'kg', '#4A7FA5', false);
  }
}

function editProfileInfo() {
  _profileEditMode = true;
  renderProfile();
  setTimeout(() => {
    const page = document.getElementById('page-profile');
    if (page) page.scrollTo({ top: 0, behavior: 'smooth' });
  }, 50);
}

function cancelProfileEdit() {
  _profileEditMode = false;
  renderProfile();
}

function openAvatarUpload() {
  document.getElementById('avatar-file-input')?.click();
}

// ===== AVATAR CROP =====
const CROP_SIZE = 240;
let _cropImg = null, _cropScale = 1, _cropOffsetX = 0, _cropOffsetY = 0;
let _cropDragActive = false, _cropDragSX = 0, _cropDragSY = 0;
let _cropPinchDist0 = 0, _cropPinchScale0 = 1;
let _cropMouseMoveHandler = null, _cropMouseUpHandler = null;

function handleAvatarUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;
  e.target.value = '';
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => _openAvatarCropModal(img);
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function _openAvatarCropModal(img) {
  _cropImg = img;
  // Cover the crop circle initially
  const minS = Math.max(CROP_SIZE / img.width, CROP_SIZE / img.height);
  _cropScale = minS;
  _cropOffsetX = (CROP_SIZE - img.width  * _cropScale) / 2;
  _cropOffsetY = (CROP_SIZE - img.height * _cropScale) / 2;

  document.getElementById('avatar-crop-modal').style.display = 'flex';
  _drawCropPreview();

  const stage = document.getElementById('crop-stage');
  if (stage && !stage._cropReady) {
    stage._cropReady = true;

    // Touch: drag (1 finger) + pinch-zoom (2 fingers)
    stage.addEventListener('touchstart', ev => {
      ev.preventDefault();
      if (ev.touches.length === 1) {
        _cropDragActive = true;
        _cropDragSX = ev.touches[0].clientX - _cropOffsetX;
        _cropDragSY = ev.touches[0].clientY - _cropOffsetY;
      } else if (ev.touches.length === 2) {
        _cropDragActive = false;
        _cropPinchDist0  = Math.hypot(
          ev.touches[0].clientX - ev.touches[1].clientX,
          ev.touches[0].clientY - ev.touches[1].clientY);
        _cropPinchScale0 = _cropScale;
      }
    }, { passive: false });

    stage.addEventListener('touchmove', ev => {
      ev.preventDefault();
      if (ev.touches.length === 1 && _cropDragActive) {
        _cropOffsetX = ev.touches[0].clientX - _cropDragSX;
        _cropOffsetY = ev.touches[0].clientY - _cropDragSY;
        _drawCropPreview();
      } else if (ev.touches.length === 2) {
        const dist = Math.hypot(
          ev.touches[0].clientX - ev.touches[1].clientX,
          ev.touches[0].clientY - ev.touches[1].clientY);
        const minS = Math.max(CROP_SIZE / _cropImg.width, CROP_SIZE / _cropImg.height);
        _cropScale = Math.max(minS, Math.min(_cropPinchScale0 * (dist / _cropPinchDist0), minS * 6));
        _drawCropPreview();
      }
    }, { passive: false });

    stage.addEventListener('touchend', () => { _cropDragActive = false; });

    // Mouse: drag
    stage.addEventListener('mousedown', ev => {
      _cropDragActive = true;
      _cropDragSX = ev.clientX - _cropOffsetX;
      _cropDragSY = ev.clientY - _cropOffsetY;
      ev.preventDefault();
    });

    // Wheel: zoom around cursor
    stage.addEventListener('wheel', ev => {
      ev.preventDefault();
      const factor = ev.deltaY < 0 ? 1.08 : 0.93;
      const rect = stage.getBoundingClientRect();
      const mx = ev.clientX - rect.left, my = ev.clientY - rect.top;
      _cropOffsetX = mx - (mx - _cropOffsetX) * factor;
      _cropOffsetY = my - (my - _cropOffsetY) * factor;
      const minS = Math.max(CROP_SIZE / _cropImg.width, CROP_SIZE / _cropImg.height);
      _cropScale = Math.max(minS, Math.min(_cropScale * factor, minS * 6));
      _drawCropPreview();
    }, { passive: false });
  }

  // Re-attach doc-level mouse listeners (clean up old ones first)
  if (_cropMouseMoveHandler) document.removeEventListener('mousemove', _cropMouseMoveHandler);
  if (_cropMouseUpHandler)   document.removeEventListener('mouseup',   _cropMouseUpHandler);
  document.addEventListener('mousemove', _cropMouseMoveHandler = ev => {
    if (!_cropDragActive) return;
    _cropOffsetX = ev.clientX - _cropDragSX;
    _cropOffsetY = ev.clientY - _cropDragSY;
    _drawCropPreview();
  });
  document.addEventListener('mouseup', _cropMouseUpHandler = () => { _cropDragActive = false; });
}

function _drawCropPreview() {
  const canvas = document.getElementById('crop-canvas');
  if (!canvas || !_cropImg) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = CROP_SIZE * dpr;
  canvas.height = CROP_SIZE * dpr;
  canvas.style.width  = CROP_SIZE + 'px';
  canvas.style.height = CROP_SIZE + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);
  ctx.drawImage(_cropImg, _cropOffsetX, _cropOffsetY,
    _cropImg.width * _cropScale, _cropImg.height * _cropScale);
}

function confirmAvatarCrop() {
  if (!_cropImg) return;
  const OUT = 200;
  const ratio = OUT / CROP_SIZE;
  const out = document.createElement('canvas');
  out.width = OUT; out.height = OUT;
  out.getContext('2d').drawImage(
    _cropImg,
    _cropOffsetX  * ratio,
    _cropOffsetY  * ratio,
    _cropImg.width  * _cropScale * ratio,
    _cropImg.height * _cropScale * ratio
  );
  try {
    setData('avatarData', out.toDataURL('image/jpeg', 0.85));
    document.getElementById('avatar-crop-modal').style.display = 'none';
    _cropImg = null;
    if (state.currentPage === 'profile') renderProfile();
    showToast('頭貼已更新 ✓');
  } catch(err) {
    showToast('儲存失敗，請嘗試較小的圖片');
  }
}

function cancelAvatarCrop() {
  document.getElementById('avatar-crop-modal').style.display = 'none';
  _cropImg = null;
}

function openQASheet() {
  document.getElementById('qa-sheet-content').innerHTML = `
    <div style="font-size:.75rem;color:var(--text-3);margin-bottom:14px">來源：翻滾吧傑克 × NASM 認證教練（科學實證）</div>
    ${QA_DATA.map((item, i) => `
      <div class="qa-item">
        <button class="qa-question" onclick="toggleQA(${i})">
          <span>${item.q}</span>
          <span class="qa-chevron" id="qa-ch-${i}">›</span>
        </button>
        <div class="qa-answer" id="qa-ans-${i}" style="display:none">${item.a}</div>
      </div>`).join('')}
  `;
  openBottomSheet('sheet-qa-knowledge');
}

function calcTDEE(body, lastInbody) {
  const weight = parseFloat(body.weight) || lastInbody?.weight;
  const height = parseFloat(body.height);
  const age    = parseFloat(body.age);
  const act    = parseFloat(body.activity) || 1.2;
  if (!weight || !height || !age) return null;

  // Mifflin-St Jeor
  const bmrRaw = body.gender === 'female'
    ? 10 * weight + 6.25 * height - 5 * age - 161
    : 10 * weight + 6.25 * height - 5 * age + 5;
  const bmr  = Math.round(bmrRaw);
  const tdee = Math.round(bmrRaw * act);
  return { bmr, tdee };
}

function saveProfileSetup() {
  const profile = getData('profile', {});
  profile.name = document.getElementById('body-name')?.value?.trim() || '使用者';
  profile.bio  = document.getElementById('body-bio')?.value?.trim()  || '';
  profile.body = {
    gender:   document.getElementById('body-gender')?.value           || 'male',
    age:      parseFloat(document.getElementById('body-age')?.value)    || null,
    height:   parseFloat(document.getElementById('body-height')?.value) || null,
    weight:   parseFloat(document.getElementById('body-weight')?.value) || null,
    activity: document.getElementById('body-activity')?.value         || '1.55',
  };
  setData('profile', profile);
  _profileEditMode = false;
  renderProfile();
  showToast('基本資料已儲存 ✓');
}

// ===== GOALS WIZARD =====
function openGoalsWizard() {
  _wizardStep = 1;
  const profile = getData('profile', {});
  const body = profile.body || {};
  const inbodyRecords = getData('inbody', []);
  const lastInbody = inbodyRecords.length ? inbodyRecords[inbodyRecords.length - 1] : null;
  _wizardWeight = parseFloat(body.weight) || parseFloat(lastInbody?.weight) || 65;
  _wizardFatPct = parseFloat(lastInbody?.fatPct) || 20;
  renderWizard();
  openBottomSheet('sheet-goals-wizard');
}

function renderWizard() {
  const el = document.getElementById('wizard-content');
  if (!el) return;
  for (let i = 1; i <= 3; i++) {
    const dot = document.getElementById(`wz-dot-${i}`);
    if (!dot) continue;
    dot.className = `wizard-step-dot${i < _wizardStep ? ' done' : i === _wizardStep ? ' active' : ''}`;
  }
  if (_wizardStep === 1) el.innerHTML = wizardStep1HTML();
  else if (_wizardStep === 2) el.innerHTML = wizardStep2HTML();
  else { el.innerHTML = wizardStep3HTML(); requestAnimationFrame(updateWizardFeedback); }
}

function wizardStep1HTML() {
  const goals = [
    { key:'fat_loss', icon:'flame',    title:'減脂',    desc:'降低體脂率，熱量赤字' },
    { key:'muscle',   icon:'dumbbell', title:'增肌',    desc:'增加肌肉量，熱量盈餘' },
    { key:'recomp',   icon:'zap',      title:'增肌減脂', desc:'同時增肌減脂，維持熱量' },
  ];
  return `
    <div class="wizard-step-content">
      <div class="wizard-step-title">你想達到什麼目標？</div>
      <div class="wizard-goal-cards">
        ${goals.map(g => `
          <div class="wizard-goal-card${_wizardGoalType===g.key?' active':''}" onclick="setWizardGoal('${g.key}')">
            <div class="wgc-icon">${icon(g.icon, 28)}</div>
            <div class="wgc-title">${g.title}</div>
            <div class="wgc-desc">${g.desc}</div>
          </div>`).join('')}
      </div>
      <div style="margin-top:18px">
        <label class="form-label">目標體脂率（選填）</label>
        <div style="display:flex;align-items:center;gap:8px">
          <input type="number" id="wz-target-fat" class="form-input" style="flex:1"
                 placeholder="例：20" min="5" max="40" step="0.5" value="${_wizardTargetFat||''}">
          <span style="color:var(--text-2)">%</span>
        </div>
      </div>
      <button class="btn-primary full-width" style="margin-top:18px" onclick="goWizardStep(2)">下一步 →</button>
    </div>`;
}

function wizardStep2HTML() {
  const fatMass = r(_wizardWeight * _wizardFatPct / 100, 1);
  const leanMass = r(_wizardWeight - fatMass, 1);
  return `
    <div class="wizard-step-content">
      <div class="wizard-step-title">確認你的體型數據</div>
      <div class="profile-setup-grid">
        <div class="profile-setup-item">
          <label>體重 (kg)</label>
          <input type="number" id="wz-weight" class="form-input" value="${_wizardWeight}" step="0.1" min="30" oninput="updateWizardBodyCalc()">
        </div>
        <div class="profile-setup-item">
          <label>體脂率 (%)</label>
          <input type="number" id="wz-fat-pct" class="form-input" value="${_wizardFatPct}" step="0.5" min="5" max="60" oninput="updateWizardBodyCalc()">
        </div>
      </div>
      <div id="wz-body-calc" style="font-size:.8rem;color:var(--text-3);margin-top:8px;padding:8px 12px;background:var(--bg);border-radius:var(--r-sm)">
        肌肉量約 ${leanMass} kg，脂肪量約 ${fatMass} kg
      </div>
      <div style="display:flex;gap:10px;margin-top:18px">
        <button class="btn-ghost" style="flex:1" onclick="goWizardStep(1)">← 上一步</button>
        <button class="btn-primary" style="flex:2" onclick="goWizardStep(3)">計算目標 →</button>
      </div>
    </div>`;
}

function updateWizardBodyCalc() {
  const w = parseFloat(document.getElementById('wz-weight')?.value) || 0;
  const fp = parseFloat(document.getElementById('wz-fat-pct')?.value) || 0;
  const el = document.getElementById('wz-body-calc');
  if (!el || !w) return;
  const fatMass = r(w * fp / 100, 1);
  const leanMass = r(w - fatMass, 1);
  el.textContent = `肌肉量約 ${leanMass} kg，脂肪量約 ${fatMass} kg`;
}

function wizardStep3HTML() {
  const profile = getData('profile', {});
  const body = profile.body || {};
  const inbodyRecords = getData('inbody', []);
  const lastInbody = inbodyRecords.length ? inbodyRecords[inbodyRecords.length - 1] : null;
  const tdee = calcTDEE(body, lastInbody);

  if (!tdee) {
    return `
      <div class="wizard-step-content" style="text-align:center;padding:20px 0">
        <div style="font-size:2.5rem;margin-bottom:12px">⚠️</div>
        <div style="font-weight:600;margin-bottom:6px">需要基本資料才能計算</div>
        <div style="font-size:.8rem;color:var(--text-3);margin-bottom:16px">請先填寫年齡、身高、活動量</div>
        <button class="btn-primary" onclick="closeBottomSheet('sheet-goals-wizard');editProfileInfo()">前往填寫基本資料</button>
      </div>`;
  }

  _wizardTdee = tdee.tdee;
  const goals = calcWizardGoals(_wizardGoalType, _wizardWeight, _wizardFatPct, tdee.tdee);
  _wizardCalcGoals = goals;
  const goalLabels = { fat_loss:'減脂', muscle:'增肌', recomp:'增肌減脂' };
  const exerciseRecs = {
    fat_loss: '每週重訓 3 次 ＋ 低強度有氧 2 次 ＋ 每日步行 8,000 步（NEAT 是最有效的燃脂工具）',
    muscle:   '每週重訓 4 次，有氧控制在 1~2 次低強度，避免過度消耗造成肌肉流失',
    recomp:   '每週重訓 3~4 次 ＋ 有氧 2 次 ＋ 每日步行 8,000 步；蛋白質是關鍵',
  };

  return `
    <div class="wizard-step-content">
      <div class="wizard-step-title">🎯 ${goalLabels[_wizardGoalType]}建議目標</div>
      <div class="wizard-tdee-row">
        <span>你的 TDEE：</span>
        <strong>${tdee.tdee} kcal</strong>
        <span style="color:var(--text-3);font-size:.75rem">BMR ${tdee.bmr} × ${body.activity||'1.2'}</span>
      </div>
      <div class="wizard-result-card">
        <div class="wrc-formula">${goals.formula}</div>
        <div class="wrc-divider"></div>
        <div class="wizard-result-row">
          <span class="wr-label">${icon('flame', 13)} 熱量</span>
          <div class="wr-input-wrap"><input type="number" id="wz-r-calories" class="wr-input" value="${goals.calories}" oninput="updateWizardFeedback()"> kcal</div>
        </div>
        <div class="wr-feedback" id="wz-fb-calories"></div>
        <div class="wizard-result-row">
          <span class="wr-label">${icon('dumbbell', 13)} 蛋白質</span>
          <div class="wr-input-wrap"><input type="number" id="wz-r-protein" class="wr-input" value="${goals.protein}" oninput="updateWizardFeedback()"> g</div>
          <span class="wr-hint">${goals.proteinFormula}</span>
        </div>
        <div class="wr-feedback" id="wz-fb-protein"></div>
        <div class="wizard-result-row">
          <span class="wr-label">脂肪</span>
          <div class="wr-input-wrap"><input type="number" id="wz-r-fat" class="wr-input" value="${goals.fat}" oninput="updateWizardFeedback()"> g</div>
          <span class="wr-hint">${goals.fatFormula}</span>
        </div>
        <div class="wr-feedback" id="wz-fb-fat"></div>
        <div class="wizard-result-row">
          <span class="wr-label">碳水</span>
          <div class="wr-input-wrap"><input type="number" id="wz-r-carbs" class="wr-input" value="${goals.carbs}" oninput="updateWizardFeedback()"> g</div>
          <span class="wr-hint">剩餘熱量 ÷ 4</span>
        </div>
        <div class="wr-feedback" id="wz-fb-carbs"></div>
        <div class="wizard-result-row">
          <span class="wr-label">纖維</span>
          <div class="wr-input-wrap"><input type="number" id="wz-r-fiber" class="wr-input" value="${goals.fiber}" oninput="updateWizardFeedback()"> g</div>
        </div>
      </div>
      <div class="wizard-exercise-rec">
        <div style="font-size:.75rem;font-weight:700;color:var(--text-2);margin-bottom:4px">${icon('activity', 13)} 運動建議</div>
        <div style="font-size:.8rem;color:var(--text-2);line-height:1.5">${exerciseRecs[_wizardGoalType]}</div>
      </div>
      <div style="display:flex;gap:10px;margin-top:14px">
        <button class="btn-ghost" style="flex:1" onclick="goWizardStep(2)">← 返回</button>
        <button class="btn-primary" style="flex:2" onclick="applyWizardGoals()">✓ 套用目標</button>
      </div>
    </div>`;
}

function setWizardGoal(type) {
  _wizardGoalType = type;
  const el = document.getElementById('wizard-content');
  if (el) el.innerHTML = wizardStep1HTML();
}

function goWizardStep(step) {
  if (step === 2) {
    _wizardTargetFat = parseFloat(document.getElementById('wz-target-fat')?.value) || null;
  }
  if (step === 3) {
    _wizardWeight = parseFloat(document.getElementById('wz-weight')?.value) || _wizardWeight;
    _wizardFatPct = parseFloat(document.getElementById('wz-fat-pct')?.value) || _wizardFatPct;
  }
  _wizardStep = step;
  renderWizard();
}

function calcWizardGoals(goalType, weight, fatPct, tdee) {
  const w = parseFloat(weight) || 65;
  let calories, proteinMult, fatMult, note, formula, proteinFormula, fatFormula;

  if (goalType === 'fat_loss') {
    calories    = Math.round(tdee - 500);
    proteinMult = 2.0; fatMult = 0.8;
    formula     = `TDEE ${tdee} − 500 = ${calories} kcal（每週約減脂 0.5 kg）`;
    note        = '每週減超過體重 1% 時，肌肉流失風險大增。建議配合重訓保留肌肉。';
  } else if (goalType === 'muscle') {
    calories    = Math.round(tdee + 250);
    proteinMult = 1.8; fatMult = 1.0;
    formula     = `TDEE ${tdee} + 250 = ${calories} kcal（適量盈餘）`;
    note        = '增肌期體脂不可避免略微增加，建議每月增重不超過 1 kg 以控制體脂率。';
  } else {
    calories    = Math.round(tdee - 200);
    proteinMult = 2.0; fatMult = 0.9;
    formula     = `TDEE ${tdee} − 200 = ${calories} kcal（微量赤字）`;
    note        = '增肌減脂進展較慢但均衡。蛋白質超過 2.2 g/kg 不會顯著加速效果，1.8~2.0 g/kg 是甜蜜點。';
  }

  const protein = Math.round(w * proteinMult);
  const fatFloor = Math.round(w * 0.8); // hormonal health floor
  const fat = Math.max(Math.round(w * fatMult), fatFloor);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  const fiber = goalType === 'fat_loss' ? 30 : goalType === 'muscle' ? 25 : 28;

  proteinFormula = `${proteinMult} g/kg × ${w} kg`;
  fatFormula = fat === fatFloor
    ? `最低 0.8 g/kg（荷爾蒙健康下限）`
    : `${fatMult} g/kg × ${w} kg`;

  return { calories, protein, fat, carbs, fiber, formula, proteinFormula, fatFormula, note };
}

function applyWizardGoals() {
  const profile = getData('profile', { name:'使用者' });
  profile.goals = {
    calories: parseInt(document.getElementById('wz-r-calories')?.value) || (_wizardCalcGoals?.calories || 2000),
    protein:  parseInt(document.getElementById('wz-r-protein')?.value)  || (_wizardCalcGoals?.protein  || 120),
    fat:      parseInt(document.getElementById('wz-r-fat')?.value)      || (_wizardCalcGoals?.fat      || 65),
    carbs:    parseInt(document.getElementById('wz-r-carbs')?.value)    || (_wizardCalcGoals?.carbs    || 200),
    fiber:    parseInt(document.getElementById('wz-r-fiber')?.value)    || (_wizardCalcGoals?.fiber    || 28),
  };
  setData('profile', profile);
  closeBottomSheet('sheet-goals-wizard');
  renderProfile();
  showToast('目標已套用 ✓');
}

// ===== NOTIFICATION CENTER =====
function computeNotifications() {
  const diary      = getData('diary', {});
  const workoutLog = getData('workoutLog', []);
  const profile    = getData('profile', {});
  const goals      = profile.goals || {};
  const body       = profile.body  || {};
  const weight     = parseFloat(body.weight) || 65;

  // Past 7 days
  const past7 = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    past7.push(dateStr(d));
  }

  const diaryDays  = past7.filter(d => (diary[d] || []).length > 0);
  if (diaryDays.length < 2) return []; // not enough data

  const dayTotals   = diaryDays.map(d => getDailyTotals(d));
  const avgCals     = dayTotals.reduce((s, t) => s + t.calories, 0) / dayTotals.length;
  const avgProtein  = dayTotals.reduce((s, t) => s + t.protein,  0) / dayTotals.length;
  const calGoal     = goals.calories || 0;
  const proGoal     = goals.protein  || 0;

  const weekWk      = workoutLog.filter(w => past7.includes(w.date));
  const strength    = weekWk.filter(w => w.type === 'strength');
  const cardio      = weekWk.filter(w => w.type === 'cardio');

  const notifs = [];

  // ── 重訓多但蛋白質不足 ──
  if (strength.length >= 2 && avgProtein < weight * 1.55) {
    notifs.push({ type:'warn', cat:'運動 × 飲食',
      title:`本週 ${strength.length} 次重訓，蛋白質卻跟不上`,
      body:`平均蛋白質 ${Math.round(avgProtein)} g，建議至少 ${Math.round(weight * 1.6)} g（1.6 g/kg），肌肉合成效率受限`,
      tip:'重訓後 2 小時內補充 30~40 g 蛋白質效果最佳' });
  }

  // ── 無運動 + 熱量超標 ──
  if (calGoal && weekWk.length === 0 && avgCals > calGoal * 1.08 && diaryDays.length >= 3) {
    notifs.push({ type:'warn', cat:'運動 × 熱量',
      title:'本週沒有運動，但熱量頻繁超標',
      body:`平均每日 ${Math.round(avgCals)} kcal，目標 ${calGoal} kcal，本週沒有任何運動記錄`,
      tip:'即使每天快走 30 分鐘也能消耗約 150~200 kcal' });
  }

  // ── 熱量＆蛋白質雙雙不足（掉肌風險）──
  if (calGoal && avgCals < calGoal * 0.8 && avgProtein < weight * 1.6) {
    notifs.push({ type:'danger', cat:'飲食警示',
      title:'熱量和蛋白質同時嚴重不足',
      body:`平均熱量 ${Math.round(avgCals)} kcal（目標 ${calGoal}），蛋白質 ${Math.round(avgProtein)} g（建議 ≥ ${Math.round(weight * 1.6)} g）`,
      tip:'節食期蛋白質應拉到 2.0 g/kg 以保留肌肉' });
  }

  // ── 純有氧、無重訓 ──
  if (cardio.length >= 3 && strength.length === 0) {
    notifs.push({ type:'warn', cat:'運動建議',
      title:`本週 ${cardio.length} 次有氧，但沒有重訓`,
      body:'長期缺乏重訓在減脂期容易流失肌肉，有氧效益也會隨適應遞減',
      tip:'每週加入 2~3 次重訓，即使是 30 分鐘也有效' });
  }

  // ── 蛋白質達標率佳（正向） ──
  if (proGoal && diaryDays.length >= 4) {
    const metDays = dayTotals.filter(t => t.protein >= proGoal * 0.9).length;
    if (metDays >= Math.ceil(diaryDays.length * 0.75)) {
      notifs.push({ type:'ok', cat:'飲食優良',
        title:'蛋白質攝取穩定達標',
        body:`本週 ${diaryDays.length} 天有記錄，${metDays} 天蛋白質達到目標 90% 以上` });
    }
  }

  // ── 重訓＋蛋白質雙達標（正向）──
  if (strength.length >= 3 && avgProtein >= weight * 1.6) {
    notifs.push({ type:'ok', cat:'增肌狀態',
      title:'重訓與蛋白質搭配良好',
      body:`本週 ${strength.length} 次重訓，平均蛋白質 ${Math.round(avgProtein)} g（${(avgProtein/weight).toFixed(1)} g/kg），增肌條件到位` });
  }

  return notifs;
}

function openNotifCenter() {
  const notifs = computeNotifications();
  const el = document.getElementById('notif-center-body');
  if (!el) return;

  const past7Label = (() => {
    const d = new Date(); d.setDate(d.getDate() - 6);
    return `${d.getMonth()+1}/${d.getDate()} – 今日`;
  })();

  if (!notifs.length) {
    el.innerHTML = `
      <div class="notif-empty">
        ${icon('check-circle', 32)}
        <p>本週狀況良好，沒有特別提醒</p>
      </div>`;
  } else {
    el.innerHTML = `<div class="notif-period">${past7Label} · ${notifs.length} 則通知</div>` +
      notifs.map(n => `
        <div class="notif-card ${n.type}">
          <div class="notif-card-header">
            <span class="notif-cat">${n.cat}</span>
            ${icon(n.type === 'danger' ? 'alert-circle' : n.type === 'warn' ? 'alert-triangle' : 'check-circle', 14)}
          </div>
          <div class="notif-title">${n.title}</div>
          <div class="notif-body">${n.body}</div>
          ${n.tip ? `<div class="notif-tip">${icon('lightbulb', 11)} ${n.tip}</div>` : ''}
        </div>`).join('');
  }
  openBottomSheet('sheet-notif-center');
}

function updateWizardFeedback() {
  if (!_wizardCalcGoals) return;

  const calories = parseInt(document.getElementById('wz-r-calories')?.value) || 0;
  const protein  = parseInt(document.getElementById('wz-r-protein')?.value)  || 0;
  const fat      = parseInt(document.getElementById('wz-r-fat')?.value)      || 0;
  const carbs    = parseInt(document.getElementById('wz-r-carbs')?.value)    || 0;
  const w        = parseFloat(_wizardWeight) || 65;
  const rec      = _wizardCalcGoals;
  const tdee     = _wizardTdee;

  const setFb = (id, level, text) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!text) { el.className = 'wr-feedback'; el.innerHTML = ''; return; }
    const icn = level === 'danger' ? 'alert-circle' : level === 'warn' ? 'alert-triangle' : 'check-circle';
    el.className = `wr-feedback ${level}`;
    el.innerHTML = `${icon(icn, 11)} ${text}`;
  };

  // Calories
  const deficit  = tdee - calories;
  const calDelta = calories - rec.calories;
  if (deficit > 750)
    setFb('wz-fb-calories', 'danger', `赤字 ${deficit} kcal，超過建議上限，建議不低於 ${tdee - 500} kcal`);
  else if (calDelta < -150)
    setFb('wz-fb-calories', 'warn', `比建議少 ${Math.abs(calDelta)} kcal，赤字加深，確保蛋白質跟上`);
  else if (calories > tdee + 50)
    setFb('wz-fb-calories', 'warn', `超過 TDEE ${tdee} kcal，體脂會緩慢增加`);
  else
    setFb('wz-fb-calories', '', '');

  // Protein
  const proPerKg = protein / w;
  if (proPerKg < 1.4)
    setFb('wz-fb-protein', 'danger', `${proPerKg.toFixed(1)} g/kg，低於保肌下限，建議至少 ${Math.round(w * 1.6)} g`);
  else if (proPerKg < 1.6)
    setFb('wz-fb-protein', 'warn', `${proPerKg.toFixed(1)} g/kg 略低，建議至少 ${Math.round(w * 1.6)} g（1.6 g/kg）`);
  else if (proPerKg > 2.5)
    setFb('wz-fb-protein', 'ok', `${proPerKg.toFixed(1)} g/kg 超過甜蜜點，效益邊際遞減但無害`);
  else if (protein < rec.protein - 20)
    setFb('wz-fb-protein', 'warn', `比建議少 ${rec.protein - protein} g，對保肌效果有影響`);
  else
    setFb('wz-fb-protein', '', '');

  // Fat
  const fatFloor = Math.round(w * 0.8);
  if (fat < fatFloor)
    setFb('wz-fb-fat', 'danger', `${fat} g 低於荷爾蒙健康下限 ${fatFloor} g，可能影響激素合成`);
  else
    setFb('wz-fb-fat', '', '');

  // Carbs — macro balance check
  const macroCals = protein * 4 + fat * 9 + carbs * 4;
  const gap = macroCals - calories;
  if (gap > 150)
    setFb('wz-fb-carbs', 'warn', `三大營養素合計 ${macroCals} kcal，比熱量目標多 ${gap} kcal`);
  else if (gap < -200)
    setFb('wz-fb-carbs', 'warn', `三大營養素合計 ${macroCals} kcal，偏低 ${Math.abs(gap)} kcal，可調高碳水補足`);
  else
    setFb('wz-fb-carbs', '', '');
}

// ===== Q&A KNOWLEDGE BASE =====
const QA_DATA = [
  { q:'每天應該攝取多少熱量？',
    a:`先用 <strong>Mifflin-St Jeor 公式</strong>計算 BMR，再乘活動係數得 TDEE：<br>
• <strong>減脂：</strong>TDEE − 300~500 kcal，每週約減 0.5~1 kg<br>
• <strong>增肌：</strong>TDEE + 200~300 kcal<br>
• <strong>增肌減脂：</strong>TDEE − 200 kcal（維持接近維持量）<br>
⚠️ <strong>重要：</strong>每週減超過體重 1%，掉肌肉風險大增。長期極低熱量會觸發<em>代謝適應</em>（TDEE 自動下調）。建議偶爾加入「飲食休息日」重置代謝。快速估算：<strong>TDEE × 0.8</strong> = 減脂熱量目標。` },
  { q:'蛋白質每天要吃多少？',
    a:`根據科學研究（EP011、EP027）：<br>
• <strong>減脂期：</strong>2.0~2.2 g/kg 體重（保留肌肉效果最佳）<br>
• <strong>增肌期：</strong>1.6~2.0 g/kg<br>
• <strong>增肌減脂：</strong>1.8~2.0 g/kg<br>
<strong>蛋白質上限：</strong>超過 2.2 g/kg 不會進一步加速減脂，但也不有害。<br>
<strong>分配建議：</strong>分散 3~4 餐，每餐達到 <strong>0.4~0.5 g/kg 體重</strong>，最大化肌肉蛋白合成（MPS）。例：65 kg 的人每餐吃約 26~33 g 蛋白質。` },
  { q:'如何計算三大營養素？',
    a:`按順序計算（先蛋白質，再脂肪下限，最後碳水補足）：<br>
<strong>① 蛋白質：</strong>體重 × 2.0 g × 4 kcal/g<br>
<strong>② 脂肪下限：</strong>最少 0.8~1.0 g/kg（荷爾蒙健康必需；低於此會影響睪固酮、雌激素合成）× 9 kcal/g<br>
<strong>③ 碳水：</strong>（目標熱量 − 蛋白質熱量 − 脂肪熱量）÷ 4<br>
典型減脂巨量比例：蛋白質 30~35% ／ 脂肪 25~30% ／ 碳水 35~40%` },
  { q:'碳水化合物是敵人嗎？',
    a:`<strong>不是！</strong>問題在攝取時機與品質：<br>
• 研究：極低碳 vs 等熱量高碳，每日只多消耗約 <strong>70 kcal</strong>，不值得完全戒斷<br>
• <strong>最佳時機：</strong>運動後攝取，胰島素敏感性最高，優先補充肌糖原，脂肪儲存最少<br>
• <strong>選低 GI 食物：</strong>燕麥、地瓜、糙米，飽腹感長、血糖波動小<br>
• <strong>長期極低碳的風險：</strong>肌肉被分解作為葡萄糖來源，反而加速肌肉流失` },
  { q:'什麼是 NEAT？為什麼比健身更重要？',
    a:`<strong>NEAT</strong>（Non-Exercise Activity Thermogenesis）= 走路、站立、家事、通勤等「非正式運動」的熱量消耗：<br>
• <strong>驚人差異：</strong>同體型兩人 NEAT 差異最高可達 <strong>2,000 kcal/天</strong><br>
• <strong>走路最優：</strong>5~6 km/h 是脂肪氧化效率最高的速度；高強度有氧反而觸發食慾補償<br>
• 每日 <strong>8,000~10,000 步</strong>是務實目標<br>
• 大胃王研究：能多吃不胖的人，NEAT 遠高於常人，而非代謝率更高` },
  { q:'減脂期間怎麼避免掉肌肉？',
    a:`同時做到這四件事，掉肌肉風險大幅下降：<br>
<strong>① 堅持重訓：</strong>無重訓節食，減去的重量有 25~50% 是肌肉<br>
<strong>② 高蛋白飲食：</strong>2.0~2.2 g/kg 體重<br>
<strong>③ 控制有氧強度：</strong>以走路為主，大量高強度有氧使皮質醇升高，加速肌肉分解<br>
<strong>④ 睡眠 7~9 小時：</strong>研究顯示睡 5.5h vs 8.5h，少睡組<strong>少燒 55% 脂肪</strong>、<strong>多掉 60% 肌肉</strong>` },
  { q:'增肌和減脂可以同時進行嗎？',
    a:`<strong>可以！</strong>但有條件：<br>
• 最適合：<strong>初學者</strong>、訓練中斷後重返、<strong>體脂率 &gt; 20%</strong> 的人<br>
• 方法：維持接近 TDEE（微量赤字 −200 kcal）<br>
• 必須條件：高蛋白（1.8~2.0 g/kg）＋ <strong>漸進式超負荷</strong>重訓<br>
• 進展比單純減脂或增肌慢，但體態更均衡<br>
• 體脂率越低（&lt; 15%），增肌減脂同時進行越困難，建議分期` },
  { q:'為什麼中年後容易發胖？',
    a:`<strong>元兇不是代謝率下降，而是活動量降低：</strong><br>
• 生活型態改變 → NEAT 大幅下降<br>
• <strong>肌少症（Sarcopenia）：</strong>不重訓每年流失約 0.5~1% 肌肉。每少 1 kg 肌肉靜息代謝少約 <strong>13 kcal/天</strong><br>
• <strong>荷爾蒙變化：</strong>男性睪固酮下降 → 腹部囤脂 → 胰島素阻抗惡化<br>
• <strong>解法：</strong>維持重訓習慣 ＋ 充足蛋白質（≥ 1.6 g/kg）＋ 增加每日 NEAT` },
  { q:'什麼是彈性飲食法（IIFYM）？',
    a:`<strong>IIFYM（If It Fits Your Macros）= 達到熱量和蛋白質目標，食物選擇保持靈活：</strong><br>
• 告別「只能吃雞胸花椰菜」的迷思<br>
• 減少「破功→放棄→復胖」的惡性循環<br>
• <strong>代謝適應風險：</strong>長期極低熱量使身體自動下調 TDEE<br>
• <strong>解法：</strong>每 4~6 週加入 1~2 天「飲食休息日」（回到 TDEE），重置瘦素、維持代謝率<br>
• <strong>核心：</strong>熱量赤字 ＋ 蛋白質達標 是不可妥協的兩個指標，其餘有彈性` },
  { q:'重訓和有氧，哪個對減脂更重要？',
    a:`<strong>重訓 &gt; 有氧</strong>，原因：<br>
• 重訓後 24~48 小時仍有額外熱量消耗（EPOC 後燃效應）<br>
• 重訓保留甚至增加肌肉量，提高靜息代謝<br>
• 大量有氧易觸發<strong>食慾補償</strong>（多燒多吃），高皮質醇也加速肌肉分解<br>
<strong>最佳組合：</strong><br>
• 減脂：重訓 3 次/週 ＋ 走路 NEAT ＋ 1~2 次低強度有氧<br>
• 增肌：重訓 4 次/週，有氧降至最低限度` },
  { q:'什麼是欺騙餐（Cheat Meal）？真的有效嗎？',
    a:`<strong>欺騙餐 ≠ 暴食，而是一種計畫性攝取高熱量的手段：</strong><br>
<strong>理論依據：</strong><br>
• 長期節食會使 <strong>瘦素（Leptin）</strong> 下降，身體進入省能模式（代謝適應）<br>
• 偶爾攝取高熱量能短暫「欺騙」身體，重置瘦素，維持代謝率<br>
• 心理層面：減少壓抑感，降低「破功→放棄」的機率<br>
<strong>科學建議（IIFYM 框架）：</strong><br>
• 欺騙餐建議在節食 4~6 週後安排 <strong>1~2 天回到維持量（TDEE）</strong>，而非無限暴食<br>
• 優先選擇碳水化合物（最有效提升瘦素），而非高脂食物<br>
• 不應每週安排，否則無法形成足夠的熱量赤字<br>
⚠️ <strong>警告：</strong>研究顯示，一次真正的「暴食」可抵消近一週的熱量赤字。欺騙餐的「計畫性」是關鍵。` },
  { q:'我暴飲暴食了，怎麼辦？',
    a:`<strong>先停止自我懲罰，這是最重要的一步。</strong><br>
<strong>暴食後正確心態：</strong><br>
• 一次暴食增加的體脂遠比你想像的少。假設多吃 2000 kcal，轉化為體脂不超過 <strong>200~250 g</strong><br>
• 隔天體重上升主要來自：食物重量 + 水分 + 糖原，不是脂肪<br>
• 「破功就算了」的想法才是最危險的——一次暴食的傷害遠小於「放棄一週」的傷害<br>
<strong>接下來怎麼做：</strong><br>
• <strong>不要禁食補償</strong>（皮質醇升高 → 更想吃高熱量食物，形成惡性循環）<br>
• 隔天恢復正常飲食節奏，不需要額外減量<br>
• 增加走路（NEAT）自然消耗，不要用高強度有氧「贖罪」<br>
• 喝足水分，幫助消化，多攝取蔬菜和蛋白質幫助飽足感<br>
• 思考觸發暴食的原因（壓力？太餓？社交環境？）並下次提前應對<br>
<strong>長遠策略：</strong>允許自己偶爾不完美，才能長期維持健康習慣。執行率 80% 長達一年，遠勝過執行率 100% 只撐三週。` },
];

function renderQA() {
  return `
    <div class="qa-section">
      <div class="section-heading" style="margin-bottom:4px">💡 科學飲食知識庫</div>
      <div style="font-size:.75rem;color:var(--text-3);margin-bottom:14px">來源：翻滾吧傑克 × NASM 認證教練（科學實證）</div>
      ${QA_DATA.map((item, i) => `
        <div class="qa-item">
          <button class="qa-question" onclick="toggleQA(${i})">
            <span>${item.q}</span>
            <span class="qa-chevron" id="qa-ch-${i}">›</span>
          </button>
          <div class="qa-answer" id="qa-ans-${i}" style="display:none">${item.a}</div>
        </div>`).join('')}
    </div>`;
}

function toggleQA(i) {
  const ans = document.getElementById(`qa-ans-${i}`);
  const ch  = document.getElementById(`qa-ch-${i}`);
  if (!ans) return;
  const open = ans.style.display !== 'none';
  ans.style.display = open ? 'none' : 'block';
  if (ch) ch.style.transform = open ? '' : 'rotate(90deg)';
}

function renderProgressBar(label, current, goal, unit) {
  const pct = goal ? Math.min((current / goal) * 100, 120) : 0;
  const over = goal && current > goal;
  const dispPct = Math.min(pct, 100);
  const goalStr = goal ? `${r(goal)}${unit}` : '未設定';
  return `
    <div class="progress-row">
      <span class="progress-label">${label}</span>
      <div class="progress-track">
        <div class="progress-fill${over ? ' over' : ''}" style="width:${dispPct}%"></div>
      </div>
      <span class="progress-val">${r(current)} / ${goalStr}</span>
    </div>`;
}

// saveGoals replaced by applyWizardGoals

function isGoalAchieved(ds) {
  const profile = getData('profile', { goals: defaultGoals() });
  const goal = (profile.goals || defaultGoals()).calories;
  if (!goal) return false;
  return getDailyTotals(ds).calories >= goal * 0.8;
}

function calculateStreak() {
  const today = new Date();
  const diary = getData('diary', {});
  let current = 0;
  let checkBreak = false;

  for (let i = 1; i <= 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if ((diary[ds]||[]).length > 0 && isGoalAchieved(ds)) { if (!checkBreak) current++; }
    else { checkBreak = true; }
  }

  // Longest streak
  const allDates = Object.keys(diary).sort();
  let longest = 0, temp = 0, prevDs = null;
  allDates.forEach(ds => {
    const [y,m,dd] = ds.split('-').map(Number);
    const prev = prevDs ? new Date(...prevDs.split('-').map((v,i)=>i===1?v-1:Number(v))) : null;
    const cur  = new Date(y, m-1, dd);
    const isConsec = prev && (cur - prev === 86400000);
    if ((diary[ds]||[]).length > 0 && isGoalAchieved(ds)) {
      temp = isConsec ? temp + 1 : 1;
      longest = Math.max(longest, temp);
    } else { temp = 0; }
    prevDs = ds;
  });

  return { current, longest };
}

function countMonthAchieved(year, month) {
  const today = todayStr();
  const diary = getData('diary', {});
  let count = 0;
  const days = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= days; d++) {
    const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if (ds > today) break;
    if ((diary[ds]||[]).length > 0 && isGoalAchieved(ds)) count++;
  }
  return count;
}

function renderCalendar() {
  const y = state.habitCalYear;
  const m = state.habitCalMonth;
  const monthNames = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  const wd = ['日','一','二','三','四','五','六'];
  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const today = todayStr();
  const diary = getData('diary', {});

  let cells = '';
  for (let i = 0; i < firstDay; i++) cells += `<div class="cal-day empty"></div>`;
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = ds === today;
    const isFuture = ds > today;
    let cls = 'cal-day';
    if (isToday) cls += ' today';
    if (isFuture) cls += ' future';
    else if (!(diary[ds]||[]).length) cls += ' no-data';
    else if (isGoalAchieved(ds)) cls += ' achieved';
    else cls += ' not-achieved';
    cells += `<div class="${cls}" title="${ds}">${d}</div>`;
  }

  return `
    <div class="calendar-month-nav">
      <button class="cal-nav-btn" onclick="changeCalMonth(-1)">‹</button>
      <span class="cal-month-label">${y}年 ${monthNames[m]}</span>
      <button class="cal-nav-btn" onclick="changeCalMonth(1)">›</button>
    </div>
    <div class="calendar-weekdays">${wd.map(d=>`<div class="cal-weekday">${d}</div>`).join('')}</div>
    <div class="calendar-grid">${cells}</div>
    <div style="display:flex;gap:14px;margin-top:10px;font-size:0.68rem;color:var(--text-3)">
      <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--sage);margin-right:4px;vertical-align:middle"></span>達標</span>
      <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--coral-pale);border:1px solid #EEBC9C;margin-right:4px;vertical-align:middle"></span>未達標</span>
      <span><span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:var(--border);margin-right:4px;vertical-align:middle"></span>無記錄</span>
    </div>`;
}

function changeCalMonth(delta) {
  state.habitCalMonth += delta;
  if (state.habitCalMonth > 11) { state.habitCalMonth = 0; state.habitCalYear++; }
  if (state.habitCalMonth < 0)  { state.habitCalMonth = 11; state.habitCalYear--; }
  renderProfile();
}

// ===== WORKOUT DIARY =====
let _editingWorkoutId  = null;
let _workoutType       = 'cardio';
let _workoutExercise   = '慢跑';
let _workoutBlocks     = [];

const STRENGTH_PRESETS = ['深蹲','臥推','硬舉','划船','肩推','引體向上','二頭彎舉','三頭伸展','腿推','腿彎舉','臀推'];

function renderWorkout() {
  const chat = document.getElementById('workout-chat');
  if (!chat) return;
  const log = getData('workoutLog', []);
  if (!log.length) {
    chat.innerHTML = `
      <div class="workout-empty">
        ${icon('activity', 40)}
        <p>尚無運動記錄<br>點擊右下角「＋」開始記錄</p>
      </div>`;
    return;
  }
  const today = dateStr(new Date());
  const sorted = [...log].sort((a, b) =>
    (a.date + (a.createdAt || '')) < (b.date + (b.createdAt || '')) ? -1 : 1);

  // Group by date
  const groups = [];
  for (const e of sorted) {
    const last = groups[groups.length - 1];
    if (last && last.date === e.date) last.entries.push(e);
    else groups.push({ date: e.date, entries: [e] });
  }

  let html = '';
  for (const g of groups) {
    html += `<div class="workout-date-sep"><span>${_workoutDateLabel(g.date)}</span></div>`;
    for (const e of g.entries) {
      html += _buildWorkoutEntryBubble(e, g.date === today);
    }
  }
  chat.innerHTML = html;
  chat.scrollTop = chat.scrollHeight;
}

function _workoutDateLabel(ds) {
  const today = dateStr(new Date());
  const yest  = dateStr(new Date(Date.now() - 86400000));
  if (ds === today) return '今天';
  if (ds === yest)  return '昨天';
  const d = new Date(ds);
  const days = ['日','一','二','三','四','五','六'];
  return `${d.getMonth()+1}月${d.getDate()}日（週${days[d.getDay()]}）`;
}

function _buildWorkoutEntryBubble(e, isToday) {
  const side = isToday ? 'right' : 'left';
  let content = '';
  if (e.type === 'cardio') {
    const meta = [e.duration ? `${e.duration}分鐘` : '', e.distance ? `${e.distance}km` : ''].filter(Boolean).join(' · ');
    content = `
      <div class="wb-type-tag cardio">有氧</div>
      <div class="wb-title">${e.exercise || '有氧運動'}</div>
      ${meta ? `<div class="wb-detail">${meta}</div>` : ''}
      ${e.intensity ? `<div class="wb-detail">${e.intensity}</div>` : ''}`;
  } else {
    const rows = (e.blocks || []).map(b => {
      const spec = [b.weight != null ? `${b.weight}kg` : '體重', b.sets && b.reps ? `${b.sets}×${b.reps}` : ''].filter(Boolean).join(' · ');
      return `<div class="wb-block-row"><span class="wb-block-name">${b.name}</span><span class="wb-block-spec">${spec}</span></div>`;
    }).join('');
    content = `<div class="wb-type-tag strength">無氧</div><div class="wb-blocks">${rows}</div>`;
  }
  const note = e.note ? `<div class="wb-note">${e.note}</div>` : '';
  const bubbleInner = `<div class="wdb-entry-body">${content}${note}</div><div class="wdb-edit-btn">${icon('pen-left', 13)}</div>`;
  if (side === 'right') {
    return `<div class="workout-bubble-row right"><div class="workout-bubble right" onclick="openEditWorkout('${e.id}')">${bubbleInner}</div><svg class="wb-tail" viewBox="0 0 11 16" width="11" height="16" style="margin-left:-2px;flex-shrink:0;display:block"><path d="M0 0 H11 C9 4, 3 10, 0 13 Z" style="fill:var(--sage)"/></svg></div>`;
  } else {
    return `<div class="workout-bubble-row left"><svg class="wb-tail" viewBox="0 0 11 16" width="11" height="16" style="margin-right:-2px;flex-shrink:0;display:block;transform:scaleX(-1)"><path d="M0 0 H11 C9 4, 3 10, 0 13 Z" fill="white"/></svg><div class="workout-bubble left" onclick="openEditWorkout('${e.id}')">${bubbleInner}</div></div>`;
  }
}

function openNewWorkoutFormForDate(date) {
  openNewWorkoutForm();
  document.getElementById('wf-date').value = date;
}

function openNewWorkoutForm() {
  _editingWorkoutId = null;
  _workoutBlocks = [{ name:'', weight:null, sets:null, reps:null }];
  document.getElementById('workout-form-title').textContent = '新增運動記錄';
  document.getElementById('workout-delete-btn').style.display = 'none';
  document.getElementById('wf-date').value = dateStr(new Date());
  document.getElementById('wf-duration').value = '';
  document.getElementById('wf-distance').value = '';
  document.getElementById('wf-intensity').value = '';
  document.getElementById('wf-note').value = '';
  setWorkoutType('cardio');
  document.querySelectorAll('#wf-exercise-presets .preset-btn').forEach(b => b.classList.toggle('active', b.dataset.ex === '慢跑'));
  _workoutExercise = '慢跑';
  document.getElementById('wf-exercise-custom').style.display = 'none';
  document.getElementById('sheet-workout-form').style.display = 'flex';
}

function openEditWorkout(id) {
  const log = getData('workoutLog', []);
  const e = log.find(x => x.id === id);
  if (!e) return;
  _editingWorkoutId = id;
  document.getElementById('workout-form-title').textContent = '編輯運動記錄';
  document.getElementById('workout-delete-btn').style.display = '';
  document.getElementById('wf-date').value = e.date;
  document.getElementById('wf-note').value = e.note || '';
  if (e.type === 'cardio') {
    document.getElementById('wf-duration').value  = e.duration  || '';
    document.getElementById('wf-distance').value  = e.distance  || '';
    document.getElementById('wf-intensity').value = e.intensity || '';
    setWorkoutType('cardio');
    const presets = ['慢跑','爬坡','游泳','跳舞','腳踏車'];
    const isCustom = !presets.includes(e.exercise);
    document.querySelectorAll('#wf-exercise-presets .preset-btn').forEach(b =>
      b.classList.toggle('active', isCustom ? b.dataset.ex === 'other' : b.dataset.ex === e.exercise));
    _workoutExercise = isCustom ? 'other' : e.exercise;
    const customEl = document.getElementById('wf-exercise-custom');
    customEl.style.display = isCustom ? '' : 'none';
    if (isCustom) customEl.value = e.exercise;
  } else {
    _workoutBlocks = (e.blocks || []).map(b => ({...b}));
    if (!_workoutBlocks.length) _workoutBlocks = [{ name:'', weight:null, sets:null, reps:null }];
    setWorkoutType('strength');
  }
  document.getElementById('sheet-workout-form').style.display = 'flex';
}

function setWorkoutType(type) {
  _workoutType = type;
  document.querySelectorAll('.wt-btn').forEach(b => b.classList.toggle('active', b.dataset.type === type));
  document.getElementById('wf-cardio-panel').style.display   = type === 'cardio'   ? '' : 'none';
  document.getElementById('wf-strength-panel').style.display = type === 'strength' ? '' : 'none';
  if (type === 'strength') _renderStrengthBlocks();
}

function selectExercise(ex, btn) {
  _workoutExercise = ex;
  document.querySelectorAll('#wf-exercise-presets .preset-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const customEl = document.getElementById('wf-exercise-custom');
  customEl.style.display = ex === 'other' ? '' : 'none';
  if (ex !== 'other') customEl.value = '';
}

function addStrengthBlock() {
  _workoutBlocks.push({ name:'', weight:null, sets:null, reps:null });
  _renderStrengthBlocks();
}

function deleteStrengthBlock(i) {
  _workoutBlocks.splice(i, 1);
  _renderStrengthBlocks();
}

function setSBName(i, name) {
  _workoutBlocks[i].name = name;
  _renderStrengthBlocks();
}

function _renderStrengthBlocks() {
  document.getElementById('wf-blocks-container').innerHTML = _workoutBlocks.map((b, i) => `
    <div class="strength-block">
      <div class="sb-header">
        <input type="text" class="form-input sb-name" placeholder="訓練項目名稱" value="${b.name}"
          oninput="_workoutBlocks[${i}].name=this.value">
        ${_workoutBlocks.length > 1 ? `<button class="sb-del-btn" onclick="deleteStrengthBlock(${i})">✕</button>` : ''}
      </div>
      <div class="sb-presets">
        ${STRENGTH_PRESETS.map(p => `<button class="preset-chip${b.name===p?' active':''}" onclick="setSBName(${i},'${p}')">${p}</button>`).join('')}
      </div>
      <div class="sb-metrics">
        <div class="form-section"><label class="form-label">重量 kg</label>
          <input type="number" class="form-input" placeholder="0" min="0" value="${b.weight??''}"
            oninput="_workoutBlocks[${i}].weight=this.value===''?null:+this.value"></div>
        <div class="form-section"><label class="form-label">組數</label>
          <input type="number" class="form-input" placeholder="4" min="1" value="${b.sets??''}"
            oninput="_workoutBlocks[${i}].sets=this.value===''?null:+this.value"></div>
        <div class="form-section"><label class="form-label">次數</label>
          <input type="number" class="form-input" placeholder="10" min="1" value="${b.reps??''}"
            oninput="_workoutBlocks[${i}].reps=this.value===''?null:+this.value"></div>
      </div>
    </div>`).join('');
}

function saveWorkoutEntry() {
  const date = document.getElementById('wf-date').value;
  if (!date) { showToast('請選擇日期'); return; }
  const note = document.getElementById('wf-note').value.trim();
  let entry = { date, note };

  if (_workoutType === 'cardio') {
    const ex = _workoutExercise === 'other'
      ? document.getElementById('wf-exercise-custom').value.trim()
      : _workoutExercise;
    if (!ex) { showToast('請填寫運動項目'); return; }
    const dur = parseInt(document.getElementById('wf-duration').value) || null;
    const dist = parseFloat(document.getElementById('wf-distance').value) || null;
    const intensity = document.getElementById('wf-intensity').value.trim();
    Object.assign(entry, { type:'cardio', exercise:ex, duration:dur, distance:dist, intensity });
  } else {
    const blocks = _workoutBlocks.filter(b => b.name.trim());
    if (!blocks.length) { showToast('請至少新增一個訓練項目'); return; }
    Object.assign(entry, { type:'strength', blocks });
  }

  const log = getData('workoutLog', []);
  if (_editingWorkoutId) {
    const idx = log.findIndex(e => e.id === _editingWorkoutId);
    if (idx !== -1) { entry.id = _editingWorkoutId; entry.createdAt = log[idx].createdAt; log[idx] = entry; }
  } else {
    entry.id = 'w_' + Date.now();
    entry.createdAt = new Date().toISOString().slice(0, 19);
    log.push(entry);
  }
  setData('workoutLog', log);
  closeBottomSheet('sheet-workout-form');
  renderWorkout();
  showToast(_editingWorkoutId ? '已更新' : '已記錄');
  if (!_editingWorkoutId) onWorkoutAdded();
}

function deleteCurrentWorkout() {
  if (!_editingWorkoutId) return;
  const log = getData('workoutLog', []).filter(e => e.id !== _editingWorkoutId);
  setData('workoutLog', log);
  closeBottomSheet('sheet-workout-form');
  renderWorkout();
  showToast('已刪除');
}

// ===== PROFILE / WIZARD STATE =====
let _profileEditMode = false;
let _wizardStep = 1;
let _wizardGoalType = 'recomp';
let _wizardWeight = 65;
let _wizardFatPct = 20;
let _wizardTargetFat = null;
let _wizardCalcGoals = null;
let _wizardTdee = 0;

// ===== HABITS =====
let _selectedHabitColor = HABIT_COLORS[0];
let _currentDetailHabitId = null;

let _habitArchiveOpen = false;
function toggleHabitArchive() {
  _habitArchiveOpen = !_habitArchiveOpen;
  const body = document.getElementById('habit-archive-body');
  const chevron = document.getElementById('habit-archive-chevron');
  if (body) body.style.display = _habitArchiveOpen ? '' : 'none';
  if (chevron) chevron.style.transform = _habitArchiveOpen ? 'rotate(90deg)' : '';
}

function renderHabits() {
  const habits  = getData('habits', []);
  const active   = habits.filter(h => !h.archived);
  const archived = habits.filter(h => h.archived);
  const container = document.getElementById('habits-content');
  if (!container) return;

  if (!active.length && !archived.length) {
    container.innerHTML = `
      <div class="placeholder-view">
        <div class="placeholder-icon">🎯</div>
        <div class="placeholder-text">還沒有習慣</div>
        <div class="placeholder-sub">點擊右下角 ＋ 新增第一個習慣</div>
      </div>`;
    return;
  }

  let html = '';
  if (active.length) {
    html += `${_buildHabitDateHeader()}${active.map(h => buildHabitRow(h)).join('')}`;
  } else {
    html += `<div style="padding:20px 0 8px;text-align:center;color:var(--text-3);font-size:.85rem">尚無進行中的習慣</div>`;
  }

  if (archived.length) {
    html += `
      <div class="habit-archive-section">
        <div class="habit-archive-header" onclick="toggleHabitArchive()">
          <span>已封存習慣</span>
          <span class="habit-archive-count">${archived.length}</span>
          <span id="habit-archive-chevron" class="habit-archive-chevron" style="transform:${_habitArchiveOpen ? 'rotate(90deg)' : ''}">›</span>
        </div>
        <div id="habit-archive-body" style="display:${_habitArchiveOpen ? '' : 'none'}">
          ${archived.map(h => buildHabitRow(h)).join('')}
        </div>
      </div>`;
  }
  container.innerHTML = html;
}

function _buildHabitDateHeader() {
  const today = new Date();
  const DOW = ['日','一','二','三','四','五','六'];
  let cols = '';
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    cols += `<div class="habit-date-col">
      <span class="habit-date-dow">週${DOW[d.getDay()]}</span>
      <span class="habit-date-num">${d.getDate()}</span>
    </div>`;
  }
  return `<div class="habit-date-header">
    <div class="habit-date-spacer"></div>
    <div class="habit-date-cols">${cols}</div>
  </div>`;
}

function buildHabitRow(habit) {
  const log  = getData('habitLog', {});
  const today = new Date();

  // 5 squares: index 0 = today (left), 4 = 4 days ago (right)
  let squaresHtml = '';
  for (let i = 0; i < 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const ds = dateStr(d);
    const s  = (log[ds] || {})[habit.id] || '';

    let cls = 'habit-day-sq';
    let colorStyle = '';
    let symbol = '✕';

    if (s === 'done') {
      cls += ' is-done';
      colorStyle = `color:${habit.color}`;
      symbol = '✓';
    } else if (s === 'skip') {
      cls += ' is-skip';
      colorStyle = `color:${habit.color}`;
      symbol = '—';
    } else {
      cls += ' is-empty';
    }

    squaresHtml += `<button class="${cls}" style="${colorStyle}"
      onclick="event.stopPropagation();toggleHabitDay('${habit.id}','${ds}')"
      >${symbol}</button>`;
  }

  return `
    <div class="habit-row" onclick="openHabitDetail('${habit.id}')">
      <div class="habit-row-info">
        <span class="habit-row-dot" style="background:${habit.color}"></span>
        <span class="habit-row-name" style="color:${habit.color}">${habit.name}</span>
      </div>
      <div class="habit-row-squares">${squaresHtml}</div>
    </div>`;
}

function toggleHabitDay(habitId, ds) {
  const log = getData('habitLog', {});
  if (!log[ds]) log[ds] = {};
  const cur  = log[ds][habitId] || '';
  const next = cur === '' ? 'done' : cur === 'done' ? 'skip' : '';
  if (next === '') delete log[ds][habitId];
  else log[ds][habitId] = next;
  setData('habitLog', log);
  if (next === 'done' && cur === '') onHabitLogged();
  renderHabits();
}

function buildFreqLabel(freq) {
  if (!freq || freq.type === 'daily')        return '每天';
  if (freq.type === 'every_x_days')          return `每${freq.x}天`;
  if (freq.type === 'per_week')              return `每週${freq.x}次`;
  if (freq.type === 'per_month')             return `每月${freq.x}次`;
  return '';
}

// ── Frequency-aware streak ──────────────────────────────────────────
function calcHabitStreak(habitOrId) {
  const habit = typeof habitOrId === 'string'
    ? (getData('habits', []).find(h => h.id === habitOrId) || { id: habitOrId, freq: { type: 'daily' } })
    : habitOrId;
  const freq  = habit.freq || { type: 'daily' };
  const log   = getData('habitLog', {});
  const today = new Date();

  if (freq.type === 'daily')        return _streakDaily(habit.id, log, today);
  if (freq.type === 'every_x_days') return _streakEveryX(habit.id, log, today, freq.x || 1);
  if (freq.type === 'per_week')     return _streakPerWeek(habit.id, log, today, freq.x || 1);
  if (freq.type === 'per_month')    return _streakPerMonth(habit.id, log, today, freq.x || 1);
  return 0;
}

function _streakDaily(habitId, log, today) {
  let streak = 0;
  for (let i = 0; i <= 365; i++) {
    const d = new Date(today); d.setDate(today.getDate() - i);
    const s = (log[dateStr(d)] || {})[habitId] || '';
    if (i === 0 && s === '') continue;   // today not yet checked → start from yesterday
    if (s === 'done') streak++;
    else if (s === 'skip') continue;     // — doesn't break daily streak
    else break;
  }
  return streak;
}

function _streakEveryX(habitId, log, today, x) {
  // Count consecutive non-overlapping X-day windows (newest first) each having ≥1 ✓
  let streak = 0;
  let winEnd = new Date(today);
  for (let attempt = 0; attempt < Math.ceil(365 / x); attempt++) {
    let hasCheck = false, hasAny = false;
    for (let offset = 0; offset < x; offset++) {
      const d = new Date(winEnd); d.setDate(winEnd.getDate() - offset);
      if (d > today) continue;
      const s = (log[dateStr(d)] || {})[habitId] || '';
      if (s !== '') hasAny = true;
      if (s === 'done') hasCheck = true;
    }
    if (!hasAny && attempt === 0) { winEnd.setDate(winEnd.getDate() - x); continue; }
    if (hasCheck) { streak++; winEnd.setDate(winEnd.getDate() - x); }
    else break;
  }
  return streak;
}

function _streakPerWeek(habitId, log, today, x) {
  // Count consecutive calendar weeks (Sun–Sat) each with ≥ x ✓
  let streak = 0;
  const dow = today.getDay();
  let wEnd = new Date(today); wEnd.setDate(today.getDate() + (6 - dow)); // this Saturday
  for (let w = 0; w < 52; w++) {
    const wStart = new Date(wEnd); wStart.setDate(wEnd.getDate() - 6);
    let count = 0;
    for (let d = new Date(wStart); d <= wEnd; d.setDate(d.getDate() + 1)) {
      if (d > today) continue;
      if ((log[dateStr(d)] || {})[habitId] === 'done') count++;
    }
    if (count === 0 && w === 0) { wEnd = new Date(wStart); wEnd.setDate(wStart.getDate() - 1); continue; }
    if (count >= x) { streak++; wEnd = new Date(wStart); wEnd.setDate(wStart.getDate() - 1); }
    else break;
  }
  return streak;
}

function _streakPerMonth(habitId, log, today, x) {
  // Count consecutive calendar months each with ≥ x ✓
  let streak = 0;
  let y = today.getFullYear(), m = today.getMonth();
  for (let i = 0; i < 24; i++) {
    const mStart = new Date(y, m, 1);
    const mEnd   = new Date(y, m + 1, 0);
    let count = 0;
    for (let d = new Date(mStart); d <= mEnd && d <= today; d.setDate(d.getDate() + 1)) {
      if ((log[dateStr(d)] || {})[habitId] === 'done') count++;
    }
    if (count === 0 && i === 0) { m--; if (m < 0) { m = 11; y--; } continue; }
    if (count >= x) { streak++; m--; if (m < 0) { m = 11; y--; } }
    else break;
  }
  return streak;
}

// ── Habit detail page ───────────────────────────────────────────────
function openHabitDetail(habitId) {
  const habit = getData('habits', []).find(h => h.id === habitId);
  if (!habit) return;
  _currentDetailHabitId = habitId;
  const titleEl = document.getElementById('habit-detail-title');
  if (titleEl) titleEl.textContent = habit.name;
  navigateTo('habit-detail');
}

function openEditCurrentHabit() {
  if (_currentDetailHabitId) openEditHabitSheet(_currentDetailHabitId);
}

function renderHabitDetail() {
  const container = document.getElementById('habit-detail-content');
  if (!container || !_currentDetailHabitId) return;
  const habit = getData('habits', []).find(h => h.id === _currentDetailHabitId);
  if (!habit) return;
  const log = getData('habitLog', {});

  const freqLabel = buildFreqLabel(habit.freq);
  container.innerHTML = `
    <div class="habit-detail-inner">
      <div class="hd-section-card">
        <div class="hd-section-title" style="display:flex;align-items:center;justify-content:space-between">
          歷史紀錄
          <span class="hd-freq-tag" style="color:${habit.color};border-color:${habit.color}">${freqLabel}</span>
        </div>
        ${buildHistoryGrid(habit, log)}
      </div>
      <div class="hd-section-card">
        ${buildStreakBars(habit, log)}
      </div>
    </div>`;

  // Scroll to newest (right) and init drag-scroll
  requestAnimationFrame(() => {
    const el = document.getElementById('hhg-scroll');
    if (el) { el.scrollLeft = el.scrollWidth; _initHhgScroll(el); }
  });
}

function _initHhgScroll(el) {
  if (!el || el._hhgInited) return;
  el._hhgInited = true;

  // Touch drag
  let tStartX = 0, tStartSL = 0, tActive = false;
  el.addEventListener('touchstart', e => {
    tStartX  = e.touches[0].clientX;
    tStartSL = el.scrollLeft;
    tActive  = true;
  }, { passive: true });
  el.addEventListener('touchmove', e => {
    if (!tActive) return;
    const dx = tStartX - e.touches[0].clientX;
    el.scrollLeft = tStartSL + dx;
    e.preventDefault();          // stop parent from hijacking horizontal swipe
  }, { passive: false });
  el.addEventListener('touchend',   () => { tActive = false; });
  el.addEventListener('touchcancel',() => { tActive = false; });

  // Mouse drag (desktop)
  let mDown = false, mX = 0, mSL = 0;
  el.style.cursor = 'grab';
  el.addEventListener('mousedown', e => {
    mDown = true; mX = e.clientX; mSL = el.scrollLeft;
    el.style.cursor = 'grabbing'; e.preventDefault();
  });
  const onMove = e => { if (mDown) el.scrollLeft = mSL - (e.clientX - mX); };
  const onUp   = () => { if (mDown) { mDown = false; el.style.cursor = 'grab'; } };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup',   onUp);
}

function buildHistoryGrid(habit, log) {
  const CELL = 26, GAP = 3, WEEKS = 26;
  const today = new Date();
  const todayDs = dateStr(today);

  // Sunday of current week
  const dow = today.getDay();
  const currentSun = new Date(today);
  currentSun.setDate(today.getDate() - dow);
  currentSun.setHours(0, 0, 0, 0);

  // Build weeks oldest→newest (left→right)
  const weeks = [];
  for (let w = WEEKS - 1; w >= 0; w--) {
    const sun = new Date(currentSun);
    sun.setDate(currentSun.getDate() - w * 7);
    weeks.push(sun);
  }

  // Month labels: show at column where month first appears
  const monthLabels = {};
  let prevM = -1;
  weeks.forEach((sun, col) => {
    if (sun.getMonth() !== prevM) {
      prevM = sun.getMonth();
      const yr = sun.getFullYear();
      const mo = sun.getMonth() + 1;
      monthLabels[col] = mo === 1 ? `${yr}\n${mo}月` : `${mo}月`;
    }
  });

  // Generate all cells (grid-auto-flow:column → fills top→bottom per column)
  let cellsHtml = '';
  weeks.forEach((sun) => {
    for (let d = 0; d < 7; d++) {
      const cd = new Date(sun); cd.setDate(sun.getDate() + d);
      const ds  = dateStr(cd);
      const isFuture = cd > today;
      const isToday  = ds === todayDs;
      const s = isFuture ? '' : ((log[ds] || {})[habit.id] || '');

      let cls = 'hhg-cell';
      let style = '';
      let onClick = '';

      if (isFuture) {
        cls += ' hhg-future';
      } else {
        if (isToday) cls += ' hhg-today';
        if (s === 'done')      { cls += ' hhg-done'; style = `background:${habit.color}`; }
        else if (s === 'skip') { cls += ' hhg-skip'; style = `background:${habit.color}`; }
        onClick = `onclick="toggleHistoryCell('${habit.id}','${ds}')"`;
      }
      cellsHtml += `<div class="${cls}" style="${style}" ${onClick}></div>`;
    }
  });

  // Month label row (CSS grid, one cell per column)
  const monthRowHtml = weeks.map((_, i) => {
    if (!monthLabels[i]) return `<div class="hhg-month-cell"></div>`;
    const lines = monthLabels[i].split('\n');
    return `<div class="hhg-month-cell has-label">${lines.join('<br>')}</div>`;
  }).join('');

  return `
    <div class="hhg-outer">
      <div class="hhg-scroll" id="hhg-scroll">
        <div class="hhg-scroll-inner">
          <div class="hhg-month-row" style="grid-template-columns:repeat(${WEEKS},${CELL}px);gap:0 ${GAP}px">${monthRowHtml}</div>
          <div class="hhg-grid" style="grid-template-columns:repeat(${WEEKS},${CELL}px);grid-template-rows:repeat(7,${CELL}px);gap:${GAP}px">${cellsHtml}</div>
        </div>
      </div>
      <div class="hhg-day-labels" style="--hhg-cell:${CELL}px;--hhg-gap:${GAP}px">
        <div>日</div><div>一</div><div>二</div><div>三</div><div>四</div><div>五</div><div>六</div>
      </div>
    </div>`;
}

function toggleHistoryCell(habitId, ds) {
  const log = getData('habitLog', {});
  if (!log[ds]) log[ds] = {};
  const cur  = log[ds][habitId] || '';
  const next = cur === '' ? 'done' : cur === 'done' ? 'skip' : '';
  if (next === '') delete log[ds][habitId];
  else log[ds][habitId] = next;
  setData('habitLog', log);
  if (next === 'done' && cur === '') onHabitLogged();
  renderHabitDetail();
  requestAnimationFrame(() => {
    const el = document.getElementById('hhg-scroll');
    if (el) { el.scrollLeft = el.scrollWidth; _initHhgScroll(el); }
  });
}

function buildStreakBars(habit, log) {
  const streaks = calcAllStreaks(habit.id, log);
  if (!streaks.length) {
    return `<div class="hd-section-title">最長紀錄</div><div class="hstreak-empty">尚無連續紀錄</div>`;
  }
  const maxLen = streaks[0].len;
  // Each row wrapper = proportional width, centred under the longest bar
  const barsHtml = streaks.map(s => {
    const ratio   = s.len / maxLen;
    const opacity = 0.4 + 0.6 * ratio;
    const pct     = Math.round(ratio * 100);
    return `
      <div class="hstreak-row">
        <div class="hstreak-bar-wrap">
          <div class="hstreak-bar" style="width:${pct}%;background:${habit.color};opacity:${opacity}">
            <span class="hstreak-date start">${shortDateLabel(s.start)}</span>
            <span class="hstreak-count">${s.len}</span>
            <span class="hstreak-date end">${shortDateLabel(s.end)}</span>
          </div>
        </div>
      </div>`;
  }).join('');
  return `<div class="hd-section-title">最長紀錄</div><div class="hstreak-section">${barsHtml}</div>`;
}

function calcAllStreaks(habitId, log) {
  // Find all consecutive ✓/— runs
  const activeDates = Object.keys(log)
    .filter(ds => { const s = (log[ds] || {})[habitId]; return s === 'done' || s === 'skip'; })
    .sort();
  if (!activeDates.length) return [];

  const streaks = [];
  let start = activeDates[0], end = activeDates[0], len = 1;
  for (let i = 1; i < activeDates.length; i++) {
    if (dayNum(activeDates[i]) - dayNum(activeDates[i - 1]) === 1) {
      end = activeDates[i]; len++;
    } else {
      streaks.push({ start, end, len });
      start = activeDates[i]; end = activeDates[i]; len = 1;
    }
  }
  streaks.push({ start, end, len });
  return streaks.sort((a, b) => b.len - a.len).slice(0, 4);
}

function dayNum(ds) {
  const [y, m, d] = ds.split('-').map(Number);
  return Math.floor(new Date(y, m - 1, d).getTime() / 86400000);
}

function shortDateLabel(ds) {
  const [y, m, d] = ds.split('-').map(Number);
  const thisYear = new Date().getFullYear();
  return y === thisYear ? `${m}月${d}日` : `${y}年${m}月${d}日`;
}

// helper: Date → 'YYYY-MM-DD'
function dateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

// ===== HABIT FORM =====
function openAddHabitSheet() {
  document.getElementById('habit-form-title').textContent = '新增習慣';
  document.getElementById('habit-id').value = '';
  document.getElementById('habit-name-input').value = '';
  document.getElementById('habit-freq-x').value = '1';
  document.getElementById('habit-delete-row').style.display = 'none';
  _selectedHabitColor = HABIT_COLORS[0];
  renderColorPicker();
  setHabitFreq('daily');
  openBottomSheet('sheet-habit-form');
}

function openEditHabitSheet(habitId) {
  const habit = getData('habits', []).find(h => h.id === habitId);
  if (!habit) return;
  document.getElementById('habit-form-title').textContent = '編輯習慣';
  document.getElementById('habit-id').value = habitId;
  document.getElementById('habit-name-input').value = habit.name;
  document.getElementById('habit-delete-row').style.display = 'block';
  const archBtn = document.getElementById('habit-archive-btn');
  if (archBtn) archBtn.textContent = habit.archived ? '取消封存' : '封存此習慣';
  document.getElementById('habit-freq-x').value = habit.freq?.x || 1;
  _selectedHabitColor = habit.color || HABIT_COLORS[0];
  renderColorPicker();
  setHabitFreq(habit.freq?.type || 'daily');
  openBottomSheet('sheet-habit-form');
}

function renderColorPicker() {
  const picker = document.getElementById('habit-color-picker');
  if (!picker) return;
  picker.innerHTML = HABIT_COLORS.map(c => `
    <button class="color-swatch${c === _selectedHabitColor ? ' active' : ''}"
            data-color="${c}" style="background:${c}"
            onclick="selectHabitColor('${c}')">
      ${c === _selectedHabitColor ? '✓' : ''}
    </button>`).join('');
}

function selectHabitColor(color) {
  _selectedHabitColor = color;
  document.querySelectorAll('.color-swatch').forEach(s => {
    const active = s.dataset.color === color;
    s.classList.toggle('active', active);
    s.textContent = active ? '✓' : '';
  });
}

function setHabitFreq(type) {
  document.querySelectorAll('.freq-tab').forEach(b =>
    b.classList.toggle('active', b.dataset.freq === type));
  const xRow  = document.getElementById('habit-freq-x-row');
  const xUnit = document.getElementById('habit-freq-x-unit');
  if (xRow) xRow.style.display = type === 'daily' ? 'none' : 'flex';
  if (xUnit) {
    const labels = { every_x_days:'天一次', per_week:'次 / 週', per_month:'次 / 月' };
    xUnit.textContent = labels[type] || '';
  }
}

function saveHabitForm() {
  const name = document.getElementById('habit-name-input').value.trim();
  if (!name) { showToast('請輸入習慣名稱'); return; }

  const id = document.getElementById('habit-id').value || generateId('h');
  const activeFreqTab = document.querySelector('.freq-tab.active');
  const freqType = activeFreqTab?.dataset.freq || 'daily';
  const freqX    = parseInt(document.getElementById('habit-freq-x').value) || 1;
  const freq     = freqType === 'daily' ? { type: 'daily' } : { type: freqType, x: freqX };

  const habit = { id, name, color: _selectedHabitColor, freq };
  const habits = getData('habits', []);
  const idx = habits.findIndex(h => h.id === id);
  if (idx >= 0) habits[idx] = habit; else habits.push(habit);
  setData('habits', habits);

  closeBottomSheet('sheet-habit-form');
  renderHabits();
  showToast(idx >= 0 ? '習慣已更新' : '習慣已新增！');
}

function archiveHabitConfirm(habitId) {
  if (!habitId) return;
  const habits = getData('habits', []);
  const habit  = habits.find(h => h.id === habitId);
  if (!habit) return;
  const action = habit.archived ? '取消封存' : '封存';
  showConfirm(
    `${action}習慣「<strong>${habit.name}</strong>」？<br>` +
    `<small style="color:var(--text-3)">${habit.archived ? '習慣將回到進行中清單' : '封存後移至封存區，打卡記錄與成就均保留'}</small>`,
    () => {
      habit.archived = !habit.archived;
      setData('habits', habits);
      closeBottomSheet('sheet-habit-form');
      renderHabits();
      showToast(habit.archived ? '習慣已封存' : '習慣已取消封存');
    },
    habit.archived ? '確認取消封存' : '確認封存'
  );
}

function _recheckHabitAchievements(gd) {
  const habitAchIds = [
    'habit_first','habit_streak_7','habit_streak_30','habit_streak_100',
    'read_7','read_30','read_100',
    'water_7','water_30',
    'no_sugar_7','no_sugar_30','no_sugar_100',
    'streak_habit_combo',
  ];
  const allHabits = getData('habits', []);
  const habitLog  = getData('habitLog', {});
  const anyDone   = Object.values(habitLog).some(d => Object.values(d || {}).some(v => v === 'done'));
  const maxS      = allHabits.reduce((mx, h) => Math.max(mx, calcHabitStreak(h)), 0);
  function gs(key) {
    const kws = HABIT_KEYWORD_GROUPS[key];
    return allHabits.filter(h => kws.some(kw => h.name.includes(kw)))
      .reduce((mx, h) => Math.max(mx, calcHabitStreak(h)), 0);
  }
  const readS  = gs('read'), waterS = gs('water'), sugarS = gs('no_sugar');
  const dStreak = _calcDiaryStreak(getData('diary', {}));

  const stillValid = new Set();
  if (anyDone)      stillValid.add('habit_first');
  if (maxS >= 7)    stillValid.add('habit_streak_7');
  if (maxS >= 30)   stillValid.add('habit_streak_30');
  if (maxS >= 100)  stillValid.add('habit_streak_100');
  if (readS >= 7)   stillValid.add('read_7');
  if (readS >= 30)  stillValid.add('read_30');
  if (readS >= 100) stillValid.add('read_100');
  if (waterS >= 7)  stillValid.add('water_7');
  if (waterS >= 30) stillValid.add('water_30');
  if (sugarS >= 7)   stillValid.add('no_sugar_7');
  if (sugarS >= 30)  stillValid.add('no_sugar_30');
  if (sugarS >= 100) stillValid.add('no_sugar_100');
  if (dStreak >= 30 && maxS >= 30) stillValid.add('streak_habit_combo');

  habitAchIds.forEach(id => {
    if ((gd.achievements || []).includes(id) && !stillValid.has(id)) {
      gd.achievements = gd.achievements.filter(a => a !== id);
      const td = TITLES_DEF.find(t => t.unlock === id);
      if (td) gd.titles = (gd.titles || []).filter(t => t !== td.id);
    }
  });
  if (!(gd.titles || []).includes(gd.activeTitle)) gd.activeTitle = '旅人';
}

function deleteHabitConfirm(habitId) {
  if (!habitId) return;
  const habit = getData('habits', []).find(h => h.id === habitId);
  if (!habit) return;
  showConfirm(
    `永久刪除習慣「<strong>${habit.name}</strong>」？` +
    `<br><small style="color:var(--text-3)">打卡記錄將清除，相關成就與稱號也會一併移除，無法復原。<br>如只是暫停，建議改用「封存」。</small>`,
    () => {
      const habits = getData('habits', []).filter(h => h.id !== habitId);
      setData('habits', habits);
      const log = getData('habitLog', {});
      Object.keys(log).forEach(ds => { if (log[ds]) delete log[ds][habitId]; });
      setData('habitLog', log);
      const gd = getGameData();
      _recheckHabitAchievements(gd);
      setData('gamification', gd);
      closeBottomSheet('sheet-habit-form');
      navigateTo('habits');
      showToast('習慣已永久刪除');
    }
  );
}

// ===== INBODY =====
let _inbodyTrendRange = '6m';

function renderInbody() {
  const allRecords = getData('inbody', []);
  const records    = allRecords.slice().reverse(); // newest first
  const container  = document.getElementById('inbody-content');
  if (!container) return;

  // Today's quick weight card
  const todayWLog = getData('weightLog', {});
  const todayW = todayWLog[todayStr()];
  const wInput = todayW != null ? todayW : '';
  let html = `
    <div class="quick-weight-card">
      <div class="qw-label">${icon('activity', 14)} 今日體重</div>
      <div class="qw-row">
        <input type="number" id="wlog-input" class="qw-input" placeholder="kg" step="0.1" min="20" max="300" value="${wInput}">
        <span class="qw-unit">kg</span>
        <button class="qw-btn" onclick="saveWeightLog()">記錄</button>
      </div>
    </div>`;

  // Last record time — plain centered text, no box
  const lastTimeText = records.length
    ? `最後紀錄時間：${records[0].date}`
    : '尚無記錄';
  html += `<div class="inbody-last-time">${lastTimeText}</div>`;

  // Trend charts (3 compact)
  if (allRecords.length >= 2) {
    const toggleHtml = `
      <div class="trend-toggle">
        <button class="trend-toggle-btn${_inbodyTrendRange==='3m'?' active':''}" onclick="setInbodyTrendRange('3m')">近3月</button>
        <button class="trend-toggle-btn${_inbodyTrendRange==='6m'?' active':''}" onclick="setInbodyTrendRange('6m')">近6月</button>
        <button class="trend-toggle-btn${_inbodyTrendRange==='all'?' active':''}" onclick="setInbodyTrendRange('all')">全部</button>
      </div>`;
    html += `
      <div class="trend-card">
        <div class="trend-card-header"><span class="trend-card-title">體重趨勢 (kg)</span>${toggleHtml}</div>
        <canvas id="trend-weight" class="trend-canvas" height="65"></canvas>
      </div>
      <div class="trend-card">
        <div class="trend-card-header"><span class="trend-card-title">體脂率趨勢 (%)</span></div>
        <canvas id="trend-fat" class="trend-canvas" height="65"></canvas>
      </div>
      <div class="trend-card">
        <div class="trend-card-header"><span class="trend-card-title">肌肉量趨勢 (kg)</span></div>
        <canvas id="trend-muscle" class="trend-canvas" height="65"></canvas>
      </div>`;
  }

  // Add button
  html += `<button class="inbody-add-btn" onclick="openAddInbodySheet()">＋ 新增完整體組成記錄</button>`;

  // Records carousel (each record with its own body map)
  if (records.length) {
    const dots = records.length > 1
      ? `<div class="carousel-indicators" id="carousel-dots">
           ${records.map((_, i) =>
             `<span class="carousel-dot${i===0?' active':''}" onclick="scrollCarouselTo(${i})"></span>`
           ).join('')}
         </div>`
      : '';
    html += `
      <div class="record-carousel-wrap">
        <div class="record-carousel" id="record-carousel">
          ${records.map(rec => `
            <div class="record-slide">${buildInbodyCard(rec)}</div>`).join('')}
        </div>
        ${dots}
      </div>`;
  } else {
    html += `<div style="display:flex;flex-direction:column;align-items:center;padding:40px 0;gap:10px;color:var(--text-3)">
      <div style="opacity:.3">${icon('list', 48)}</div>
      <div style="font-size:.9rem;font-weight:600">尚無完整記錄</div>
      <div style="font-size:.8rem">點擊上方按鈕新增</div>
    </div>`;
  }

  container.innerHTML = html;

  // Draw trend charts
  if (allRecords.length >= 2) {
    drawSingleTrendChart('trend-weight', allRecords, 'weight', 'kg', '#4D6A55', true);
    drawSingleTrendChart('trend-fat',    allRecords, 'fatPct', '%',  '#D98866', false);
    drawSingleTrendChart('trend-muscle', allRecords, 'muscle', 'kg', '#4A7FA5', false);
  }

  // Draw body maps for every record that has segment data
  records.forEach(rec => {
    if (rec.leftArm || rec.rightArm || rec.trunk || rec.leftLeg || rec.rightLeg) {
      drawBodyMap(rec, `rec-bodymap-${rec.id}`);
    }
  });

  // Carousel dot sync
  initCarouselDots();
}

function setInbodyTrendRange(range) {
  _inbodyTrendRange = range;
  renderInbody();
}

// Carousel state (JS-transform based — avoids overflow-x:hidden on .page)
let _carIdx   = 0;   // current slide index
let _carTotal = 0;   // total slides
let _carSX    = 0;   // swipe start X
let _carCX    = 0;   // swipe current X
let _carDrag  = false;
let _carAxis  = null; // 'h' | 'v' — determined on first move
let _carMouseMove = null, _carMouseUp = null;

function initCarouselDots() {
  const c = document.getElementById('record-carousel');
  if (!c) return;
  _carTotal = c.querySelectorAll('.record-slide').length;
  _carIdx   = 0;
  c.style.transform  = 'translateX(0)';
  c.style.transition = 'transform .32s cubic-bezier(.25,.46,.45,.94)';

  if (_carTotal <= 1) return;

  // Touch events (passive — browser handles vertical scroll, we handle horizontal)
  c.addEventListener('touchstart', ev => {
    _carSX   = ev.touches[0].clientX;
    _carCX   = _carSX;
    _carAxis = null;
    _carDrag = true;
    c.style.transition = 'none';
  }, { passive: true });

  c.addEventListener('touchmove', ev => {
    if (!_carDrag) return;
    const dx = ev.touches[0].clientX - _carSX;
    const dy = ev.touches[0].clientY - _carSX;
    if (!_carAxis) _carAxis = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
    if (_carAxis === 'h') {
      _carCX = ev.touches[0].clientX;
      c.style.transform = `translateX(calc(${-_carIdx * 100}% + ${dx}px))`;
    }
  }, { passive: true });

  c.addEventListener('touchend', () => {
    if (!_carDrag) return;
    _carDrag = false;
    const dx = _carCX - _carSX;
    c.style.transition = 'transform .32s cubic-bezier(.25,.46,.45,.94)';
    if (dx < -48 && _carIdx < _carTotal - 1) _carIdx++;
    else if (dx > 48 && _carIdx > 0)         _carIdx--;
    c.style.transform = `translateX(${-_carIdx * 100}%)`;
    _carUpdateDots();
  });

  // Mouse drag (for desktop preview)
  c.addEventListener('mousedown', ev => {
    _carSX = ev.clientX; _carCX = ev.clientX;
    _carDrag = true;
    c.style.transition = 'none';
    c.classList.add('is-dragging');
    ev.preventDefault();
  });

  if (_carMouseMove) document.removeEventListener('mousemove', _carMouseMove);
  if (_carMouseUp)   document.removeEventListener('mouseup',   _carMouseUp);

  document.addEventListener('mousemove', _carMouseMove = ev => {
    if (!_carDrag) return;
    _carCX = ev.clientX;
    c.style.transform = `translateX(calc(${-_carIdx * 100}% + ${ev.clientX - _carSX}px))`;
  });
  document.addEventListener('mouseup', _carMouseUp = ev => {
    if (!_carDrag) return;
    _carDrag = false;
    c.classList.remove('is-dragging');
    const dx = ev.clientX - _carSX;
    c.style.transition = 'transform .32s cubic-bezier(.25,.46,.45,.94)';
    if (dx < -48 && _carIdx < _carTotal - 1) _carIdx++;
    else if (dx > 48 && _carIdx > 0)         _carIdx--;
    c.style.transform = `translateX(${-_carIdx * 100}%)`;
    _carUpdateDots();
  });
}

function _carUpdateDots() {
  document.querySelectorAll('#carousel-dots .carousel-dot').forEach((d, i) =>
    d.classList.toggle('active', i === _carIdx));
}

function scrollCarouselTo(idx) {
  const c = document.getElementById('record-carousel');
  if (!c) return;
  _carIdx = Math.max(0, Math.min(idx, _carTotal - 1));
  c.style.transition = 'transform .32s cubic-bezier(.25,.46,.45,.94)';
  c.style.transform  = `translateX(${-_carIdx * 100}%)`;
  _carUpdateDots();
}

function saveWeightLog() {
  const val = parseFloat(document.getElementById('wlog-input')?.value);
  if (!val || val <= 0) { showToast('請輸入有效體重'); return; }
  const log = getData('weightLog', {});
  log[todayStr()] = val;
  setData('weightLog', log);
  showToast(`已記錄 ${val} kg`);
  if (document.getElementById('profile-content')) renderProfile();
}

// ===== SINGLE-METRIC TREND CHART =====
function drawSingleTrendChart(canvasId, allRecords, field, unit, color, includeWeightLog) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const cutoffDate = () => {
    const c = new Date();
    if (_inbodyTrendRange === '3m') c.setMonth(c.getMonth() - 3);
    else if (_inbodyTrendRange === '6m') c.setMonth(c.getMonth() - 6);
    else return null;
    return dateStr(c);
  };
  const cutoff = cutoffDate();

  let series = allRecords
    .map(r => ({ date: r.date, v: r[field] }))
    .filter(d => d.v != null && (!cutoff || d.date >= cutoff));

  if (includeWeightLog && field === 'weight') {
    const wLog = getData('weightLog', {});
    Object.entries(wLog).forEach(([date, w]) => {
      if (cutoff && date < cutoff) return;
      if (!series.find(d => d.date === date)) series.push({ date, v: w });
    });
    series.sort((a, b) => a.date.localeCompare(b.date));
  }

  const containerW = canvas.parentElement?.clientWidth || 300;
  canvas.width = containerW - 32;
  const W = canvas.width, H = canvas.height;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  if (series.length < 2) {
    ctx.fillStyle = '#AEADA8'; ctx.font = '11px DM Sans, sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('資料不足，請新增更多記錄', W / 2, H / 2);
    return;
  }

  const small = H < 90;
  const PAD = { t: small ? 6 : 14, r: 16, b: small ? 16 : 26, l: 38 };
  const cW = W - PAD.l - PAD.r, cH = H - PAD.t - PAD.b;
  const vals = series.map(d => d.v);
  const minV = Math.min(...vals), maxV = Math.max(...vals);
  const pad = (maxV - minV) * 0.18 || 1;
  const lo = minV - pad, hi = maxV + pad;

  const dToMs = ds => new Date(ds).getTime();
  const firstMs = dToMs(series[0].date), lastMs = dToMs(series[series.length - 1].date);
  const spanMs = Math.max(1, lastMs - firstMs);
  const xS = d => PAD.l + ((dToMs(d) - firstMs) / spanMs) * cW;
  const yS = v => PAD.t + cH - ((v - lo) / (hi - lo)) * cH;

  // Grid — always 3 ticks (lo / mid / hi)
  ctx.strokeStyle = '#E2E0D9'; ctx.lineWidth = 1;
  for (let i = 0; i <= 2; i++) {
    const v = lo + (hi - lo) * (i / 2);
    const y = yS(v);
    ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(W - PAD.r, y); ctx.stroke();
    ctx.fillStyle = '#AEADA8'; ctx.font = '9px DM Sans, sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText(Math.round(v * 10) / 10, PAD.l - 4, y);
  }

  // X labels
  const fmt = ds => { const [,m,d] = ds.split('-'); return `${+m}/${+d}`; };
  ctx.fillStyle = '#AEADA8'; ctx.font = '9px DM Sans, sans-serif'; ctx.textAlign = 'center';
  ctx.fillText(fmt(series[0].date), PAD.l, H - (small ? 4 : 8));
  ctx.fillText(fmt(series[series.length - 1].date), W - PAD.r, H - (small ? 4 : 8));
  if (!small && series.length > 3) {
    const mid = series[Math.floor(series.length / 2)];
    ctx.fillText(fmt(mid.date), xS(mid.date), H - 8);
  }

  // Gradient fill
  const grad = ctx.createLinearGradient(0, PAD.t, 0, H - PAD.b);
  grad.addColorStop(0, color + '40'); grad.addColorStop(1, color + '00');
  ctx.beginPath();
  series.forEach((pt, i) => { i === 0 ? ctx.moveTo(xS(pt.date), yS(pt.v)) : ctx.lineTo(xS(pt.date), yS(pt.v)); });
  ctx.lineTo(xS(series[series.length - 1].date), H - PAD.b);
  ctx.lineTo(xS(series[0].date), H - PAD.b);
  ctx.closePath(); ctx.fillStyle = grad; ctx.fill();

  // Line
  ctx.beginPath();
  series.forEach((pt, i) => { i === 0 ? ctx.moveTo(xS(pt.date), yS(pt.v)) : ctx.lineTo(xS(pt.date), yS(pt.v)); });
  ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.stroke();

  // Dots
  series.forEach(pt => {
    ctx.beginPath(); ctx.arc(xS(pt.date), yS(pt.v), 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.arc(xS(pt.date), yS(pt.v), 2.5, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
  });

  // Latest value label
  const last = series[series.length - 1];
  const lastX = xS(last.date);
  const lastY = yS(last.v);
  if (small) {
    // compact: right-edge badge
    ctx.fillStyle = color; ctx.font = 'bold 9px DM Sans, sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillText(`${last.v}${unit}`, W - PAD.r, PAD.t + 10);
  } else {
    ctx.fillStyle = color; ctx.font = 'bold 11px DM Sans, sans-serif';
    ctx.textAlign = 'right'; ctx.textBaseline = 'bottom';
    ctx.fillText(`${last.v}${unit}`, lastX - 4, lastY - 4);
  }
}

function buildInbodyCard(rec) {
  const fmt = v => (v != null && v !== '') ? v : '—';
  const hasSeg = rec.leftArm || rec.rightArm || rec.trunk || rec.leftLeg || rec.rightLeg;
  return `
    <div class="inbody-record-card">
      <div class="inbody-record-header">
        <span class="inbody-record-date">📅 ${rec.date}</span>
        <button class="inbody-record-delete" onclick="openEditInbodySheet('${rec.id}')">✎</button>
      </div>
      <div class="inbody-metrics-grid">
        <div class="inbody-metric">
          <span class="inbody-metric-val">${fmt(rec.weight)}<span class="inbody-metric-unit">kg</span></span>
          <span class="inbody-metric-lbl">體重</span>
        </div>
        <div class="inbody-metric">
          <span class="inbody-metric-val">${fmt(rec.fatPct)}<span class="inbody-metric-unit">%</span></span>
          <span class="inbody-metric-lbl">體脂率</span>
        </div>
        <div class="inbody-metric">
          <span class="inbody-metric-val">${fmt(rec.muscle)}<span class="inbody-metric-unit">kg</span></span>
          <span class="inbody-metric-lbl">肌肉量</span>
        </div>
        <div class="inbody-metric">
          <span class="inbody-metric-val">${fmt(rec.bmi)}</span>
          <span class="inbody-metric-lbl">BMI</span>
        </div>
        <div class="inbody-metric">
          <span class="inbody-metric-val">${fmt(rec.visceral)}</span>
          <span class="inbody-metric-lbl">內臟脂肪</span>
        </div>
        <div class="inbody-metric">
          <span class="inbody-metric-val">${fmt(rec.bmr)}<span class="inbody-metric-unit" style="font-size:.75rem">kcal</span></span>
          <span class="inbody-metric-lbl">基礎代謝</span>
        </div>
      </div>
      ${hasSeg ? `
      <div style="margin-top:10px">
        <div style="font-size:.75rem;font-weight:700;color:var(--text-3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:2px">部位肌肉分析</div>
        <canvas id="rec-bodymap-${rec.id}" style="display:block;width:100%"></canvas>
      </div>` : ''}
    </div>`;
}

// ===== INBODY BODY MAP (Canvas) =====
function drawBodyMap(rec, canvasId = 'inbody-bodymap') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // Canvas geometry: fills full parent width, height auto-fits all labels
  const dpr       = window.devicePixelRatio || 1;
  const parentW   = canvas.parentElement?.clientWidth || 280;
  const cssW      = parentW - 2;
  const LABEL_MULT = 1.25;
  const R         = cssW * 0.27;

  // All drawing metrics scale with R.
  // fs=1 when R=90 (≈ typical phone, canvas ~335px wide).
  // Capped at 1.5 so labels never overflow on large screens.
  const fs      = Math.min(1.5, Math.max(1.0, R / 90));
  const lineH   = Math.max(15, Math.round(13 * fs));  // vertical gap between label rows (min 15)
  const dotR    = Math.max(4, Math.round(5   * fs));   // data dot radius
  const perpOff = Math.round(11  * fs);   // score-number perp offset from vertex
  const legDotR = Math.max(3, Math.round(4   * fs));   // legend dot radius
  const legStep = Math.round(82  * fs);   // legend item step

  // Font strings (minimum 11px on all sizes)
  const fLbl = `${Math.max(11, Math.round(10  * fs))}px DM Sans, sans-serif`;
  const fKg  = `bold ${Math.max(12, Math.round(11 * fs))}px DM Sans, sans-serif`;
  const fRtg = `${Math.max(11, Math.round(9.5 * fs))}px DM Sans, sans-serif`;
  const fScr = `bold ${Math.max(11, Math.round(9  * fs))}px DM Sans, sans-serif`;
  const fLeg = `${Math.max(11, Math.round(9  * fs))}px DM Sans, sans-serif`;

  // Derive canvas height from the scaled line spacing
  const cy   = Math.ceil(R * LABEL_MULT + 3 * lineH + 12);
  const cssH = cy + Math.ceil(R * LABEL_MULT) + 3 * lineH + 30;

  canvas.width   = cssW * dpr;
  canvas.height  = cssH * dpr;
  canvas.style.width  = cssW + 'px';
  canvas.style.height = cssH + 'px';

  const W = cssW, H = cssH;
  const cx = W / 2;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  // Pentagon constants
  const N        = 5;
  const startAng = -Math.PI / 2;
  const angStep  = (2 * Math.PI) / N;

  // Segments: clockwise from top
  const SEGS = [
    { label:'軀幹', data: rec.trunk    },
    { label:'右手', data: rec.rightArm },
    { label:'右腿', data: rec.rightLeg },
    { label:'左腿', data: rec.leftLeg  },
    { label:'左手', data: rec.leftArm  },
  ];

  // Helpers
  const vert = (i, frac) => {
    const a = startAng + i * angStep;
    return { x: cx + R * frac * Math.cos(a), y: cy + R * frac * Math.sin(a), a };
  };
  const scoreFrac  = s => Math.max(0, Math.min(1, (s + 4) / 8));
  const scoreColor = s => {
    if (s == null) return '#CCCBC5';
    if (s >= 2)   return '#D4732A';
    if (s <= -2)  return '#4A7FA5';
    return '#4D6A55';
  };
  const ratingText = s => {
    if (s == null) return null;
    if (s >= 2)  return '偏高';
    if (s <= -2) return '偏低';
    return '平均';
  };

  // === 1. Outer pentagon outline ===
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const p = vert(i, 1);
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.strokeStyle = '#DDDBD4'; ctx.lineWidth = 1; ctx.stroke();

  // === 2. Inner grid rings at -2, 0, +2 ===
  [-2, 0, 2].forEach(gs => {
    const frac = scoreFrac(gs);
    if (frac <= 0) return;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const p = vert(i, frac);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    }
    ctx.closePath();
    ctx.strokeStyle = gs === 0 ? '#CBD6E2' : '#ECEAE4';
    ctx.lineWidth = gs === 0 ? 0.8 : 0.6;
    ctx.stroke();
  });

  // === 3. Light-blue average zone (-1 to +1) ===
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const p = vert(i, scoreFrac(1));
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.fillStyle   = 'rgba(74,127,165,0.14)';
  ctx.strokeStyle = 'rgba(74,127,165,0.28)';
  ctx.lineWidth = 0.8; ctx.fill(); ctx.stroke();

  // Peel back below score -1 (white cutout)
  ctx.beginPath();
  for (let i = 0; i < N; i++) {
    const p = vert(i, scoreFrac(-1));
    i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(247,246,242,0.85)'; ctx.fill();
  ctx.restore();

  // === 4. Axis lines (center → outer vertex) ===
  for (let i = 0; i < N; i++) {
    const outer = vert(i, 1);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(outer.x, outer.y);
    ctx.strokeStyle = '#DDDBD4'; ctx.lineWidth = 0.7; ctx.stroke();
  }

  // === 5. Data polygon (connecting score positions) ===
  if (SEGS.some(s => s.data?.score != null)) {
    ctx.beginPath();
    SEGS.forEach((s, i) => {
      const frac = scoreFrac(s.data?.score ?? 0);
      const p    = vert(i, frac);
      i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
    });
    ctx.closePath();
    ctx.fillStyle   = 'rgba(77,106,85,0.10)';
    ctx.strokeStyle = 'rgba(77,106,85,0.50)';
    ctx.lineWidth = 1.5; ctx.fill(); ctx.stroke();
  }

  // === 6. Data dots ===
  SEGS.forEach((s, i) => {
    const score = s.data?.score;
    if (score == null) return;
    const p = vert(i, scoreFrac(score));
    const c = scoreColor(score);
    ctx.beginPath(); ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
    ctx.fillStyle = c; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
  });

  // === 7. Labels (part name + kg + rating) outside each vertex ===
  SEGS.forEach((s, i) => {
    const a    = startAng + i * angStep;
    const cosA = Math.cos(a), sinA = Math.sin(a);
    const lx   = cx + R * LABEL_MULT * cosA;
    const ly   = cy + R * LABEL_MULT * sinA;

    const score = s.data?.score;
    const c     = scoreColor(score);
    const rt    = ratingText(score);

    // Alignment by quadrant
    const tAlign = Math.abs(cosA) < 0.22 ? 'center' : cosA < 0 ? 'right' : 'left';
    ctx.textAlign = tAlign;
    ctx.textBaseline = 'middle';

    // Vertical stacking — lineH and fonts scale with canvas size (fs)
    let y1, y2, y3;
    if (i === 0) {
      // top vertex: stack upward (closest to vertex = bottom line)
      y3 = ly - 4;
      y2 = y3 - lineH;
      y1 = y2 - lineH;
    } else {
      y1 = ly - lineH;
      y2 = ly;
      y3 = ly + lineH;
    }

    // Part name
    ctx.fillStyle = '#757370';
    ctx.font = fLbl;
    ctx.fillText(s.label, lx, y1);

    // kg value
    if (s.data?.kg != null) {
      ctx.fillStyle = '#333333';
      ctx.font = fKg;
      ctx.fillText(`${s.data.kg}kg`, lx, y2);
    }

    // Rating text (colour-coded)
    if (rt) {
      ctx.fillStyle = c;
      ctx.font = fRtg;
      ctx.fillText(rt, lx, y3);
    }

    // Score number alongside outer-vertex tip (offset perpendicular to axis)
    if (score != null) {
      const tipP = vert(i, 1);
      const scoreStr = (score > 0 ? '+' : '') + score;
      const perpX = -sinA * perpOff, perpY = cosA * perpOff;
      ctx.fillStyle = c;
      ctx.font = fScr;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(scoreStr, tipP.x + perpX, tipP.y + perpY);
    }
  });

  // === 8. Legend ===
  const leg = [
    { c:'#D4732A', l:'偏高 +2~+4' },
    { c:'#4D6A55', l:'平均 -1~+1' },
    { c:'#4A7FA5', l:'偏低 -2~-4' },
  ];
  let legX = Math.max(legDotR + 4, (W - 3 * legStep) / 2);
  const legY = H - legDotR - 6;
  leg.forEach(li => {
    ctx.beginPath(); ctx.arc(legX + legDotR, legY, legDotR, 0, Math.PI * 2);
    ctx.fillStyle = li.c; ctx.fill();
    ctx.fillStyle = '#AEADA8'; ctx.font = fLeg;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(li.l, legX + legDotR * 2 + 3, legY);
    legX += legStep;
  });
}

// ===== INBODY FORM =====
const SEG_FIELDS = ['left-arm','right-arm','trunk','left-leg','right-leg'];

function clearInbodySegFields() {
  SEG_FIELDS.forEach(f => {
    const kg = document.getElementById(`seg-${f}-kg`);
    const sc = document.getElementById(`seg-${f}-score`);
    if (kg) kg.value = '';
    if (sc) sc.value = '';
  });
}

function fillInbodySegFields(rec) {
  const map = { 'left-arm': rec.leftArm, 'right-arm': rec.rightArm,
                trunk: rec.trunk, 'left-leg': rec.leftLeg, 'right-leg': rec.rightLeg };
  SEG_FIELDS.forEach(f => {
    const data = map[f];
    const kg = document.getElementById(`seg-${f}-kg`);
    const sc = document.getElementById(`seg-${f}-score`);
    if (kg) kg.value = data?.kg ?? '';
    if (sc) sc.value = data?.score ?? '';
  });
}

function readInbodySegFields() {
  const read = f => {
    const kg = parseFloatOrNull(`seg-${f}-kg`);
    const sc = parseFloatOrNull(`seg-${f}-score`);
    return (kg != null || sc != null) ? { kg, score: sc != null ? Math.round(sc) : null } : null;
  };
  return {
    leftArm:  read('left-arm'),
    rightArm: read('right-arm'),
    trunk:    read('trunk'),
    leftLeg:  read('left-leg'),
    rightLeg: read('right-leg'),
  };
}

function openAddInbodySheet() {
  document.getElementById('inbody-form-title').textContent = '新增體組成記錄';
  document.getElementById('inbody-record-id').value = '';
  document.getElementById('inbody-date').value = todayStr();
  document.getElementById('inbody-delete-row').style.display = 'none';
  ['inbody-weight','inbody-fat-pct','inbody-muscle','inbody-bmi','inbody-visceral','inbody-bmr']
    .forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  clearInbodySegFields();
  openBottomSheet('sheet-inbody-form');
}

function openEditInbodySheet(recordId) {
  const records = getData('inbody', []);
  const rec = records.find(r => r.id === recordId);
  if (!rec) return;
  document.getElementById('inbody-form-title').textContent = '編輯記錄';
  document.getElementById('inbody-record-id').value = recordId;
  document.getElementById('inbody-date').value = rec.date || todayStr();
  document.getElementById('inbody-weight').value   = rec.weight   ?? '';
  document.getElementById('inbody-fat-pct').value  = rec.fatPct   ?? '';
  document.getElementById('inbody-muscle').value   = rec.muscle   ?? '';
  document.getElementById('inbody-bmi').value      = rec.bmi      ?? '';
  document.getElementById('inbody-visceral').value = rec.visceral ?? '';
  document.getElementById('inbody-bmr').value      = rec.bmr      ?? '';
  fillInbodySegFields(rec);
  document.getElementById('inbody-delete-row').style.display = 'block';
  openBottomSheet('sheet-inbody-form');
}

function saveInbodyRecord() {
  const id   = document.getElementById('inbody-record-id').value || generateId('ib');
  const date = document.getElementById('inbody-date').value || todayStr();
  const seg  = readInbodySegFields();
  const rec  = {
    id, date,
    weight:   parseFloatOrNull('inbody-weight'),
    fatPct:   parseFloatOrNull('inbody-fat-pct'),
    muscle:   parseFloatOrNull('inbody-muscle'),
    bmi:      parseFloatOrNull('inbody-bmi'),
    visceral: parseFloatOrNull('inbody-visceral'),
    bmr:      parseFloatOrNull('inbody-bmr'),
    ...seg,
  };
  if (!rec.weight && !rec.fatPct && !rec.muscle) { showToast('請至少填寫一項數據'); return; }
  const records = getData('inbody', []);
  const idx = records.findIndex(r => r.id === id);
  if (idx >= 0) records[idx] = rec; else records.push(rec);
  records.sort((a, b) => a.date.localeCompare(b.date));
  setData('inbody', records);
  closeBottomSheet('sheet-inbody-form');
  renderInbody();
  if (state.currentPage === 'profile') renderProfile();
  showToast(idx >= 0 ? '記錄已更新' : '記錄已儲存！');
}

function deleteInbodyRecord(recordId) {
  if (!recordId) return;
  showConfirm('確定刪除此體組成記錄？', () => {
    const records = getData('inbody', []).filter(r => r.id !== recordId);
    setData('inbody', records);
    closeBottomSheet('sheet-inbody-form');
    renderInbody();
    showToast('記錄已刪除');
  });
}

// ================================================================
//  DAILY QUEST SYSTEM
// ================================================================

// 使用 GitHub API（非 raw CDN），避免 Fastly CDN 快取問題
const TASKS_API_URL = 'https://api.github.com/repos/ffffffffrog-glitch/fetching_daily_task/contents/tasks.json';

async function fetchDailyTasks() {
  const cached = getData('cachedTasks', null);
  if (cached && cached.date === todayStr()) { updateEarthArchive(cached); return cached; }
  try {
    const res = await fetch(TASKS_API_URL, {
      cache: 'no-store',
      headers: { 'Accept': 'application/vnd.github.v3.raw' }
    });
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    setData('cachedTasks', data);
    updateEarthArchive(data);
    return data;
  } catch {
    if (cached) updateEarthArchive(cached);
    return cached || null;
  }
}

function updateEarthArchive(tasks) {
  if (!tasks) return;
  const archive = getData('earthArchive', []);
  let changed = false;
  const add = (task, type, date) => {
    if (!archive.find(e => e.task === task)) {
      archive.push({ task, type, firstSeen: date });
      changed = true;
    }
  };
  // 先把 history（所有歷史天）全部加入，確保資料不會因為沒開 App 而遺失
  const days = tasks.history && tasks.history.length ? tasks.history : [tasks];
  days.forEach(day => {
    (day.main || []).forEach(t => add(t, 'main', day.date));
    (day.side || []).forEach(t => add(t, 'side', day.date));
  });
  if (changed) setData('earthArchive', archive);
}

// ── Custom tasks ──────────────────────────────────────────────────
function getCustomTasks() { return getData('customTasks', []); }

function openCustomTaskModal(id = null) {
  const task = id ? getCustomTasks().find(t => t.id === id) : null;
  document.getElementById('ct-modal-title').textContent = task ? '編輯任務' : '新增任務';
  document.getElementById('ct-editing-id').value = id || '';
  document.getElementById('ct-name').value = task ? task.name : '';
  document.getElementById('ct-xp').value = task ? task.xp : 20;
  document.getElementById('ct-gold').value = task ? task.gold : 10;
  document.getElementById('modal-custom-task').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('ct-name').focus(), 100);
}

function closeCustomTaskModal() {
  document.getElementById('modal-custom-task').style.display = 'none';
  document.body.style.overflow = '';
}

function saveCustomTaskModal() {
  const id   = document.getElementById('ct-editing-id').value;
  const name = document.getElementById('ct-name').value.trim();
  const xp   = Math.max(0, parseInt(document.getElementById('ct-xp').value)   || 0);
  const gold = Math.max(0, parseInt(document.getElementById('ct-gold').value)  || 0);
  if (!name) { document.getElementById('ct-name').focus(); return; }
  const tasks = getCustomTasks();
  if (id) {
    const idx = tasks.findIndex(t => t.id === id);
    if (idx >= 0) tasks[idx] = { ...tasks[idx], name, xp, gold };
  } else {
    tasks.push({ id: 'ct_' + Date.now(), name, xp, gold });
  }
  setData('customTasks', tasks);
  closeCustomTaskModal();
  renderQuests();
}

function deleteCustomTask(id) {
  if (!confirm('確定刪除此任務？')) return;
  setData('customTasks', getCustomTasks().filter(t => t.id !== id));
  renderQuests();
}

function toggleCustomTask(id) {
  const today = todayStr();
  const done = getData('dailyQuestsDone', {});
  if (!done[today]) done[today] = { main: [], side: [], mainTasks: [], sideTasks: [], customDone: {} };
  if (!done[today].customDone) done[today].customDone = {};
  const wasChecked = done[today].customDone[id] || false;
  done[today].customDone[id] = !wasChecked;
  setData('dailyQuestsDone', done);
  const task = getCustomTasks().find(t => t.id === id);
  if (task) {
    const gd = getGameData();
    const prevLevel = gd.level;
    if (!wasChecked) {
      _grantXP(gd, task.xp);
      _grantGold(gd, task.gold);
      const newAch = _runAchievementChecks(gd);
      setData('gamification', gd);
      _showRewards(prevLevel, gd.level, newAch);
    } else {
      _deductXP(gd, task.xp);
      _deductGold(gd, task.gold);
      setData('gamification', gd);
    }
  }
  renderQuests();
}

// ── Edit daily task ───────────────────────────────────────────────
function _getTaskReward(td, type, index) {
  const defaults = type === 'main' ? { xp: 20, gold: 10 } : { xp: 15, gold: 8 };
  const arr = type === 'main' ? td?.mainRewards : td?.sideRewards;
  return (arr && arr[index]) || defaults;
}

function openEditDailyTaskModal(type, index) {
  const td = (getData('dailyQuestsDone', {}))[todayStr()];
  const tasks = type === 'main' ? td?.mainTasks : td?.sideTasks;
  const reward = _getTaskReward(td, type, index);
  document.getElementById('edit-dt-type').value = type;
  document.getElementById('edit-dt-index').value = index;
  document.getElementById('edit-dt-text').value = (tasks || [])[index] || '';
  document.getElementById('edit-dt-xp').value = reward.xp;
  document.getElementById('edit-dt-gold').value = reward.gold;
  document.getElementById('modal-edit-daily-task').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('edit-dt-text').select(), 100);
}

function closeEditDailyTaskModal() {
  document.getElementById('modal-edit-daily-task').style.display = 'none';
  document.body.style.overflow = '';
}

function saveEditDailyTask() {
  const type  = document.getElementById('edit-dt-type').value;
  const index = parseInt(document.getElementById('edit-dt-index').value);
  const text  = document.getElementById('edit-dt-text').value.trim();
  const xp    = parseInt(document.getElementById('edit-dt-xp').value) || 0;
  const gold  = parseInt(document.getElementById('edit-dt-gold').value) || 0;
  if (!text) return;
  const done = getData('dailyQuestsDone', {});
  const td = done[todayStr()];
  if (!td) return;
  const taskArr = type === 'main' ? td.mainTasks : td.sideTasks;
  if (taskArr) taskArr[index] = text;
  const rewardKey = type === 'main' ? 'mainRewards' : 'sideRewards';
  if (!td[rewardKey]) td[rewardKey] = [];
  td[rewardKey][index] = { xp, gold };
  setData('dailyQuestsDone', done);
  closeEditDailyTaskModal();
  renderQuests();
}

// ── Render ────────────────────────────────────────────────────────
async function renderQuests() {
  const el = document.getElementById('quest-content');
  if (!el) return;
  el.innerHTML = `<div class="quest-loading">${icon('flag', 28)}<p>載入任務中…</p></div>`;

  const tasks   = await fetchDailyTasks();
  const today   = todayStr();
  const ctasks  = getCustomTasks();
  const done    = getData('dailyQuestsDone', {});
  const customDone = (done[today] || {}).customDone || {};

  // ── Daily tasks section ──
  let dailyHtml = '';
  if (!tasks || (!tasks.main?.length && !tasks.side?.length)) {
    dailyHtml = `
      <div class="quest-loading" style="padding:30px 0 10px">
        ${icon('flag', 28)}
        <p>今日任務尚未更新</p>
        <p style="font-size:.8rem;color:var(--text-3);margin-top:4px">每天早上 9 點後更新</p>
      </div>`;
  } else {
    const isStale = tasks.date !== today;
    if (!done[today]) {
      done[today] = {
        main: tasks.main.map(() => false), side: tasks.side.map(() => false),
        mainTasks: [...tasks.main], sideTasks: [...tasks.side],
      };
      setData('dailyQuestsDone', done);
    }
    const td = done[today];
    if (!td.mainTasks) { td.mainTasks = [...tasks.main]; td.sideTasks = [...tasks.side]; setData('dailyQuestsDone', done); }
    // If we now have real today's tasks but content differs from what was cached (stale init), refresh text
    if (!isStale && td.mainTasks.join('|') !== tasks.main.join('|')) {
      td.mainTasks = [...tasks.main]; td.sideTasks = [...tasks.side];
      while (td.main.length < tasks.main.length) td.main.push(false);
      while (td.side.length < tasks.side.length) td.side.push(false);
      setData('dailyQuestsDone', done);
    }
    while (td.main.length < tasks.main.length) td.main.push(false);
    while (td.side.length < tasks.side.length) td.side.push(false);

    const mainDone = td.main.filter(Boolean).length;
    const sideDone = td.side.filter(Boolean).length;
    const allMainDone = tasks.main.length > 0 && mainDone === tasks.main.length;
    const allDone = allMainDone && (tasks.side.length === 0 || sideDone === tasks.side.length);

    dailyHtml = `
      ${isStale ? `<div class="quest-stale-banner">${icon('info', 13)} 顯示 ${tasks.date} 的任務，今日任務更新中</div>` : ''}
      <div class="quest-header-card ${allDone ? 'all-done' : ''}">
        <div class="qhc-title">地球Online · 每日任務</div>
        <div class="qhc-date">${tasks.date}</div>
        <div class="qhc-progress">
          主線 ${mainDone}/${tasks.main.length}
          ${tasks.side.length ? ` · 支線 ${sideDone}/${tasks.side.length}` : ''}
          ${allDone ? ' · ✦ 全部完成！' : ''}
        </div>
      </div>
      <div class="quest-section">
        <div class="quest-section-label">${icon('zap', 13)} 主線任務</div>
        ${(td.mainTasks || tasks.main).map((t, i) => { const rw = _getTaskReward(td,'main',i); return `
          <div class="quest-item ${td.main[i] ? 'done' : ''}">
            <div class="qi-check" onclick="toggleQuest('main',${i})">${td.main[i] ? icon('check-circle', 18) : icon('circle-dot', 18)}</div>
            <div class="qi-text" onclick="toggleQuest('main',${i})">${t}</div>
            <div class="qi-rewards"><span class="qi-xp">+${rw.xp} XP</span><span class="qi-gold">+${rw.gold} G</span></div>
            <div class="ct-actions"><button class="ct-action-btn" onclick="openEditDailyTaskModal('main',${i})">${icon('pen-left', 13)}</button></div>
          </div>`;}).join('')}
      </div>
      ${tasks.side.length ? `
      <div class="quest-section">
        <div class="quest-section-label">${icon('star', 13)} 支線任務</div>
        ${(td.sideTasks || tasks.side).map((t, i) => { const rw = _getTaskReward(td,'side',i); return `
          <div class="quest-item ${td.side[i] ? 'done' : ''}">
            <div class="qi-check" onclick="toggleQuest('side',${i})">${td.side[i] ? icon('check-circle', 18) : icon('circle-dot', 18)}</div>
            <div class="qi-text" onclick="toggleQuest('side',${i})">${t}</div>
            <div class="qi-rewards"><span class="qi-xp">+${rw.xp} XP</span><span class="qi-gold">+${rw.gold} G</span></div>
            <div class="ct-actions"><button class="ct-action-btn" onclick="openEditDailyTaskModal('side',${i})">${icon('pen-left', 13)}</button></div>
          </div>`;}).join('')}
      </div>` : ''}`;
  }

  // ── Custom tasks section ──
  const customHtml = `
    <div class="quest-section">
      <div class="quest-section-header">
        <div class="quest-section-label">${icon('star', 13)} 自訂任務</div>
        <button class="ct-add-btn" onclick="openCustomTaskModal()">＋ 新增</button>
      </div>
      ${ctasks.length ? ctasks.map(t => `
        <div class="quest-item ct-item ${customDone[t.id] ? 'done' : ''}">
          <div class="qi-check" onclick="toggleCustomTask('${t.id}')">
            ${customDone[t.id] ? icon('check-circle', 18) : icon('circle-dot', 18)}
          </div>
          <div class="qi-text" onclick="toggleCustomTask('${t.id}')">${t.name}</div>
          <div class="qi-rewards">
            <span class="qi-xp">+${t.xp} XP</span>
            <span class="qi-gold">+${t.gold} G</span>
          </div>
          <div class="ct-actions">
            <button class="ct-action-btn" onclick="openCustomTaskModal('${t.id}')" title="編輯">${icon('pen-left', 13)}</button>
            <button class="ct-action-btn" onclick="deleteCustomTask('${t.id}')" title="刪除">${icon('trash-2', 13)}</button>
          </div>
        </div>`).join('') : `<div class="ct-empty">輕點「＋ 新增」建立自訂任務</div>`}
    </div>
    <div style="height:16px"></div>`;

  el.innerHTML = dailyHtml + customHtml;
  renderQuestHistoryFooter();
}

function _buildHistoryContent() {
  const done = getData('dailyQuestsDone', {});
  const today = todayStr();
  const pastDates = Object.keys(done).filter(d => d !== today).sort().reverse();
  if (!pastDates.length) return `<div class="qh-empty">還沒有過往紀錄</div>`;
  return pastDates.map(date => {
    const rec = done[date];
    const mainTasks  = rec.mainTasks || [];
    const sideTasks  = rec.sideTasks || [];
    const mainDone   = (rec.main  || []).filter(Boolean).length;
    const sideDone   = (rec.side  || []).filter(Boolean).length;
    const customEntries = Object.entries(rec.customDone || {});
    const customDoneCount = customEntries.filter(([,v]) => v).length;
    const total     = mainTasks.length + sideTasks.length + customEntries.length;
    const completed = mainDone + sideDone + customDoneCount;
    const allClear  = total > 0 && completed === total;
    const [,m,d] = date.split('-');
    const allTasks = [
      ...mainTasks.map((t, i)  => ({ t, done: (rec.main||[])[i], cls: '' })),
      ...sideTasks.map((t, i)  => ({ t, done: (rec.side||[])[i], cls: 'side' })),
      ...customEntries.map(([id, isDone]) => {
        const ct = getCustomTasks().find(x => x.id === id);
        return { t: ct ? ct.name : '（已移除）', done: isDone, cls: 'custom' };
      }),
    ];
    return `
      <div class="qh-entry">
        <div class="qh-entry-header">
          <span class="qh-date">${m}/${d}</span>
          <span class="qh-badge ${allClear ? 'clear' : ''}">${completed}/${total} 完成</span>
        </div>
        <div class="qh-tasks">
          ${allTasks.length
            ? allTasks.map(({t, done: isDone, cls}) => `
                <div class="qh-task ${cls} ${isDone ? 'done' : ''}">
                  ${isDone ? icon('check-circle', 13) : icon('circle-dot', 13)}<span>${t}</span>
                </div>`).join('')
            : `<div style="font-size:.75rem;color:var(--text-3)">（無任務記錄）</div>`}
        </div>
      </div>`;
  }).join('');
}

function renderQuestHistoryFooter() {
  const el = document.getElementById('quest-history-footer');
  if (!el) return;
  const done = getData('dailyQuestsDone', {});
  const pastCount = Object.keys(done).filter(d => d !== todayStr()).length;
  const archive = getData('earthArchive', []);
  el.innerHTML = `
    <button class="qh-toggle-btn" onclick="openQuestHistoryModal()">
      ${icon('list', 14)}
      過往任務紀錄${pastCount ? `（${pastCount} 天）` : ''}
      ${icon('chevron-right', 14)}
    </button>
    <button class="qh-toggle-btn" onclick="openEarthArchiveModal()">
      ${icon('database', 14)}
      地球Online 任務庫${archive.length ? `（${archive.length} 條）` : ''}
      ${icon('chevron-right', 14)}
    </button>`;
}

function openQuestHistoryModal() {
  document.getElementById('quest-history-body').innerHTML = _buildHistoryContent();
  openModal('modal-quest-history');
}

function openEarthArchiveModal() {
  const archive = getData('earthArchive', []).slice().reverse();
  document.getElementById('earth-archive-body').innerHTML = !archive.length
    ? `<div class="qh-empty" style="padding:40px 0">任務庫為空，每天自動累積來自 @earthonlinequest 的任務</div>`
    : archive.map(e => `
        <div class="earth-archive-item">
          <span class="ea-badge ${e.type}">${e.type === 'main' ? '主線' : '支線'}</span>
          <span class="ea-task">${e.task}</span>
          <span class="ea-date">${e.firstSeen}</span>
        </div>`).join('');
  openModal('modal-earth-archive');
}


async function toggleQuest(type, index) {
  const tasks = await fetchDailyTasks();
  if (!tasks) return;

  const today = todayStr();
  const done = getData('dailyQuestsDone', {});
  if (!done[today]) {
    done[today] = {
      main: tasks.main.map(() => false), side: tasks.side.map(() => false),
      mainTasks: [...tasks.main], sideTasks: [...tasks.side],
      mainBonusGranted: false, allBonusGranted: false,
    };
  }
  if (!done[today].mainTasks) { done[today].mainTasks = [...tasks.main]; done[today].sideTasks = [...tasks.side]; }

  const td = done[today];
  const wasChecked = td[type][index];
  td[type][index] = !wasChecked;

  const gd = getGameData();
  const prevLevel = gd.level;

  const reward = _getTaskReward(td, type, index);
  if (!wasChecked) {
    _grantXP(gd, reward.xp);
    _grantGold(gd, reward.gold);
    if (!td.mainBonusGranted && tasks.main.length > 0 && td.main.every(Boolean)) {
      _grantXP(gd, 30); _grantGold(gd, 15); td.mainBonusGranted = true;
    }
    if (!td.allBonusGranted && tasks.main.length > 0 && td.main.every(Boolean) && td.side.every(Boolean)) {
      _grantXP(gd, 20); _grantGold(gd, 10); td.allBonusGranted = true;
    }
    setData('dailyQuestsDone', done);
    const newAch = _runAchievementChecks(gd);
    setData('gamification', gd);
    _showRewards(prevLevel, gd.level, newAch);
  } else {
    _deductXP(gd, reward.xp);
    _deductGold(gd, reward.gold);
    if (td.mainBonusGranted && !td.main.every(Boolean)) {
      _deductXP(gd, 30); _deductGold(gd, 15); td.mainBonusGranted = false;
    }
    if (td.allBonusGranted && (!td.main.every(Boolean) || !td.side.every(Boolean))) {
      _deductXP(gd, 20); _deductGold(gd, 10); td.allBonusGranted = false;
    }
    setData('dailyQuestsDone', done);
    setData('gamification', gd);
  }
  renderQuests();
}

function parseFloatOrNull(id) {
  const v = parseFloat(document.getElementById(id)?.value);
  return isNaN(v) ? null : v;
}

// ================================================================
//  GAMIFICATION ENGINE
// ================================================================

function getGameData() {
  const gd = getData('gamification', {
    xp: 0, level: 1, achievements: [], titles: ['旅人'], activeTitle: '旅人', gold: 0,
  });
  if (gd.gold === undefined) gd.gold = 0;
  return gd;
}

function _calcLevel(xp) {
  let lvl = 1;
  for (const e of LEVEL_TABLE) {
    if (xp >= e.xp) lvl = e.level; else break;
  }
  return lvl;
}

function _grantXP(gd, amount) {
  gd.xp = (gd.xp || 0) + amount;
  gd.level = _calcLevel(gd.xp);
}
function _grantGold(gd, amount) { gd.gold = (gd.gold || 0) + amount; }
function _deductXP(gd, amount) {
  gd.xp = Math.max(0, (gd.xp || 0) - amount);
  gd.level = _calcLevel(gd.xp);
}
function _deductGold(gd, amount) { gd.gold = Math.max(0, (gd.gold || 0) - amount); }

function _tryUnlock(gd, id) {
  if (!gd.achievements) gd.achievements = [];
  if (gd.achievements.includes(id)) return false;
  gd.achievements.push(id);
  if (!gd.achievementDates) gd.achievementDates = {};
  gd.achievementDates[id] = todayStr();
  const td = TITLES_DEF.find(t => t.unlock === id);
  if (td && !gd.titles.includes(td.id)) gd.titles.push(td.id);
  return true;
}

function _calcDiaryStreak(diary) {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i <= 365; i++) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    if ((diary[dateStr(d)] || []).length > 0) streak++;
    else break;
  }
  return streak;
}

function _calcWorkoutStreak(wLog) {
  const days = new Set(wLog.map(e => e.date));
  let streak = 0;
  for (let i = 0; i <= 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    if (days.has(dateStr(d))) streak++;
    else break;
  }
  return streak;
}

function _runAchievementChecks(gd) {
  const diary   = getData('diary', {});
  const wLog    = getData('workoutLog', []);
  const today   = todayStr();
  const profile = getData('profile', {});
  const goals   = profile.goals || defaultGoals();
  const newAch  = [];

  function tryU(id) {
    if (_tryUnlock(gd, id)) { newAch.push(id); _grantXP(gd, 50); }
  }

  // RECIPE
  const recipes = getData('recipes', []);
  if (recipes.length >= 1)  tryU('recipe_first');
  if (recipes.length >= 10) tryU('recipe_10');
  if (recipes.length >= 30) tryU('recipe_30');
  if (recipes.some(r => r.image)) tryU('recipe_with_img');

  // FOOD
  const allEntries = Object.values(diary).flat();
  const diaryDays  = Object.keys(diary).filter(ds => (diary[ds] || []).length > 0);
  if (allEntries.length >= 1)    tryU('first_meal');
  if (diaryDays.length >= 10)    tryU('meal_10');
  if (diaryDays.length >= 30)    tryU('meal_30');
  if (diaryDays.length >= 50)    tryU('diary_50');
  if (diaryDays.length >= 100)   tryU('diary_100');
  if (diaryDays.length >= 365)   tryU('diary_365');

  const todayMeals = new Set((diary[today] || []).map(e => e.meal));
  if (['早餐','午餐','晚餐'].every(m => todayMeals.has(m)))          tryU('triple_crown');
  if (['早餐','午餐','晚餐','點心'].every(m => todayMeals.has(m)))   tryU('all_4_meals');

  const uniqueFoods = new Set(allEntries.map(e => e.name)).size;
  if (uniqueFoods >= 5)  tryU('variety_5');
  if (uniqueFoods >= 15) tryU('variety_15');
  if (uniqueFoods >= 30) tryU('variety_30');

  // FOOD INGREDIENT counts
  function countFoodKw(group) {
    const kws = FOOD_KEYWORD_GROUPS[group];
    return allEntries.filter(e => kws.some(kw => (e.name || '').includes(kw))).length;
  }
  const chickenN = countFoodKw('chicken');
  if (chickenN >= 30)  tryU('chicken_30');
  if (chickenN >= 100) tryU('chicken_100');
  const beefN = countFoodKw('beef');
  if (beefN >= 30) tryU('beef_30');
  if (beefN >= 80) tryU('beef_80');
  const porkN = countFoodKw('pork');
  if (porkN >= 30) tryU('pork_30');
  if (porkN >= 80) tryU('pork_80');
  const eggN = countFoodKw('egg');
  if (eggN >= 50)  tryU('egg_50');
  if (eggN >= 150) tryU('egg_150');
  const fishN = countFoodKw('fish');
  if (fishN >= 30)  tryU('fish_30');
  if (fishN >= 100) tryU('fish_100');
  if (countFoodKw('broccoli')     >= 30) tryU('broccoli_30');
  if (countFoodKw('sweet_potato') >= 30) tryU('sweet_potato_30');
  if (countFoodKw('tofu')         >= 30) tryU('tofu_30');
  if (countFoodKw('avocado')      >= 20) tryU('avocado_20');
  if (countFoodKw('oat')          >= 60) tryU('oat_60');

  if (today.slice(5) === '01-01' && allEntries.length > 0) tryU('new_year');
  if (allEntries.some(e => e.loggedAt && (new Date(e.loggedAt).getHours() >= 23 || new Date(e.loggedAt).getHours() < 2))) tryU('night_owl');
  if (allEntries.some(e => e.loggedAt && new Date(e.loggedAt).getHours() < 6)) tryU('early_bird');

  if (goals.calories > 0) {
    const tot = getDailyTotals(today);
    const pct = tot.calories / goals.calories;
    if (tot.calories > 0 && pct >= 0.9 && pct <= 1.1) tryU('goal_hit');
    let gs = 0, gm = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const t = getDailyTotals(dateStr(d));
      const p = t.calories / goals.calories;
      if (t.calories > 0 && p >= 0.9 && p <= 1.1) { gs++; gm++; }
      else break;
    }
    if (gs >= 7)  tryU('goal_week');
    if (gm >= 30) tryU('goal_month');
  }

  if (goals.protein > 0) {
    let ps = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const t = getDailyTotals(dateStr(d));
      if (t.protein > 0 && t.protein >= goals.protein) ps++;
      else break;
    }
    if (ps >= 7) tryU('protein_7');
  }

  // WORKOUT
  const cardioN   = wLog.filter(e => e.type === 'cardio').length;
  const strengthN = wLog.filter(e => e.type === 'strength').length;
  if (wLog.length >= 1)    tryU('first_workout');
  if (cardioN >= 10)       tryU('cardio_10');
  if (cardioN >= 30)       tryU('cardio_30');
  if (strengthN >= 10)     tryU('strength_10');
  if (strengthN >= 30)     tryU('strength_30');
  if (wLog.length >= 30)   tryU('workout_30_total');
  if (wLog.length >= 100)  tryU('workout_100_total');

  const wByDate = {};
  wLog.forEach(e => { if (!wByDate[e.date]) wByDate[e.date] = new Set(); wByDate[e.date].add(e.type); });
  if (Object.values(wByDate).some(s => s.has('cardio') && s.has('strength'))) tryU('both_same_day');
  const wStreak = _calcWorkoutStreak(wLog);
  if (wStreak >= 7)  tryU('workout_streak_7');
  if (wStreak >= 30) tryU('workout_streak_30');

  // weekend_warrior: worked out on 8 different weekends
  const weekendWorkoutWeeks = new Set(wLog.filter(e => {
    const [y, m, d] = e.date.split('-').map(Number);
    const day = new Date(y, m - 1, d).getDay();
    return day === 0 || day === 6;
  }).map(e => {
    const [y, m, d] = e.date.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() - dt.getDay());
    return dateStr(dt);
  }));
  if (weekendWorkoutWeeks.size >= 8) tryU('weekend_warrior');

  // STREAK
  const dStreak = _calcDiaryStreak(diary);
  if (dStreak >= 3)   tryU('streak_3');
  if (dStreak >= 7)   tryU('streak_7');
  if (dStreak >= 14)  tryU('streak_14');
  if (dStreak >= 30)  tryU('streak_30');
  if (dStreak >= 100) tryU('streak_100');
  if (dStreak >= 200) tryU('streak_200');
  if (dStreak >= 365) tryU('streak_365');

  // COMEBACK: streak >= 3 but had a gap >= 7 days before it
  if (dStreak >= 3) {
    let gap = 0;
    for (let i = dStreak + 1; i <= dStreak + 60; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      if ((diary[dateStr(d)] || []).length > 0) break;
      gap++;
    }
    if (gap >= 7)  tryU('comeback');
    if (gap >= 30) tryU('comeback_epic');
  }

  if (gd.level >= 3)  tryU('level_3');
  if (gd.level >= 5)  tryU('level_5');
  if (gd.level >= 10) tryU('level_10');
  if (gd.level >= 15) tryU('max_level');

  const gold = gd.gold || 0;
  if (gold >= 500)   tryU('gold_500');
  if (gold >= 2000)  tryU('gold_2000');
  if (gold >= 5000)  tryU('gold_5000');
  if (gold >= 10000) tryU('gold_10000');
  if (gold >= 50000) tryU('gold_50000');

  // QUEST
  const qDone = getData('dailyQuestsDone', {});
  const allQDates = Object.keys(qDone);
  if (allQDates.some(d => qDone[d].main?.some(Boolean) || qDone[d].side?.some(Boolean))) tryU('quest_first');
  if (allQDates.some(d => qDone[d].main?.length > 0 && qDone[d].main.every(Boolean))) tryU('quest_main_done');
  if (allQDates.some(d => qDone[d].main?.every(Boolean) && qDone[d].side?.every(Boolean))) tryU('quest_all_done');

  const q100Days = allQDates.filter(d => qDone[d].main?.length > 0 && qDone[d].main.every(Boolean)).length;
  if (q100Days >= 100) tryU('quest_100');

  let qStreak = 0;
  for (let i = 0; i <= 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    const rec = qDone[ds];
    if (rec && rec.main?.length > 0 && rec.main.every(Boolean)) qStreak++;
    else break;
  }
  if (qStreak >= 7)  tryU('quest_week');
  if (qStreak >= 30) tryU('quest_month');

  // perfect_day: 4 meals + all quests + workout on same day
  Object.keys(diary).forEach(ds => {
    const meals = new Set((diary[ds] || []).map(e => e.meal));
    if (!['早餐','午餐','晚餐','點心'].every(m => meals.has(m))) return;
    const rec = qDone[ds];
    if (!rec || !rec.main?.every(Boolean) || !rec.side?.every(Boolean)) return;
    if (wLog.some(e => e.date === ds)) tryU('perfect_day');
  });

  // COMBO
  const wDates = new Set(wLog.map(e => e.date));
  // goal_workout_same: any day with calorie goal hit AND workout
  if (goals.calories > 0) {
    const goalHit = diaryDays.some(ds => {
      const t = getDailyTotals(ds);
      const p = t.calories / goals.calories;
      return t.calories > 0 && p >= 0.9 && p <= 1.1 && wDates.has(ds);
    });
    if (goalHit) tryU('goal_workout_same');
    // goal_workout_7: 7 consecutive days both goal hit AND workout
    let gw7 = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const ds = dateStr(d);
      const t = getDailyTotals(ds);
      const p = t.calories / goals.calories;
      if (t.calories > 0 && p >= 0.9 && p <= 1.1 && wDates.has(ds)) gw7++;
      else break;
    }
    if (gw7 >= 7) tryU('goal_workout_7');
  }
  // diet_workout_7/30: consecutive days with diary AND workout
  let dwStreak = 0;
  for (let i = 0; i <= 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    if ((diary[ds] || []).length > 0 && wDates.has(ds)) dwStreak++;
    else break;
  }
  if (dwStreak >= 7)  tryU('diet_workout_7');
  if (dwStreak >= 30) tryU('diet_workout_30');
  // variety_workout_combo: food variety >= 20 AND workout >= 50
  if (uniqueFoods >= 20 && wLog.length >= 50) tryU('variety_workout_combo');
  // streak_habit_combo: diary streak >= 30 AND any habit streak >= 30
  if (dStreak >= 30) {
    const allHabits = getData('habits', []);
    const mhs = allHabits.reduce((mx, h) => Math.max(mx, calcHabitStreak(h)), 0);
    if (mhs >= 30) tryU('streak_habit_combo');
  }
  // quest_diary_7: 7 consecutive days with all main quests done AND diary entry
  let qdStreak = 0;
  for (let i = 0; i <= 365; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    const rec = qDone[ds];
    if (rec && rec.main?.length > 0 && rec.main.every(Boolean) && (diary[ds] || []).length > 0) qdStreak++;
    else break;
  }
  if (qdStreak >= 7) tryU('quest_diary_7');

  return newAch;
}

function _runHabitAchievementChecks(gd) {
  const newAch = [];
  function tryU(id) {
    if (_tryUnlock(gd, id)) { newAch.push(id); _grantXP(gd, 50); }
  }

  const allHabits = getData('habits', []);
  const habitLog  = getData('habitLog', {});

  const anyDone = Object.values(habitLog).some(d => Object.values(d || {}).some(v => v === 'done'));
  if (anyDone) tryU('habit_first');

  const maxHabitStreak = allHabits.reduce((max, h) => Math.max(max, calcHabitStreak(h)), 0);
  if (maxHabitStreak >= 7)   tryU('habit_streak_7');
  if (maxHabitStreak >= 30)  tryU('habit_streak_30');
  if (maxHabitStreak >= 100) tryU('habit_streak_100');

  function groupStreak(groupKey) {
    const kws = HABIT_KEYWORD_GROUPS[groupKey];
    const matched = allHabits.filter(h => kws.some(kw => h.name.includes(kw)));
    return matched.reduce((max, h) => Math.max(max, calcHabitStreak(h)), 0);
  }

  const readStreak = groupStreak('read');
  if (readStreak >= 7)   tryU('read_7');
  if (readStreak >= 30)  tryU('read_30');
  if (readStreak >= 100) tryU('read_100');

  const waterStreak = groupStreak('water');
  if (waterStreak >= 7)  tryU('water_7');
  if (waterStreak >= 30) tryU('water_30');

  const sugarStreak = groupStreak('no_sugar');
  if (sugarStreak >= 7)   tryU('no_sugar_7');
  if (sugarStreak >= 30)  tryU('no_sugar_30');
  if (sugarStreak >= 100) tryU('no_sugar_100');

  return newAch;
}

// ── Public hooks ──────────────────────────────────────────────────
function onDiaryAdded() {
  const gd = getGameData();
  const prevLevel = gd.level;
  _grantXP(gd, 8);
  const newAch = _runAchievementChecks(gd);
  setData('gamification', gd);
  _showRewards(prevLevel, gd.level, newAch);
}

function onWorkoutAdded() {
  const gd = getGameData();
  const prevLevel = gd.level;
  _grantXP(gd, 15);
  const newAch = _runAchievementChecks(gd);
  setData('gamification', gd);
  _showRewards(prevLevel, gd.level, newAch);
}

function onHabitLogged() {
  const gd = getGameData();
  const prevLevel = gd.level;
  _grantXP(gd, 5);
  const newAch = _runHabitAchievementChecks(gd);
  setData('gamification', gd);
  _showRewards(prevLevel, gd.level, newAch);
}

function setActiveTitle(title) {
  const gd = getGameData();
  if ((gd.titles || []).includes(title)) {
    gd.activeTitle = title;
    setData('gamification', gd);
    if (state.currentPage === 'profile') renderProfile();
    if (state.currentPage === 'achievements') renderAchievements();
  }
}

function _showRewards(prevLevel, newLevel, newAch) {
  const base = 400;
  if (newLevel > prevLevel) {
    const entry = LEVEL_TABLE.find(e => e.level === newLevel);
    setTimeout(() => showLevelUpToast(newLevel, entry?.name || ''), base);
  }
  const achBase = newLevel > prevLevel ? base + 2600 : base;
  newAch.forEach((id, i) => setTimeout(() => showAchievementToast(id), achBase + i * 3400));
}

// ── Notification toasts ───────────────────────────────────────────
let _achToastTimer;
function showAchievementToast(id) {
  const def = ACHIEVEMENTS_DEF[id];
  if (!def) return;
  const el = document.getElementById('achievement-toast');
  if (!el) return;
  const descText = def.hint || def.desc;
  el.innerHTML = `
    <div class="ach-toast-icon">${icon(def.icon, 22)}</div>
    <div class="ach-toast-body">
      <div class="ach-toast-label">成就解鎖</div>
      <div class="ach-toast-name">${def.name}</div>
      <div class="ach-toast-desc">${descText}</div>
    </div>`;
  el.classList.add('show');
  clearTimeout(_achToastTimer);
  _achToastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

let _lvlToastTimer;
function showLevelUpToast(level, name) {
  const el = document.getElementById('levelup-toast');
  if (!el) return;
  el.innerHTML = `${icon('star', 16)}<span class="lut-lv">Lv.${level}</span><span class="lut-name">${name}</span>`;
  el.classList.add('show');
  clearTimeout(_lvlToastTimer);
  _lvlToastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

// ── Achievement gallery page ──────────────────────────────────────
const _achCollapsed = {};
function toggleAchSection(key) {
  _achCollapsed[key] = !_achCollapsed[key];
  const sec = document.getElementById(`ach-sec-${key}`);
  if (sec) sec.classList.toggle('collapsed', _achCollapsed[key]);
}

function renderAchievements() {
  const q       = (document.getElementById('ach-search-q')?.value || '').trim().toLowerCase();
  const gd      = getGameData();
  const unlocked = new Set(gd.achievements || []);
  const total    = Object.keys(ACHIEVEMENTS_DEF).length;
  const cats = [
    { key:'recipe',    label:'食譜成就' },
    { key:'quest',     label:'每日任務類' },
    { key:'food',      label:'飲食類' },
    { key:'workout',   label:'運動類' },
    { key:'streak',    label:'連續類' },
    { key:'habit',     label:'習慣類' },
    { key:'food_item', label:'食材成就' },
    { key:'combo',     label:'複合成就' },
    { key:'progress',  label:'等級與金幣' },
    { key:'hidden',    label:'隱藏成就' },
  ];

  // Build achievement-id → title lookup
  const titleByAch = {};
  TITLES_DEF.forEach(t => { if (t.unlock !== 'default') titleByAch[t.unlock] = t.id; });

  const gridHtml = cats.map(cat => {
    const items = Object.entries(ACHIEVEMENTS_DEF).filter(([, d]) => {
      if (d.cat !== cat.key) return false;
      if (!q) return true;
      return d.name.toLowerCase().includes(q) || d.desc.toLowerCase().includes(q) || (d.trigger || '').toLowerCase().includes(q);
    });
    if (q && !items.length) return '';
    const catUnlocked = items.filter(([id]) => unlocked.has(id)).length;
    const collapsed = q ? false : (_achCollapsed[cat.key] || false);
    return `
      <div class="ach-section ${collapsed ? 'collapsed' : ''}" id="ach-sec-${cat.key}">
        <div class="ach-section-header" onclick="toggleAchSection('${cat.key}')">
          <div class="ach-section-title">${cat.label}</div>
          <div class="ach-sec-meta">${catUnlocked}/${items.length}</div>
          <div class="ach-sec-chevron">›</div>
        </div>
        <div class="ach-sec-body">
          <div class="ach-grid">
            ${items.map(([id, def]) => {
              const done     = unlocked.has(id);
              const isHidden = cat.key === 'hidden' && !done;
              const titleTag = (!isHidden && titleByAch[id])
                ? `<div class="ach-title-tag">${icon('award', 10)} 稱號：${titleByAch[id]}</div>`
                : '';
              const triggerTag = (!isHidden && def.trigger)
                ? `<div class="ach-trigger-tag">${icon('info', 9)} ${def.trigger}</div>`
                : '';
              const achDateStr = done && (gd.achievementDates || {})[id]
                ? `<div class="ach-date-tag">${icon('calendar', 9)} ${(gd.achievementDates)[id]}</div>`
                : '';
              return `
                <div class="ach-card ${done ? 'done' : 'locked'}">
                  <div class="ach-icon-wrap ${done ? 'done' : ''}">${icon(isHidden ? 'award' : def.icon, 20)}</div>
                  <div class="ach-card-body">
                    <div class="ach-card-name">${isHidden ? '???' : def.name}</div>
                    <div class="ach-card-desc">${isHidden ? (def.hint || '解鎖後揭曉') : def.desc}</div>
                    ${triggerTag}${titleTag}${achDateStr}
                  </div>
                  ${done ? `<div class="ach-done-mark">${icon('star', 11)}</div>` : ''}
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;
  }).join('');

  const titlesHtml = `
    <div class="ach-titles-section">
      <div class="section-heading">目前已取得稱號</div>
      <div class="title-chips-wrap" style="margin-top:10px">
        ${(gd.titles || ['旅人']).map(t => `
          <button class="title-chip ${t === gd.activeTitle ? 'active' : ''}" onclick="setActiveTitle('${t}')">${t}</button>
        `).join('')}
      </div>
    </div>`;

  document.getElementById('achievements-content').innerHTML = `
    <div class="ach-summary-bar">
      ${icon('trophy', 15)} 已解鎖 ${unlocked.size} / ${total}
    </div>
    ${titlesHtml}
    ${gridHtml}
    <div style="height:30px"></div>`;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initStorage();
  applyTheme(getData('appTheme', 'sage'));
  state.currentDate = todayStr();
  renderProfile();
  updateNavBar('profile');
  // Diary swipe — touch + mouse, attached to document so scroll containers don't block it
  document.addEventListener('touchstart', e => { _diarySX = e.touches[0].clientX; _diarySY = e.touches[0].clientY; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (state.currentPage !== 'diary') return;
    const dx = e.changedTouches[0].clientX - _diarySX;
    const dy = e.changedTouches[0].clientY - _diarySY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) changeDiaryDate(dx > 0 ? -1 : 1);
  }, { passive: true });
  document.addEventListener('mousedown', e => { _diarySX = e.clientX; _diarySY = e.clientY; });
  document.addEventListener('mouseup', e => {
    if (state.currentPage !== 'diary') return;
    const dx = e.clientX - _diarySX;
    const dy = e.clientY - _diarySY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) changeDiaryDate(dx > 0 ? -1 : 1);
  });
  // ===== SETTINGS: EXPORT / IMPORT =====
  window.exportAppData = function () {
    const snapshot = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      try { snapshot[k] = JSON.parse(localStorage.getItem(k)); }
      catch { snapshot[k] = localStorage.getItem(k); }
    }
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href = url; a.download = `食譜日誌備份_${date}.json`;
    a.click(); URL.revokeObjectURL(url);
    showToast('資料已匯出');
  };

  window.importAppData = function (input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const data = JSON.parse(e.target.result);
        showConfirm('匯入將覆蓋現有資料（地球Online任務庫會合併保留），確定繼續？', () => {
          Object.entries(data).forEach(([k, v]) => {
            if (k === 'earthArchive') {
              // Merge: keep all unique tasks from both local and backup
              const local = getData('earthArchive', []);
              const imported = Array.isArray(v) ? v : [];
              const merged = [...local];
              imported.forEach(item => {
                if (!merged.find(m => m.task === item.task)) merged.push(item);
              });
              setData('earthArchive', merged);
            } else {
              localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
            }
          });
          showToast('資料已匯入，重新載入中…');
          setTimeout(() => location.reload(), 1200);
        }, '確認匯入');
      } catch {
        showToast('檔案格式錯誤，請選擇正確的備份檔');
      }
      input.value = '';
    };
    reader.readAsText(file);
  };

  // Keyboard: close modals on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay, .bottom-sheet-overlay').forEach(el => {
        if (el.style.display !== 'none') el.style.display = 'none';
      });
      document.body.style.overflow = '';
    }
  });
});
