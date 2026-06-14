# 冒險者食譜典籍 — 完整功能規格書

版本：v9（2026-06-14）  
倉庫：https://github.com/ffffffffrog-glitch/recipe-journal  
線上版：https://ffffffffrog-glitch.github.io/recipe-journal/

---

## 目錄

1. [產品概觀](#1-產品概觀)
2. [技術架構](#2-技術架構)
3. [導覽與頁面結構](#3-導覽與頁面結構)
4. [資料模型（localStorage）](#4-資料模型)
5. [遊戲化系統](#5-遊戲化系統)
6. [主題色系統](#6-主題色系統)
7. [頁面功能規格](#7-頁面功能規格)
8. [PWA 規格](#8-pwa-規格)
9. [匯出 / 匯入](#9-匯出--匯入)
10. [已知限制與設計決策](#10-已知限制與設計決策)

---

## 1. 產品概觀

**冒險者食譜典籍**是一個純前端 PWA，以「奇幻冒險者」為主題包裝健康管理功能。  
核心概念：日常健康行為（飲食記錄、運動、習慣打卡、任務完成）→ 遊戲化獎勵（XP、等級、金幣、成就）。

### 主要功能模組

| 模組 | 說明 |
|---|---|
| 食譜典籍 | 建立、搜尋、查看個人食譜；含照片、食材、步驟、自動算熱量 |
| 食材庫 | 管理食材資料庫（名稱、每100g營養素、份量單位） |
| 飲食日誌 | 每日飲食記錄（早/午/晚/點心），支援從食材庫、食譜、手動輸入 |
| 每日任務 | 主線+支線每日任務，可從「地球 Online」API 拉取，可自訂 |
| 運動日記 | 有氧/無氧運動紀錄，聊天泡泡式 UI |
| 習慣追蹤 | 自訂習慣、頻率設定、連續天數計算、年曆熱力圖 |
| 個人主頁 | 等級、XP、金幣、體態進度、飲食目標達成度 |
| 體組成記錄 | 體重/體脂/骨骼肌/BMI 時間軸，含 7 日均重計算 |
| 成就館 | 93 個成就分 10 類，帶搜尋、收合、稱號系統 |
| 設定 | 主題色選擇、資料匯出/匯入 |

---

## 2. 技術架構

### 語言與框架

- **純 HTML/CSS/JavaScript**，無任何前端框架（React、Vue 等）
- **無建置步驟**：直接開啟 `index.html` 即可運作
- 單一 HTML 頁面（SPA）；所有「頁面」都是 `<section>` 透過 CSS class 切換顯示

### 檔案結構

```
index.html       主 HTML（所有頁面 DOM、模組、底部 Nav）
app.js           所有邏輯（v9，約 5300 行）
style.css        全部樣式（約 2400 行）
data.js          預設食材資料庫（DEFAULT_FOOD_DB）
sw.js            Service Worker（快取版本 v4）
manifest.json    PWA Manifest
icons/
  icon-180.png   Apple Touch Icon
  icon-192.png   PWA icon（any）
  icon-512.png   PWA icon（any maskable）
```

### 資料儲存

- 全部使用 **`window.localStorage`**
- `getData(key, default)` / `setData(key, value)` 包裝 JSON.parse / JSON.stringify
- **無儲存上限設計**：localStorage 由瀏覽器管理（通常 5–10MB），超出才報錯
- 資料可透過設定頁面完整匯出/匯入 JSON 備份

### SVG 圖示

- 全部使用內嵌 Inline SVG（Lucide icon 集），以 `icon(name, size)` 函式產生
- 共 33 個圖示 key（activity、apple、bell … zap）

---

## 3. 導覽與頁面結構

### 頁面順序（決定換頁動畫方向）

```javascript
PAGE_ORDER = [
  'recipes', 'fooddb', 'diary', 'quests', 'workout',
  'habits', 'habit-detail', 'profile', 'settings', 'achievements', 'inbody'
]
```

換頁動畫：index 較大的頁面從右側進入（forward），較小的從左側進入（backward）。  
加上 glare sweep 光暈特效（520ms CSS animation）。

### 子頁面對應關係

```javascript
SUB_PAGE_PARENT = {
  fooddb:        'recipes',   // 食材庫屬於食譜 tab
  inbody:        'profile',   // 體組成屬於個人 tab
  'habit-detail':'habits',    // 習慣詳情屬於習慣 tab
  achievements:  'profile',   // 成就館屬於個人 tab
  settings:      'profile',   // 設定屬於個人 tab
}
```

子頁面在 Nav Bar 上高亮其父 tab。

### 底部 Nav Bar（6 個 tab）

| Tab | 頁面 ID | 中文 |
|---|---|---|
| 食譜 | recipes | 食譜典籍 |
| 日誌 | diary | 飲食日誌 |
| 任務 | quests | 每日任務 |
| 運動 | workout | 運動日記 |
| 習慣 | habits | 習慣追蹤 |
| 個人 | profile | 個人主頁 |

**預設啟動頁面**：`profile`（個人主頁）

Nav Bar 底部留有 `env(safe-area-inset-bottom)` iOS 安全區域 padding。

---

## 4. 資料模型

所有資料存於 localStorage，key 如下：

### `foodDB` — 食材資料庫

```typescript
Array<{
  id: string;           // 'f' + timestamp36 + random3
  name: string;
  category?: string;    // '蛋白質'|'蔬菜'|'水果'|'澱粉'|'油脂'|'其他'
  state?: string;       // '生食'|'熟食'|'加工品'|'飲品'|'一般'
  per100g: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
  };
  serving?: {           // 可選：份量單位換算
    unit: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
  };
  createdAt?: string;   // 'YYYY-MM-DD'
}>
```

預設值：`DEFAULT_FOOD_DB`（data.js，含常見台灣食材）

### `recipes` — 食譜

```typescript
Array<{
  id: string;           // 'r' + timestamp36 + random3
  name: string;
  time: number;         // 烹飪時間（分鐘）
  notes: string;        // 備註
  image: string | '';   // Base64 JPEG 圖片（640×480，4:3裁切）
  ingredients: Array<{
    foodId: string;
    name: string;
    amount: number;
    unit: string;       // 'g'|'ml'|'份'|'茶匙'|'大匙'|'個'|'片'|'條'|'顆'
    grams: number;      // 換算後克數（非 g 單位時為 0）
    nutrition: { calories, protein, fat, carbs, fiber };
  }>;
  steps: string[];
  nutrition: {          // 自動加總食材營養
    calories, protein, fat, carbs, fiber
  };
}>
```

### `diary` — 飲食日誌

```typescript
{
  [dateString: string]: Array<{   // key = 'YYYY-MM-DD'
    id: string;
    meal: '早餐'|'午餐'|'晚餐'|'點心';
    name: string;
    amount: string;               // 顯示用文字，如 '150g'
    source: 'fooddb'|'recipe'|'manual';
    nutrition: { calories, protein, fat, carbs, fiber };
    loggedAt: string;             // ISO timestamp
  }>
}
```

### `profile` — 個人資料

```typescript
{
  name: string;         // 預設 '冒險者'
  bio?: string;
  goals: {
    calories: number;   // 預設 2000
    protein: number;    // 預設 120
    fat: number;        // 預設 65
    carbs: number;      // 預設 250
    fiber: number;      // 預設 25
  };
}
```

### `gamification` — 遊戲化資料

```typescript
{
  xp: number;
  level: number;           // 1–15
  gold: number;
  achievements: string[];  // 已解鎖的成就 ID 陣列
  titles: string[];        // 已解鎖的稱號陣列
  activeTitle: string;     // 目前使用中的稱號
}
```

### `dailyQuestsDone` — 每日任務紀錄

```typescript
{
  [dateString: string]: {
    main: boolean[];           // 主線任務完成狀態
    side: boolean[];           // 支線任務完成狀態
    mainTasks: string[];       // 當日主線任務文字（快照）
    sideTasks: string[];       // 當日支線任務文字（快照）
    mainBonusGranted: boolean; // 主線全完成獎勵是否已發
    allBonusGranted: boolean;  // 全任務完成獎勵是否已發
    mainRewards?: Array<{xp, gold}>;  // 自訂獎勵
    sideRewards?: Array<{xp, gold}>;
    customDone?: { [taskId: string]: boolean };  // 自訂任務完成狀態
  }
}
```

### `workoutLog` — 運動日記

```typescript
Array<{
  id: string;
  date: string;                 // 'YYYY-MM-DD'
  type: 'cardio'|'strength';
  name: string;                 // 運動名稱
  duration?: number;            // 有氧：時長（分鐘）
  distance?: number;            // 有氧：距離（km）
  calories?: number;            // 有氧：消耗熱量
  blocks?: Array<{              // 無氧：組別清單
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }>;
  note?: string;
  createdAt: string;            // ISO timestamp
}>
```

### `habits` — 習慣設定

```typescript
Array<{
  id: string;
  name: string;
  color: string;                // hex color
  icon?: string;
  freq: {
    type: 'daily'|'weekdays'|'custom';
    days?: number[];            // custom: [0-6]（週日=0）
  };
  createdAt: string;
  archived?: boolean;
}>
```

### `habitLog` — 習慣打卡紀錄

```typescript
{
  [habitId: string]: {
    [dateString: string]: boolean
  }
}
```

### `inbody` — 體組成記錄

```typescript
Array<{
  id: string;
  date: string;                 // 'YYYY-MM-DD'
  weight?: number;              // kg
  fat?: number;                 // 體脂 %
  muscle?: number;              // 骨骼肌 kg
  bmi?: number;
  note?: string;
}>
```

### `weightLog` — 每日體重快速記錄

```typescript
{
  [dateString: string]: number  // kg
}
```

### `avatarData` — 大頭貼

```typescript
string | null  // Base64 JPEG（200×200）
```

### `earthArchive` — 地球 Online 任務庫

```typescript
Array<{
  task: string;      // 任務名稱（唯一鍵，合併時以此去重）
  xp: number;
  gold: number;
}>
```

### `cachedTasks` — 任務 API 快取

```typescript
{
  ts: number;        // Unix timestamp（ms）
  data: any;         // GitHub API 回應
} | null
```

### `customTasks` — 自訂每日任務

```typescript
Array<{
  id: string;        // 'ct_' + timestamp
  name: string;
  xp: number;
  gold: number;
}>
```

### `appTheme` — 主題設定

```typescript
string  // 'sage'|'ocean'|'rose'|'amber'|'teal'|'lavender'（預設 'sage'）
```

---

## 5. 遊戲化系統

### 等級表（15 級）

| 等級 | 稱呼 | 累計 XP |
|---|---|---|
| 1 | 旅人 | 0 |
| 2 | 廚房學徒 | 100 |
| 3 | 食材採集者 | 250 |
| 4 | 行腳廚師 | 500 |
| 5 | 健康冒險者 | 900 |
| 6 | 鍛鍊勇士 | 1,400 |
| 7 | 飲食騎士 | 2,100 |
| 8 | 精英戰士 | 3,000 |
| 9 | 體能賢者 | 4,200 |
| 10 | 傳說廚師 | 6,000 |
| 11 | 不滅勇者 | 8,500 |
| 12 | 奧義探求者 | 12,000 |
| 13 | 健康守護者 | 17,000 |
| 14 | 龍的傳人 | 24,000 |
| 15 | 奇幻大師 | 34,000 |

### XP 獲取來源

| 行為 | XP |
|---|---|
| 新增飲食記錄 | +8 |
| 新增運動記錄 | +15 |
| 習慣打卡 | +5 |
| 完成主線任務（各別） | +20（可自訂） |
| 完成支線任務（各別） | +15（可自訂） |
| 當日主線全完成獎勵 | +30 |
| 當日全任務（主線+支線）全完成 | +20 |
| 完成自訂任務 | 自訂 |

取消行為扣回對應 XP（不低於 0）。等級只升不降。

### 金幣獲取

| 行為 | 金幣 |
|---|---|
| 主線任務 | +10（可自訂） |
| 支線任務 | +8（可自訂） |
| 主線全完成獎勵 | +15 |
| 全任務完成獎勵 | +10 |
| 自訂任務 | 自訂 |

### 成就系統（共 93 個）

成就分 10 類：

| 分類 key | 中文 | 數量 |
|---|---|---|
| recipe | 食譜成就 | 4 |
| quest | 每日任務類 | 6 |
| food | 飲食類 | 10 |
| workout | 運動類 | 10 |
| streak | 連續類 | 7 |
| habit | 習慣類 | 12 |
| food_item | 食材成就 | 15 |
| combo | 複合成就 | 7 |
| progress | 等級與金幣 | 7 |
| hidden | 隱藏成就 | 8 |
| **合計** | | **86** |

> 注意：成就頁顯示「93」是因為 ACHIEVEMENTS_DEF 物件實際 key 數，請以程式碼為準。

#### 各類成就條件摘要

**食譜成就**
- 初心料理人：建立第一道食譜
- 食譜收藏家：食譜達 10 道
- 私房食譜庫：食譜達 30 道
- 用心擺盤：食譜含照片

**飲食類**
- 第一口：記錄第一筆飲食
- 十日糧草 / 月之倉庫 / 勤奮紀錄者 / 百日廚師 / 歲月廚神：有飲食記錄的日子達 10/30/50/100/365 天
- 三餐勇士：同天記錄早午晚
- 精準打擊：當日熱量在目標 ±10% 以內
- 均衡使者：連續 7 天達成熱量目標
- 月度達標：連續 30 天達成熱量目標
- 食材探險家 / 百草採集 / 食材圖鑑：日誌中出現 5/15/30 種不同食物

**連續類**：飲食連續記錄 3/7/14/30/100/200/365 天

**運動類**：初次鍛鍊、心肺鬥士（10次有氧）、風馳電掣（30次有氧）、鐵器之魂（10次無氧）、力拔山河（30次無氧）、全能戰士（同天有氧+無氧）、不休勇者（連續7天）、鐵人之志（連續30天）、三十日磨劍（累計30次）、百鍊成鋼（累計100次）

**習慣類**：習慣萌芽（第一次打卡）、有恆之心 / 意志磐石 / 習慣大師（任意習慣連續7/30/100天）；另有閱讀、喝水、戒糖 3 組各 3 個關鍵字觸發成就

**食材成就（15個）**：雞/牛/豬/蛋/魚/花椰菜/地瓜/豆腐/酪梨/燕麥 食材累計記錄達門檻

**隱藏成就（8個）**：年初立志、完整一日（四餐）、浴火重生、傳奇重生、夜梟廚師、晨曦使者、完美一日、蛋白霸主

#### 成就觸發時機

`_runAchievementChecks(gd)` 在以下行為後呼叫：
- 新增飲食記錄（`onDiaryAdded`）
- 新增運動記錄（`onWorkoutAdded`）
- 習慣打卡（`onHabitLogged`）
- 儲存食譜（`saveRecipeForm`）
- 切換任務完成狀態（`toggleQuest`、`toggleCustomTask`）

成就一旦解鎖永不撤銷（即使觸發條件不再成立）。

#### 解鎖通知 Toast

- **等級提升**：頂部水平居中，顯示新等級數字+稱呼，持續 2.8 秒
- **新成就**：左下角，sage 綠底白字，顯示圖示+成就名稱+描述，持續 3 秒
- 多個成就依序顯示，間隔 3.4 秒

### 稱號系統

- 解鎖特定成就後自動取得對應稱號
- 在個人主頁可選擇要顯示的稱號
- 預設稱號「旅人」始終持有

---

## 6. 主題色系統

設定頁面→外觀，提供 6 個主題色。選擇後：
1. 存入 `localStorage['appTheme']`
2. 呼叫 `applyTheme(id)` 設定 CSS 自訂變數於 `document.documentElement.style`
3. 下次開啟自動套用（DOMContentLoaded 讀取）

### 覆寫的 CSS 變數

```
--sage        主色（按鈕、導覽列 active、XP 進度條等）
--sage-mid    中間色
--sage-light  淺色
--sage-pale   極淡底色（成就圖示背景、選中狀態）
--sage-faint  幾乎白（輕微底色）
--sage-muted  邊框色
--gold-dark   = --sage（向下相容）
--gold-light  = --sage-mid（向下相容）
```

### 6 個主題

| ID | 名稱 | 主色 |
|---|---|---|
| sage | 鼠尾草綠 | #4D6A55 |
| ocean | 深海藍 | #2E6B9E |
| rose | 玫瑰粉 | #9E4E6B |
| amber | 琥珀金 | #8A6520 |
| teal | 湖水青 | #2A7A7A |
| lavender | 薰衣草紫 | #5D4A8A |

---

## 7. 頁面功能規格

### 7.1 食譜（recipes）

**列表頁**
- 搜尋框固定於頂部，即時 filter（搜尋名稱、備註、食材名稱、步驟文字）
- 食譜卡顯示：縮圖/佔位圖、名稱、時間（分鐘）、熱量（kcal）
- 右下角 FAB 開啟新增表單
- 點擊卡片開啟食譜詳情 Modal

**食譜表單（新增/編輯）**
- 欄位：食譜圖片（4:3裁切，存為 640×480 Base64 JPEG）、名稱、烹飪時間
- 食材清單：
  - 控制列：「－」（刪除最後一列）、「＋」（新增空白列）、「新建食材」按鈕
  - 每列：食材名稱（可搜尋現有食材庫，自動補完）、份量數字、單位（g/ml/份/茶匙/大匙/個/片/條/顆）、自動計算熱量顯示、✕ 刪除按鈕
  - 「新建食材」按鈕開啟居中小 Modal，可填食材名稱、份量、每100g營養素，建立並自動套用至空白列
- 合計營養素區塊（自動加總）
- 料理步驟：「－」「＋」控制步驟數，每步驟為 textarea
- 備註欄
- 頂部「儲存」按鈕呼叫 `saveRecipeForm()`

**食譜詳情 Modal**
- 顯示：圖片/佔位、烹飪時間、熱量、蛋白質、完整營養卡、食材清單（含kcal）、步驟（有序列表）、備註
- 右上角鉛筆按鈕→開啟編輯表單
- 底部「刪除食譜」紅色按鈕（二次確認）

### 7.2 食材庫（fooddb）

- 分類 filter：全部/蛋白質/蔬菜/澱粉/水果/油脂/其他
- 搜尋欄即時過濾名稱
- 食材卡顯示：名稱、類別 badge（生食/熟食/加工品/飲品）、每100g熱量
- 點擊開啟底部 Sheet 表單（新增/編輯）
- 表單欄位：食材名稱、狀態、每100g（熱量/蛋白質/脂肪/碳水/纖維）、份量單位（可選）
- FAB 新增食材
- 子頁面，屬於食譜 tab（Nav Bar 高亮食譜）

### 7.3 飲食日誌（diary）

- 頂部日期顯示（中文格式「YYYY年M月D日（週X）(今日)」）
- 左滑→明天，右滑→昨天（touch + mouse 都支援，dx > 50px 且橫向幅度 > 縱向 1.5x）
- 點擊日期開啟日曆選擇器
- 四個餐別卡片（早餐/午餐/晚餐/點心），各顯示該餐食物列表及小計熱量
- 每筆記錄右滑可刪除（swipe-to-delete，dx > 60px）
- 今日熱量/蛋白質進度條（含達成比例）
- 右下角 FAB 開啟新增 Sheet

**新增飲食 Sheet（三個 tab）**
1. **食材庫**：搜尋→選擇→填份量（g）→自動計算營養→加入
2. **食譜**：選擇食譜→填份量（份，1份=完整食譜）→自動換算
3. **手動輸入**：食物名稱、份量文字、手動填入熱量/蛋白質/脂肪/碳水/纖維

- Sheet 自動偵測當前時間建議餐別（早餐<10時、午餐<14時、晚餐<20時、點心其他）
- 常用食材捷徑列（最近使用的食材）

### 7.4 每日任務（quests）

**任務來源（三種）**
1. **地球 Online API**：從 GitHub raw 檔案拉取今日任務（`api.github.com`，no-store cache），分主線/支線
2. **地球 Online 任務庫**：已抓取的任務本地存檔（`earthArchive`），可隨機分配
3. **自訂任務**（`customTasks`）：使用者自行新增，可設定 XP/金幣

**任務完成機制**
- 每日快照：第一次開啟當日任務時，將 API 任務文字快照進 `dailyQuestsDone[today].mainTasks/sideTasks`
- 勾選→解鎖 XP/金幣，並立即呼叫成就檢查
- 取消勾選→扣回 XP/金幣（等級不降）
- 主線全完成 bonus：+30 XP / +15 金幣
- 全任務全完成 bonus：+20 XP / +10 金幣
- **重要**：`setData('dailyQuestsDone', done)` 必須在 `_runAchievementChecks()` 之前呼叫，否則成就讀到舊狀態

**踏上旅途成就觸發條件**：當天完成至少 1 個主線或支線任務（`td.main.some(Boolean) || td.side.some(Boolean)`）

**任務歷史**：可查看過去每日完成紀錄

**地球 Online 任務庫**：過往任務合併存檔（以 `task` 欄位去重，保留所有唯一任務）

### 7.5 運動日記（workout）

**UI**：聊天泡泡風格
- 右側（紫/主題色）：使用者記錄的運動
- 左側（白）：系統日期標題

**泡泡尾巴（SVG tail）**：右側泡泡使用 inline SVG，fill 使用 `style="fill:var(--sage)"` 跟隨主題色

**新增/編輯表單（底部 Sheet）**
- 類型切換：有氧 / 無氧
- 有氧欄位：運動名稱、時長、距離、消耗熱量、備註；預設運動名稱建議：跑步/走路/騎車/游泳/爬坡/爬山/其他
- 無氧欄位：動作組別（動作名稱+組數+次數+重量），可新增/刪除組別；備註
- 日期欄位（預設今天）

**泡泡最小寬度**：`min-width: calc(5em + 48px)`（保證手機上至少顯示5個中文字）

### 7.6 習慣追蹤（habits）

**習慣卡片**
- 顯示名稱、當前連續天數
- 右側快速打卡格（今天 ± 最近幾天）
- 點擊卡片進入習慣詳情

**習慣設定**
- 名稱、顏色（16 色預設 palette）、圖示、頻率（每天/平日/自訂星期）

**頻率計算**
- `daily`：每天都算
- `weekdays`：週一到週五
- `custom`：指定星期幾（days: [0-6]，週日=0）

**連續天數計算（`calcHabitStreak`）**
- 從今日往回推，找「應打卡的日子」（依頻率），連續打卡幾天

**習慣詳情頁（habit-detail）**
- 年曆熱力圖（12個月格狀）：已打卡=主題色，未打卡=灰色
- 統計數字：當前連續天數、歷史最長連續
- 可在此編輯/刪除習慣

**封存習慣**：已封存習慣不在主列表顯示，可切換顯示/隱藏封存

### 7.7 個人主頁（profile）

- 頂部：大頭貼（可上傳，圓形 200×200 Base64 JPEG）、名稱、稱號（可在成就館切換）
- 等級 Badge（左下）：Lv.N
- XP 進度條（當前/下一等級門檻）
- 金幣顯示
- **體態數據列**（4格）：7日均重（kg）、體脂（%）、基礎代謝（kcal）、每日消耗（kcal）
  - 7日均重：取最近7天 `weightLog` 平均
  - 體脂/骨骼肌：取最新 `inbody` 記錄
  - 基礎代謝（BMR）：Mifflin-St Jeor 公式
  - 每日消耗（TDEE）：BMR × 活動係數（需設定）
- **每日飲食目標**：顯示熱量/蛋白質目標
- **今日達標進度**：熱量/蛋白質雙進度條（從今日 diary 加總）
- **成就館按鈕**：已解鎖/總成就數
- **體組成記錄按鈕**：最新記錄筆數
- **科學飲食知識庫按鈕**：QA 知識庫
- 右上角：🔔通知中心、⚙️設定

**大頭貼裁切**：拖曳+雙指縮放的圓形裁切 Modal（支援 touch 和 mouse）

### 7.8 設定（settings）

**外觀**
- 6 個主題色圓形 swatch（Grid 6列），當前主題顯示白色勾勾
- 切換後立即套用，並存入 localStorage

**資料備份**
- 匯出：將所有 localStorage key 打包成 JSON 下載（`recipe-journal-backup-YYYY-MM-DD.json`）
  - 包含：foodDB、recipes、diary、workoutLog、habits、habitLog、inbody、weightLog、gamification、dailyQuestsDone、earthArchive、customTasks、profile、avatarData
- 匯入：讀取 JSON 檔案，逐 key 還原到 localStorage
  - **earthArchive 特殊處理**：合併（Union）策略，以 `task` 欄位去重，保留本地與備份的所有唯一任務
  - 匯入後重新載入頁面（`location.reload()`）

### 7.9 成就館（achievements）

- 搜尋框（即時 filter 成就名稱、描述、觸發條件）
- 總解鎖數 / 總數
- 已獲得稱號顯示（badge 列表）
- 各分類可收合/展開（`_achCollapsed[key]`）
- 搜尋時強制展開所有分類
- 成就卡：
  - 鎖定狀態：低透明度，圖示灰色底
  - 解鎖狀態：圖示框使用 `var(--sage-pale)` 底色 / `var(--sage-muted)` 邊框 / `var(--sage)` 圖示色
  - 顯示解鎖日期、解鎖的稱號（如有）

### 7.10 體組成記錄（inbody）

- 時間軸列表（最新在上）
- 快速體重記錄（今日體重欄）
- 每筆記錄：日期、體重、體脂、骨骼肌、BMI
- 新增/編輯 Sheet：日期、體重、體脂%、骨骼肌kg、BMI
- 刪除（二次確認）

---

## 8. PWA 規格

### manifest.json

```json
{
  "name": "食譜日誌",
  "short_name": "食譜日誌",
  "display": "standalone",
  "start_url": "./",
  "background_color": "#F7F6F2",
  "theme_color": "#4D6A55",
  "icons": [
    { "src": "./icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "./icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

### Apple PWA

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="食譜日誌">
<link rel="apple-touch-icon" href="./icons/icon-180.png">
```

### Viewport

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

`viewport-fit=cover` 使內容延伸至 iOS 安全區域，配合 `env(safe-area-inset-bottom)` 使用。

### iOS 安全區域

以下元素的 padding-bottom 加入 `env(safe-area-inset-bottom)`：
- `.bottom-nav`（Nav Bar）
- `.fab`（浮動按鈕）
- `.toast`（底部 Toast）

### Service Worker（sw.js）

- 快取版本：`recipe-app-v4`
- **App Shell（Cache First）**：`./`、`./index.html`、`./app.js`、`./style.css`、圖示
- **GitHub API（Network First）**：`api.github.com`，網路失敗則回傳快取
- **Google Fonts（Network Only）**：`fonts.googleapis.com`、`fonts.gstatic.com`，無網路時 fallback 快取
- **版本更新策略**：安裝時 `skipWaiting()`；啟用時刪除舊快取；頁面監聽 `controllerchange` 事件自動重新載入

---

## 9. 匯出 / 匯入

### 匯出的 localStorage keys

```
foodDB, recipes, diary, workoutLog, habits, habitLog,
inbody, weightLog, gamification, dailyQuestsDone,
earthArchive, customTasks, profile, avatarData
```

不匯出：`cachedTasks`（API 快取，可重新拉取）、`appTheme`（個人偏好）

### earthArchive 合併策略

```javascript
// 以 task 欄位為唯一鍵，保留本地 + 備份的所有不重複任務
const existing = new Set(archive.map(t => t.task));
for (const item of imported) {
  if (!existing.has(item.task)) {
    archive.push(item);
    existing.add(item.task);
  }
}
```

---

## 10. 已知限制與設計決策

### 資料儲存

- localStorage 約 5–10 MB 限制（瀏覽器因廠商而異）
- Base64 圖片（食譜封面、大頭貼）佔用較多空間；食譜圖片壓縮至 JPEG 85%、640×480
- 清除瀏覽器資料會遺失所有紀錄→建議定期匯出備份

### 跨裝置同步

- 目前無雲端同步；換裝置須手動匯出→匯入 JSON 備份
- iOS Safari 的 PWA localStorage 與 Safari 瀏覽器共用

### 成就不可撤銷

- 設計上成就解鎖後永久保留，不因資料刪除而撤銷（與傳統遊戲成就設計一致）

### 任務 API

- 地球 Online 任務從 GitHub repo 拉取，需網路連線
- 離線時使用 Service Worker 快取或本地 earthArchive 隨機分配

### 主題色與 CSS 變數

- 主題色透過 JS 設定 `documentElement.style.setProperty()` 覆寫 `:root` 變數
- manifest.json 的 `theme_color` 固定為預設綠色，不隨主題動態更新（屬 PWA 規格限制）

### 圖示系統

- Lucide icon 以字串常數儲存 SVG path，不依賴任何 CDN
- 全離線可用

### 動畫

- 換頁：`flip-out-{forward/backward}` / `flip-in-{forward/backward}` CSS keyframe
- 防重複觸發：`state.isAnimating` 標誌（持續 300ms）

---

*本規格書由 Claude Sonnet 4.6 根據程式碼自動產生，2026-06-14。*
