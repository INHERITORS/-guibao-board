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
  ["niulang-zhinu", "牛郎织女", "欣颖", "", 28, 15, 7, 30, 120],
  ["menora", "Menora（泰国）", "民强 & 守恒", "", 30, 10, 8, 28, 60],
  ["hunli", "婚礼", "珈玮 & 惠翎", "", 18, 5, 7, 22, 180],
  ["baishezhuan", "白蛇传", "慧翎", "", 26, 15, 9, 24, 80],
  ["mulan", "花木兰", "凯钲", "", 24, 0, 5, 24, 90],
  ["change", "嫦娥奔月", "可薇", "", 22, 10, 9, 18, 100],
  ["liang-shanbo", "梁山伯与祝英台", "竣铭", "", 25, 10, 6, 20, 50],
  ["mengjiangnu", "孟姜女", "采萤", "", 20, 5, 5, 18, 40],
  ["nezha", "哪吒", "民强", "", 29, 15, 10, 26, 70],
  ["guanyu", "关公", "素岑", "", 27, 10, 6, 24, 60],
  ["mazu", "妈祖", "健美", "", 30, 15, 8, 30, 90],
  ["baosheng", "保生大帝", "喻萱", "", 21, 10, 4, 16, 40],
  ["qixi", "七夕", "惠翎", "", 24, 10, 6, 22, 60],
  ["yuanxiao", "元宵", "凯钲", "", 23, 5, 4, 18, 35],
  ["shadow-puppet", "皮影戏", "可薇", "", 26, 15, 7, 24, 65],
  ["lion-dance", "舞狮", "竣铭", "", 28, 10, 6, 20, 80],
  ["clan-stories", "姓氏故事", "采萤", "", 22, 0, 3, 12, 20]
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
