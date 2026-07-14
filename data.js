// 預設食材資料庫 — 每筆均標注生食/熟食/加工品/飲品
const DEFAULT_FOOD_DB = [
  // === 肉類 ===
  { id:'f001', name:'雞胸肉', state:'生食', category:'肉類', per100g:{ calories:120, protein:22.5, fat:2.6, carbs:0, fiber:0 } },
  { id:'f002', name:'雞胸肉', state:'熟食', category:'肉類', per100g:{ calories:165, protein:31.0, fat:3.6, carbs:0, fiber:0 } },
  { id:'f003', name:'雞腿肉（去骨）', state:'生食', category:'肉類', per100g:{ calories:130, protein:17.9, fat:6.3, carbs:0, fiber:0 } },
  { id:'f004', name:'雞腿肉（去骨）', state:'熟食', category:'肉類', per100g:{ calories:177, protein:24.0, fat:8.5, carbs:0, fiber:0 } },
  { id:'f005', name:'豬里肌', state:'生食', category:'肉類', per100g:{ calories:143, protein:21.4, fat:6.0, carbs:0, fiber:0 } },
  { id:'f006', name:'豬五花', state:'生食', category:'肉類', per100g:{ calories:393, protein:14.1, fat:36.9, carbs:0, fiber:0 } },
  { id:'f007', name:'牛絞肉（85%瘦）', state:'生食', category:'肉類', per100g:{ calories:215, protein:19.4, fat:14.9, carbs:0, fiber:0 } },
  { id:'f008', name:'牛肋條', state:'生食', category:'肉類', per100g:{ calories:180, protein:18.6, fat:11.0, carbs:0, fiber:0 } },
  { id:'f009', name:'牛腱', state:'生食', category:'肉類', per100g:{ calories:116, protein:21.0, fat:3.1, carbs:0, fiber:0 } },
  // === 魚海鮮 ===
  { id:'f010', name:'鮭魚', state:'生食', category:'魚海鮮', per100g:{ calories:208, protein:20.4, fat:13.4, carbs:0, fiber:0 } },
  { id:'f011', name:'鯖魚', state:'生食', category:'魚海鮮', per100g:{ calories:205, protein:18.6, fat:13.9, carbs:0, fiber:0 } },
  { id:'f012', name:'鱸魚', state:'生食', category:'魚海鮮', per100g:{ calories:97, protein:20.2, fat:1.5, carbs:0, fiber:0 } },
  { id:'f013', name:'蝦子', state:'生食', category:'魚海鮮', per100g:{ calories:85, protein:20.1, fat:0.5, carbs:0, fiber:0 } },
  { id:'f014', name:'花枝／魷魚', state:'生食', category:'魚海鮮', per100g:{ calories:92, protein:15.6, fat:1.4, carbs:3.1, fiber:0 } },
  // === 蛋豆類 ===
  { id:'f015', name:'雞蛋（全蛋）', state:'生食', category:'蛋豆類', per100g:{ calories:155, protein:12.6, fat:10.6, carbs:1.1, fiber:0 } },
  { id:'f016', name:'板豆腐', state:'生食', category:'蛋豆類', per100g:{ calories:76, protein:8.1, fat:4.2, carbs:1.9, fiber:0.3 } },
  { id:'f017', name:'嫩豆腐', state:'生食', category:'蛋豆類', per100g:{ calories:55, protein:5.3, fat:3.5, carbs:1.2, fiber:0.1 } },
  { id:'f018', name:'毛豆', state:'熟食', category:'蛋豆類', per100g:{ calories:122, protein:11.9, fat:5.2, carbs:8.9, fiber:5.2 } },
  // === 蔬菜 ===
  { id:'f019', name:'番茄', state:'生食', category:'蔬菜', per100g:{ calories:19, protein:0.8, fat:0.1, carbs:4.1, fiber:1.2 }, note:'一顆中型大紅番茄約 100～130g' },
  { id:'f020', name:'洋蔥', state:'生食', category:'蔬菜', per100g:{ calories:39, protein:1.1, fat:0.1, carbs:8.9, fiber:1.3 }, note:'半顆中型洋蔥約 100g；一整顆約 180g' },
  { id:'f021', name:'大蒜', state:'生食', category:'蔬菜', per100g:{ calories:149, protein:6.4, fat:0.5, carbs:33.1, fiber:2.1 } },
  { id:'f022', name:'胡蘿蔔', state:'生食', category:'蔬菜', per100g:{ calories:36, protein:1.0, fat:0.2, carbs:8.3, fiber:2.7 }, note:'半根中型胡蘿蔔約 100g；一段 5cm 約 60g' },
  { id:'f023', name:'馬鈴薯', state:'生食', category:'蔬菜', per100g:{ calories:74, protein:2.6, fat:0.2, carbs:15.8, fiber:1.3 }, note:'一顆中小型馬鈴薯約 100～150g（拳頭大約 150g）' },
  { id:'f024', name:'地瓜', state:'生食', category:'蔬菜', per100g:{ calories:86, protein:1.6, fat:0.1, carbs:20.1, fiber:3.0 } },
  { id:'f025', name:'花椰菜', state:'生食', category:'蔬菜', per100g:{ calories:23, protein:1.8, fat:0.2, carbs:4.9, fiber:2.0 }, note:'3～4 朵約 100g；半顆中型約 300g' },
  { id:'f026', name:'高麗菜', state:'生食', category:'蔬菜', per100g:{ calories:23, protein:1.3, fat:0.2, carbs:4.8, fiber:1.1 }, note:'切絲一大把約 100g；一整顆中型約 1000g' },
  { id:'f027', name:'菠菜', state:'生食', category:'蔬菜', per100g:{ calories:18, protein:2.4, fat:0.4, carbs:3.1, fiber:1.9 }, note:'生的一大把約 100g（燙熟後大幅縮水）' },
  { id:'f028', name:'青椒', state:'生食', category:'蔬菜', per100g:{ calories:20, protein:0.9, fat:0.2, carbs:4.6, fiber:1.7 } },
  { id:'f029', name:'蘑菇', state:'生食', category:'蔬菜', per100g:{ calories:22, protein:3.1, fat:0.3, carbs:3.3, fiber:1.0 } },
  { id:'f030', name:'玉米', state:'生食', category:'蔬菜', per100g:{ calories:86, protein:3.3, fat:1.4, carbs:19.0, fiber:2.7 } },
  { id:'f031', name:'豆芽菜', state:'生食', category:'蔬菜', per100g:{ calories:24, protein:2.5, fat:0.4, carbs:3.4, fiber:1.3 }, note:'綠豆芽一把約 100g' },
  { id:'f032', name:'青蔥', state:'生食', category:'蔬菜', per100g:{ calories:32, protein:1.8, fat:0.2, carbs:7.3, fiber:2.6 } },
  { id:'f033', name:'薑', state:'生食', category:'蔬菜', per100g:{ calories:80, protein:1.8, fat:0.8, carbs:17.8, fiber:2.0 } },
  // === 穀物 ===
  { id:'f034', name:'白米（生）', state:'生食', category:'穀物', per100g:{ calories:365, protein:7.1, fat:0.7, carbs:79.0, fiber:1.3 } },
  { id:'f035', name:'白米飯（熟）', state:'熟食', category:'穀物', per100g:{ calories:130, protein:2.7, fat:0.3, carbs:28.2, fiber:0.3 } },
  { id:'f036', name:'糙米飯（熟）', state:'熟食', category:'穀物', per100g:{ calories:123, protein:2.6, fat:0.9, carbs:25.6, fiber:1.8 } },
  { id:'f037', name:'麵條（熟）', state:'熟食', category:'穀物', per100g:{ calories:138, protein:4.5, fat:0.9, carbs:27.0, fiber:1.8 } },
  { id:'f038', name:'義大利麵（熟）', state:'熟食', category:'穀物', per100g:{ calories:158, protein:5.8, fat:0.9, carbs:30.9, fiber:1.8 } },
  { id:'f039', name:'中筋麵粉（生）', state:'生食', category:'穀物', per100g:{ calories:364, protein:10.3, fat:1.0, carbs:76.3, fiber:2.7 } },
  { id:'f040', name:'全麥吐司', state:'加工品', category:'穀物', per100g:{ calories:247, protein:9.0, fat:3.4, carbs:46.0, fiber:7.0 } },
  { id:'f041', name:'白吐司', state:'加工品', category:'穀物', per100g:{ calories:265, protein:8.9, fat:3.2, carbs:50.6, fiber:2.4 } },
  { id:'f042', name:'燕麥（生）', state:'生食', category:'穀物', per100g:{ calories:389, protein:16.9, fat:6.9, carbs:66.3, fiber:10.6 } },
  // === 乳製品 ===
  { id:'f043', name:'牛奶（全脂）', state:'飲品', category:'乳製品', per100g:{ calories:61, protein:3.2, fat:3.3, carbs:4.8, fiber:0 } },
  { id:'f044', name:'希臘優格（無糖）', state:'加工品', category:'乳製品', per100g:{ calories:59, protein:10.2, fat:0.4, carbs:3.6, fiber:0 } },
  { id:'f045', name:'切達起司', state:'加工品', category:'乳製品', per100g:{ calories:402, protein:24.9, fat:33.1, carbs:1.3, fiber:0 } },
  { id:'f046', name:'奶油（無鹽）', state:'加工品', category:'乳製品', per100g:{ calories:717, protein:0.9, fat:81.1, carbs:0.1, fiber:0 } },
  // === 油脂調味 ===
  { id:'f047', name:'橄欖油', state:'加工品', category:'油脂', per100g:{ calories:884, protein:0, fat:100, carbs:0, fiber:0 } },
  { id:'f048', name:'芝麻油', state:'加工品', category:'油脂', per100g:{ calories:884, protein:0, fat:100, carbs:0, fiber:0 } },
  { id:'f049', name:'醬油', state:'加工品', category:'油脂', per100g:{ calories:53, protein:8.1, fat:0.1, carbs:4.9, fiber:0.8 } },
  // === 水果 ===
  { id:'f050', name:'香蕉', state:'生食', category:'水果', per100g:{ calories:89, protein:1.1, fat:0.3, carbs:22.8, fiber:2.6 } },
  { id:'f051', name:'蘋果', state:'生食', category:'水果', per100g:{ calories:52, protein:0.3, fat:0.2, carbs:13.8, fiber:2.4 } },
  { id:'f052', name:'橘子', state:'生食', category:'水果', per100g:{ calories:47, protein:0.9, fat:0.1, carbs:11.8, fiber:2.4 } },
  { id:'f053', name:'藍莓', state:'生食', category:'水果', per100g:{ calories:57, protein:0.7, fat:0.3, carbs:14.5, fiber:2.4 } },
  // === 其他 ===
  { id:'f054', name:'豆漿（無糖）', state:'飲品', category:'其他', per100g:{ calories:33, protein:3.0, fat:1.8, carbs:1.8, fiber:0.3 } },
  { id:'f055', name:'味噌', state:'加工品', category:'調味料', per100g:{ calories:199, protein:11.7, fat:6.0, carbs:26.5, fiber:5.4 } },
  { id:'f056', name:'蜂蜜', state:'加工品', category:'調味料', per100g:{ calories:304, protein:0.3, fat:0, carbs:82.4, fiber:0.2 } },
  // === 新增預設（v2）===
  { id:'f057', name:'燒鴨', state:'熟食', category:'肉類', per100g:{ calories:290, protein:22, fat:22, carbs:1.1, fiber:0 } },
  { id:'f058', name:'牛五花', state:'生食', category:'肉類', per100g:{ calories:430, protein:15.7, fat:40.3, carbs:0, fiber:0 } },
  { id:'f059', name:'雞腿肉（帶皮）', state:'熟食', category:'肉類', per100g:{ calories:233, protein:24, fat:15, carbs:0, fiber:0 } },
  { id:'f060', name:'豬腳（中段去骨）', state:'熟食', category:'肉類', per100g:{ calories:280, protein:19, fat:21, carbs:2, fiber:0 } },
  { id:'f061', name:'牛小排（去除大塊肥油）', state:'熟食', category:'肉類', per100g:{ calories:350, protein:23, fat:27, carbs:0, fiber:0 } },
  { id:'f062', name:'秋刀魚', state:'熟食', category:'魚海鮮', per100g:{ calories:305, protein:24, fat:23, carbs:0, fiber:0 } },
  { id:'f063', name:'鮭魚肚', state:'熟食', category:'魚海鮮', per100g:{ calories:220, protein:25, fat:13, carbs:0, fiber:0 } },
  { id:'f064', name:'黃花魚', state:'熟食', category:'魚海鮮', per100g:{ calories:127, protein:23.1, fat:3.9, carbs:0, fiber:0 } },
  { id:'f065', name:'花枝丸', state:'加工品', category:'魚海鮮', per100g:{ calories:180, protein:12, fat:9, carbs:13, fiber:0 } },
  { id:'f066', name:'油豆腐', state:'加工品', category:'蛋豆類', per100g:{ calories:138, protein:12, fat:9, carbs:2, fiber:1 } },
  { id:'f067', name:'生豆包', state:'熟食', category:'蛋豆類', per100g:{ calories:189, protein:14.6, fat:13.1, carbs:3.1, fiber:0 } },
  { id:'f068', name:'炸豆包', state:'熟食', category:'蛋豆類', per100g:{ calories:490, protein:21, fat:40, carbs:11, fiber:0 } },
  { id:'f069', name:'乾豆包', state:'熟食', category:'蛋豆類', per100g:{ calories:460, protein:43, fat:22, carbs:21, fiber:0 } },
  { id:'f070', name:'栗子南瓜', state:'熟食', category:'蔬菜', per100g:{ calories:80, protein:1.4, fat:0.2, carbs:20.7, fiber:3.3 } },
  { id:'f071', name:'紫米飯', state:'熟食', category:'穀物', per100g:{ calories:160, protein:3.5, fat:0.8, carbs:34, fiber:1.8 } },
  { id:'f072', name:'烤地瓜', state:'熟食', category:'蔬菜', per100g:{ calories:124, protein:1.3, fat:0.2, carbs:30, fiber:2.5 } },
  { id:'f073', name:'木瓜', state:'生食', category:'水果', per100g:{ calories:38, protein:0, fat:0, carbs:10, fiber:1.4 } },
  // === 青菜（衛福部食品營養成分資料庫）：生食 ===
  { id:'f074', name:'玉米筍', state:'生食', category:'蔬菜', per100g:{ calories:26, protein:2.2, fat:0.4, carbs:5.0, fiber:2.6 }, note:'約 8～10 根玉米筍 100g' },
  { id:'f075', name:'青江菜', state:'生食', category:'蔬菜', per100g:{ calories:10, protein:1.0, fat:0.2, carbs:1.7, fiber:1.4 }, note:'約 2 株中型青江菜 100g（燙熟後大幅縮水）' },
  { id:'f076', name:'白蘿蔔', state:'生食', category:'蔬菜', per100g:{ calories:16, protein:0.8, fat:0.1, carbs:3.8, fiber:1.1 }, note:'一塊 3cm 厚圓切約 100g' },
  { id:'f077', name:'地瓜葉', state:'生食', category:'蔬菜', per100g:{ calories:22, protein:2.2, fat:0.3, carbs:3.9, fiber:3.3 }, note:'甘薯葉；生的一大把約 100g（燙熟後大幅縮水）' },
  { id:'f078', name:'水蓮', state:'生食', category:'蔬菜', per100g:{ calories:17, protein:1.2, fat:0.1, carbs:3.2, fiber:1.9 }, note:'野蓮；一把約 100g，一盤快炒生重約 150～200g' },
  // === 青菜：熟食（水煮，數值與熟成率取自衛福部）===
  { id:'f079', name:'高麗菜', state:'熟食', category:'蔬菜', per100g:{ calories:27, protein:1.5, fat:0.2, carbs:5.6, fiber:1.3 }, note:'便當格平鋪一格 / 飯碗平平一碗約 85g' },
  { id:'f080', name:'番茄', state:'熟食', category:'蔬菜', per100g:{ calories:21, protein:0.9, fat:0.1, carbs:4.6, fiber:1.3 }, note:'棒球大小半顆約 70g（整顆約 140g）' },
  { id:'f081', name:'洋蔥', state:'熟食', category:'蔬菜', per100g:{ calories:46, protein:1.3, fat:0.1, carbs:10.5, fiber:1.5 }, note:'切絲半碗約 85g' },
  { id:'f082', name:'胡蘿蔔', state:'熟食', category:'蔬菜', per100g:{ calories:38, protein:1.1, fat:0.2, carbs:8.7, fiber:2.8 }, note:'滾刀塊 5 塊約 50g' },
  { id:'f083', name:'馬鈴薯', state:'熟食', category:'蔬菜', per100g:{ calories:78, protein:2.7, fat:0.2, carbs:16.6, fiber:1.4 }, note:'大切塊 3 塊約 95g' },
  { id:'f084', name:'花椰菜', state:'熟食', category:'蔬菜', per100g:{ calories:26, protein:2.0, fat:0.2, carbs:5.4, fiber:2.2 }, note:'中等大小 3-4 朵約 90g' },
  { id:'f085', name:'菠菜', state:'熟食', category:'蔬菜', per100g:{ calories:24, protein:3.2, fat:0.5, carbs:4.1, fiber:2.5 }, note:'一個緊實拳頭大 / 飯碗半碗多約 75g' },
  { id:'f086', name:'豆芽菜', state:'熟食', category:'蔬菜', per100g:{ calories:30, protein:3.1, fat:0.5, carbs:4.3, fiber:1.6 }, note:'大把撈起 / 飯碗 8 分滿約 80g' },
  { id:'f087', name:'玉米筍', state:'熟食', category:'蔬菜', per100g:{ calories:29, protein:2.4, fat:0.4, carbs:5.6, fiber:2.9 }, note:'中等大小 5 支約 50g' },
  { id:'f088', name:'青江菜', state:'熟食', category:'蔬菜', per100g:{ calories:13, protein:1.3, fat:0.3, carbs:2.1, fiber:1.8 }, note:'一個拳頭大 / 飯碗 8 分滿約 80g' },
  { id:'f089', name:'白蘿蔔', state:'熟食', category:'蔬菜', per100g:{ calories:17, protein:0.8, fat:0.1, carbs:4.0, fiber:1.2 }, note:'厚切圓形 1 塊約 110g；半圓形 2 塊約 70g' },
  { id:'f090', name:'地瓜葉', state:'熟食', category:'蔬菜', per100g:{ calories:29, protein:2.9, fat:0.4, carbs:5.2, fiber:4.4 }, note:'一個緊實拳頭大 / 飯碗 7 分滿約 75g' },
  { id:'f091', name:'水蓮', state:'熟食', category:'蔬菜', per100g:{ calories:20, protein:1.4, fat:0.1, carbs:3.8, fiber:2.2 }, note:'一小坨（約掌心大）約 85g' },
  // === 肉類（生／熟）與辛香料 ===
  { id:'f092', name:'牛板腱（嫩肩里肌）', state:'生食', category:'肉類', per100g:{ calories:138, protein:20.4, fat:5.6, carbs:0.1, fiber:0.0 }, note:'又稱嫩肩里肌' },
  { id:'f093', name:'牛板腱（嫩肩里肌）', state:'熟食', category:'肉類', per100g:{ calories:184, protein:27.2, fat:7.5, carbs:0.1, fiber:0.0 }, note:'煎烤熟成率約 75%；100g 熟肉約成年人掌心大，或火鍋薄肉片 5～6 片' },
  { id:'f094', name:'牛里肌（菲力）', state:'生食', category:'肉類', per100g:{ calories:115, protein:21.0, fat:2.9, carbs:0.1, fiber:0.0 }, note:'又稱菲力' },
  { id:'f095', name:'牛里肌（菲力）', state:'熟食', category:'肉類', per100g:{ calories:153, protein:28.0, fat:3.9, carbs:0.1, fiber:0.0 }, note:'煎烤熟成率約 75%；100g 熟肉約女生拳頭大，或厚 3cm 圓柱狀牛排一塊' },
  { id:'f096', name:'紅辣椒', state:'生食', category:'調味料', per100g:{ calories:40, protein:2.0, fat:0.6, carbs:8.0, fiber:4.0 }, serving:{ unit:'條', calories:2, protein:0.1, fat:0.03, carbs:0.4, fiber:0.2 }, note:'1 條約大拇指長度，切片後約裝滿 1/3 個中式湯匙（約 5g）' },
  { id:'f097', name:'黑胡椒粒', state:'加工品', category:'調味料', per100g:{ calories:250, protein:10.0, fat:3.5, carbs:65.0, fiber:25.0 }, serving:{ unit:'茶匙', calories:5, protein:0.2, fat:0.07, carbs:1.3, fiber:0.5 }, note:'1 茶匙約 2g ≈ 速食店胡椒包 2 包，或研磨罐轉 8～10 下' },
  { id:'f098', name:'九層塔', state:'生食', category:'調味料', per100g:{ calories:26, protein:3.0, fat:0.6, carbs:4.0, fiber:3.4 }, serving:{ unit:'把', calories:1.3, protein:0.15, fat:0.03, carbs:0.2, fiber:0.17 }, note:'1 把約 10 片生葉（約 5g），單手輕抓一小把；炒熟後嚴重縮水約剩 1 湯匙' },
];

// 每次擴充 DEFAULT_FOOD_DB 就 +1；initStorage 會把新的預設併入既有使用者的食物庫
// （同名者略過，以使用者手動新增的為準）。
const FOOD_DEFAULTS_VERSION = 6;

// 升級時「只」對這幾筆預設強制同步分類（修正曾經分錯類的品項）；
// 其餘一律保留使用者自己的分類編輯，不覆蓋。
const CATEGORY_FIX_IDS = ['f055', 'f056', 'f096', 'f098'];

// 顯示在「設定」最上方的版本 / 最後更新日期（每次部署時一起更新）
const APP_VERSION = 'v40';
const APP_UPDATED = '2026/07/14';

// 系統更新公告（顯示在通知中心「系統更新」）。最新的放最前面。
// 每次要 push 前，把該次更新內容加成一筆新的（version 用日期），使用者打開通知中心就會看到。
const SYSTEM_UPDATES = [
  {
    version: '2026-07-14',
    title: '2026/07/14 更新',
    features: [
      '新增「戒超加工食品」成就系列（習慣連續打卡解鎖）',
      '成就頁的累積類成就直接顯示進度條，還差多少一目了然',
      '食物庫新增「使用排行」：食譜與食材分開統計，前三名頒獎台',
      '食材新增「備註」欄；清單顯示膳食纖維、熱量移到品名旁',
      '新增多項常用食材與 13 種蔬菜（生／熟，衛福部數值，附份量參考）',
      '有氧運動新增「飛輪」',
      '運動搜尋：輸入項目查過往紀錄，方便比對上次強度',
      '飲食日誌日期改為月曆：可跳轉任一天、一鍵回今天，紅點超標／綠點達標',
      '設定：可開關「每日詢問體重」',
      '通知中心新增「系統更新」公告',
    ],
    fixes: [
      '修正食物庫偶爾整頁空白（單筆食材資料異常時會拖垮整份清單）',
      '修正食譜內含的食材沒被計入食材成就（吃食譜「烤雞腿」現在也算進「雞肉常客」）',
    ],
  },
];
