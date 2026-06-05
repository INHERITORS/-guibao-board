export type CurationRow = {
  id: string;
  name: string;
  curators: string;
  assistants: string;
  a: number;
  b1: number;
  b2: number;
  c: number;
  fengyun: number;
  display_order: number;
};

export type NoteRow = {
  id?: number;
  type: "todo" | "setting";
  title: string;
  body: string;
  display_order: number;
};

export type BoardState = {
  rows: CurationRow[];
  todos: NoteRow[];
  settings: NoteRow[];
};

export function score(row: CurationRow) {
  const b = Number(row.b1 || 0) + Math.min(15, Number(row.b2 || 0));
  const c = Math.min(40, Number(row.c || 0));
  const base = Number(row.a || 0) + b + c;
  const total = base + Number(row.fengyun || 0);
  return { b, c, base, total };
}

export function sortRows(rows: CurationRow[]) {
  return [...rows]
    .map((row) => ({ ...row, ...score(row) }))
    .sort((a, b) => b.total - a.total || a.display_order - b.display_order);
}

export const seedRows: CurationRow[] = [
  ["niulang-zhinu", "牛郎织女", "欣颍 & 渝恩", "", 0, 0, 0, 0, 0],
  ["menora", "Menora (泰国）", "民强 & 宇恒", "", 0, 0, 0, 0, 0],
  ["hunli", "婚礼", "珈玮 & 惠翎", "", 0, 0, 0, 0, 0],
  ["baxian-guohai", "八仙过海", "尤歆", "", 0, 0, 0, 0, 0],
  ["parameswara", "Parameswara", "王通 & 宇翔", "", 0, 0, 0, 0, 0],
  ["change-houyi", "嫦娥奔月/后羿", "惠翎 & 婞荧", "", 0, 0, 0, 0, 0],
  ["sang-kancil", "Sang Kancil", "杰升 & 凯渲", "", 0, 0, 0, 0, 0],
  ["xiyouji-danaotiangong", "西游记/大闹天宫", "喻萱", "", 0, 0, 0, 0, 0],
  ["niangao", "年糕", "竣铭 & 哲豪 & 家翰", "", 0, 0, 0, 0, 0],
  ["shuihuzhuan-108", "水浒传/108 好汉", "健美", "", 0, 0, 0, 0, 0],
  ["shennong", "神农尝百草", "威祥", "", 0, 0, 0, 0, 0],
  ["dabogong", "大伯公", "采瑩", "", 0, 0, 0, 0, 0],
  ["hanyu", "韩愈的故事", "可薇", "", 0, 0, 0, 0, 0],
  ["sanguoyanyi", "三国演义", "铭轩 & 奕恒", "", 0, 0, 0, 0, 0],
  ["tiangan-dizhi-shengxiao", "天干地支与十二生肖", "祖恩 & 竣铭", "", 0, 0, 0, 0, 0],
  ["hongloumeng", "红楼梦", "雯静 & 素心", "", 0, 0, 0, 0, 0],
  ["chabaixi", "茶百戏", "健美 & 昕莹", "", 0, 0, 0, 0, 0]
].map(([id, name, curators, assistants, a, b1, b2, c, fengyun], index) => ({
  id: String(id),
  name: String(name),
  curators: String(curators),
  assistants: String(assistants),
  a: Number(a),
  b1: Number(b1),
  b2: Number(b2),
  c: Number(c),
  fengyun: Number(fengyun),
  display_order: index + 1
}));

export const seedTodos: NoteRow[] = [
  { type: "todo", title: "补录 B1", body: "请检查尚未录入的 B1 内部分。", display_order: 1 },
  {
    type: "todo",
    title: "复核风云分",
    body: "风云加分较高的策展，锁定前需二次确认证据。",
    display_order: 2
  },
  {
    type: "todo",
    title: "提醒同侪投票",
    body: "尚未提交本月投票的策展，请在月会前完成。",
    display_order: 3
  }
];

export const seedSettings: NoteRow[] = [
  { type: "setting", title: "公开显示", body: "排名、总分、A/B/C/风云分、亮点。", display_order: 1 },
  { type: "setting", title: "内部保留", body: "扣分原因、评语、人工调整记录。", display_order: 2 },
  { type: "setting", title: "发布出口", body: "网页总榜、WhatsApp 文字、打印月榜。", display_order: 3 }
];
