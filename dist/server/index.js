const ADMIN_PIN = "2027";

const seedRows = [
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
];

const defaultTodos = [
  ["补录 B1", "请检查尚未录入的 B1 内部分。"],
  ["复核风云分", "风云加分较高的策展，锁定前需二次确认证据。"],
  ["提醒同侪投票", "尚未提交本月投票的策展，请在月会前完成。"]
];

const defaultSettings = [
  ["公开显示", "排名、总分、A/B/C/风云分、亮点。"],
  ["内部保留", "扣分原因、评语、人工调整记录。"],
  ["发布出口", "网页总榜、WhatsApp 文字、打印月榜。"]
];

async function init(db) {
  await db.exec(`
    create table if not exists curations (
      id text primary key,
      name text not null,
      curators text not null default '',
      assistants text not null default '',
      a real not null default 0,
      b1 real not null default 0,
      b2 real not null default 0,
      c real not null default 0,
      fengyun real not null default 0,
      display_order integer not null default 0,
      updated_at text not null default CURRENT_TIMESTAMP
    );
    create table if not exists notes (
      id integer primary key autoincrement,
      type text not null,
      title text not null,
      body text not null,
      display_order integer not null default 0
    );
  `);
  const count = await db.prepare("select count(*) as count from curations").first();
  if (!count || count.count === 0) {
    const stmt = db.prepare("insert into curations (id,name,curators,assistants,a,b1,b2,c,fengyun,display_order) values (?,?,?,?,?,?,?,?,?,?)");
    await db.batch(seedRows.map((row, index) => stmt.bind(...row, index + 1)));
  }
  const noteCount = await db.prepare("select count(*) as count from notes").first();
  if (!noteCount || noteCount.count === 0) {
    const stmt = db.prepare("insert into notes (type,title,body,display_order) values (?,?,?,?)");
    const rows = [
      ...defaultTodos.map((item, index) => ["todo", item[0], item[1], index + 1]),
      ...defaultSettings.map((item, index) => ["setting", item[0], item[1], index + 1])
    ];
    await db.batch(rows.map((row) => stmt.bind(...row)));
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

function html(body) {
  return new Response(body, {
    headers: { "content-type": "text/html; charset=utf-8" }
  });
}

function authorized(request) {
  return request.headers.get("x-admin-pin") === ADMIN_PIN;
}

async function getBoard(db) {
  const rows = await db.prepare(`
    select *, (a + b1 + min(b2, 15) + min(c, 40)) as base_total,
      (a + b1 + min(b2, 15) + min(c, 40) + fengyun) as month_total
    from curations
    order by month_total desc, display_order asc
  `).all();
  const todos = await db.prepare("select id,title,body from notes where type='todo' order by display_order,id").all();
  const settings = await db.prepare("select id,title,body from notes where type='setting' order by display_order,id").all();
  return { rows: rows.results || [], todos: todos.results || [], settings: settings.results || [] };
}

async function handleApi(request, env) {
  await init(env.DB);
  const url = new URL(request.url);
  if (url.pathname === "/api/board" && request.method === "GET") {
    return json(await getBoard(env.DB));
  }
  if (url.pathname === "/api/save" && request.method === "POST") {
    if (!authorized(request)) return json({ error: "unauthorized" }, 401);
    const data = await request.json();
    const rowStmt = env.DB.prepare(`
      update curations set name=?, curators=?, assistants=?, a=?, b1=?, b2=?, c=?, fengyun=?, updated_at=CURRENT_TIMESTAMP where id=?
    `);
    const noteDelete = env.DB.prepare("delete from notes where type=?");
    const noteInsert = env.DB.prepare("insert into notes (type,title,body,display_order) values (?,?,?,?)");
    const batch = [];
    for (const row of data.rows || []) {
      batch.push(rowStmt.bind(row.name || "", row.curators || "", row.assistants || "", Number(row.a || 0), Number(row.b1 || 0), Number(row.b2 || 0), Number(row.c || 0), Number(row.fengyun || 0), row.id));
    }
    batch.push(noteDelete.bind("todo"));
    batch.push(noteDelete.bind("setting"));
    (data.todos || []).forEach((item, index) => batch.push(noteInsert.bind("todo", item.title || "", item.body || "", index + 1)));
    (data.settings || []).forEach((item, index) => batch.push(noteInsert.bind("setting", item.title || "", item.body || "", index + 1)));
    await env.DB.batch(batch);
    return json({ ok: true });
  }
  return json({ error: "not found" }, 404);
}

const styles = `
  :root{--ink:#23211d;--paper:#f7f2e8;--muted:rgba(35,33,29,.66);--line:rgba(35,33,29,.12);--jade:#2f6f63;--red:#b9472e;--gold:#c89b3c;--white:rgba(255,255,255,.78)}
  *{box-sizing:border-box}body{margin:0;min-height:100vh;font-family:"Noto Sans SC","Microsoft YaHei",system-ui,sans-serif;background:var(--paper);color:var(--ink)}header{position:sticky;top:0;z-index:10;border-bottom:1px solid var(--line);background:rgba(247,242,232,.94);backdrop-filter:blur(12px)}.nav,main{width:min(1240px,calc(100% - 32px));margin:0 auto}.nav{display:flex;min-height:64px;align-items:center;justify-content:space-between;gap:12px}.brand{font-weight:900}.mark{display:inline-grid;width:36px;height:36px;place-items:center;border-radius:8px;background:var(--red);color:white;margin-right:8px}main{padding:24px 0 56px}h1{font-size:clamp(32px,5vw,56px);margin:10px 0}.desc{color:var(--muted);line-height:1.7}.grid{display:grid;gap:14px}.hero{grid-template-columns:.9fr 1.1fr;align-items:start}.panel,.card,.table-wrap{border:1px solid var(--line);border-radius:8px;background:var(--white)}.panel{padding:18px}.cards{grid-template-columns:repeat(3,1fr);margin:20px 0}.card{padding:16px}.card b{display:block;font-size:28px}.table-wrap{overflow-x:auto}table{width:100%;min-width:980px;border-collapse:collapse}th{background:var(--ink);color:var(--paper);text-align:left}th,td{padding:12px;border-top:1px solid var(--line);white-space:nowrap}.rank-list{display:grid;gap:9px}.rank-item{display:grid;grid-template-columns:42px 1fr auto;gap:12px;align-items:center;border:1px solid var(--line);border-radius:8px;background:rgba(248,243,232,.72);padding:12px}.score{color:var(--red);font-weight:900}.admin-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,360px);gap:16px;align-items:start}.admin-layout>*{min-width:0}input,textarea,button{font:inherit;border:1px solid var(--line);border-radius:8px;background:white;color:var(--ink)}input{min-height:38px;padding:0 10px;width:100%}textarea{width:100%;min-height:72px;padding:10px;line-height:1.5}button{min-height:40px;padding:0 12px;font-weight:800;cursor:pointer}.primary{background:var(--ink);color:var(--paper);border-color:var(--ink)}.actions{display:flex;gap:8px;flex-wrap:wrap}.editable{display:grid;gap:10px}.editable-item{border:1px solid var(--line);border-radius:8px;background:rgba(248,243,232,.72);padding:12px}.editable-row{display:grid;grid-template-columns:1fr auto;gap:8px}.input-small{width:74px}.hint{font-size:13px;color:var(--muted)}@media(max-width:900px){.hero,.admin-layout,.cards{grid-template-columns:1fr}}`;

function publicPage() {
  return html(`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>瑰宝榜</title><style>${styles}</style></head><body><header><div class="nav"><div class="brand"><span class="mark">榜</span>瑰宝榜</div><a href="/admin">策划组后台</a></div></header><main><section class="grid hero"><div><p class="desc">2027 丁未年槟城庙会 · 对外 Dashboard</p><h1>瑰宝榜</h1><p class="desc">让每一个瑰宝策展的履约、品质、内容深度与风云表现被看见。</p><div class="grid cards"><div class="card"><b>17</b><span class="desc">瑰宝策展</span></div><div class="card"><b>6月</b><span class="desc">当前评分月</span></div><div class="card"><b>Top 12</b><span class="desc">晋级线</span></div></div></div><aside class="panel"><h2>本月 Top 6</h2><div class="rank-list" id="top"></div></aside></section><h2>公开总榜</h2><div class="table-wrap"><table><thead><tr><th>排名</th><th>策展名称</th><th>策展人</th><th>辅佐员</th><th>A 履约</th><th>B 品质</th><th>C 内容</th><th>基础</th><th>风云</th><th>本月</th></tr></thead><tbody id="body"></tbody></table></div></main><script>${clientBoardScript(false)}</script></body></html>`);
}

function adminPage() {
  return html(`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>瑰宝榜 · 策划组后台</title><style>${styles}</style></head><body><header><div class="nav"><div class="brand"><span class="mark">策</span>瑰宝榜 · 策划组后台</div><div class="actions"><input id="pin" placeholder="Admin PIN" style="width:120px"/><button class="primary" id="save">保存并发布</button><a href="/">对外榜</a></div></div></header><main><h1>2026-06 月度评分</h1><p class="desc">PIN 初始为 2027。保存后，全体成员打开对外链接即可看到最新资料。</p><section class="admin-layout"><div class="grid"><section class="panel"><h2>评分输入</h2><p class="hint">B1 内部分：5 表面、10 扎实、15 出众。B2 同侪票：最佳 +3、最进步 +2，封顶 15。</p><div class="table-wrap"><table><thead><tr><th>策展</th><th>策展人</th><th>辅佐员</th><th>A</th><th>B1 内部分</th><th>B2 同侪票</th><th>C</th><th>风云</th><th>本月</th></tr></thead><tbody id="editBody"></tbody></table></div></section><section class="panel"><h2>WhatsApp 公告</h2><div class="actions"><button id="publicMsg">群组 Top 5</button><button id="teamMsg">各策展分数</button><button id="copyMsg">复制</button></div><textarea id="message"></textarea></section></div><aside class="grid"><section class="panel"><div class="actions"><h2 style="margin-right:auto">待处理</h2><button id="addTodo">新增</button></div><div class="editable" id="todos"></div></section><section class="panel"><div class="actions"><h2 style="margin-right:auto">公开发布设置</h2><button id="addSetting">新增</button></div><div class="editable" id="settings"></div></section></aside></section></main><script>${clientBoardScript(true)}</script></body></html>`);
}

function clientBoardScript(isAdmin) {
  return `
let state={rows:[],todos:[],settings:[]};
const n=v=>Number.parseFloat(v||"0")||0;
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
function score(r){const b=n(r.b1)+Math.min(15,n(r.b2));const c=Math.min(40,n(r.c));const base=n(r.a)+b+c;return{b,c,base,total:base+n(r.fengyun)}}
async function load(){state=await fetch("/api/board").then(r=>r.json()); render();}
function sorted(){return [...state.rows].map(r=>({...r,...score(r)})).sort((a,b)=>b.total-a.total)}
function renderPublic(){const rows=sorted();document.querySelector("#top").innerHTML=rows.slice(0,6).map((r,i)=>'<div class="rank-item"><b>'+(i+1)+'</b><div><b>'+esc(r.name)+'</b><div class="hint">策展人：'+esc(r.curators||"-")+'</div><div class="hint">辅佐员：'+esc(r.assistants||"-")+'</div></div><span class="score">'+r.total+'</span></div>').join("");document.querySelector("#body").innerHTML=rows.map((r,i)=>'<tr><td>'+(i+1)+'</td><td><b>'+esc(r.name)+'</b></td><td>'+esc(r.curators||"-")+'</td><td>'+esc(r.assistants||"-")+'</td><td>'+r.a+'</td><td>'+r.b+'</td><td>'+r.c+'</td><td>'+r.base+'</td><td>+'+r.fengyun+'</td><td><b>'+r.total+'</b></td></tr>').join("")}
function renderEditable(list,id){document.querySelector(id).innerHTML=list.map((x,i)=>'<div class="editable-item"><div class="editable-row"><input data-i="'+i+'" data-f="title" value="'+esc(x.title)+'"/><button data-del="'+i+'" type="button">删除</button></div><textarea data-i="'+i+'" data-f="body">'+esc(x.body)+'</textarea></div>').join("")}
function bindNotes(type,id){document.querySelector(id).addEventListener("input",e=>{const i=e.target.dataset.i;const f=e.target.dataset.f;if(i!==undefined)state[type][i][f]=e.target.value});document.querySelector(id).addEventListener("click",e=>{const i=e.target.dataset.del;if(i!==undefined){state[type].splice(Number(i),1);render();}})}
function renderAdmin(){const rows=state.rows;document.querySelector("#editBody").innerHTML=rows.map((r,i)=>{const s=score(r);return '<tr data-i="'+i+'"><td><input data-f="name" value="'+esc(r.name)+'"/></td><td><input data-f="curators" value="'+esc(r.curators)+'"/></td><td><input data-f="assistants" value="'+esc(r.assistants||"")+'"/></td><td><input class="input-small" data-f="a" value="'+r.a+'"/></td><td><input class="input-small" data-f="b1" value="'+r.b1+'"/></td><td><input class="input-small" data-f="b2" value="'+r.b2+'"/></td><td><input class="input-small" data-f="c" value="'+r.c+'"/></td><td><input class="input-small" data-f="fengyun" value="'+r.fengyun+'"/></td><td><b>'+s.total+'</b></td></tr>'}).join("");renderEditable(state.todos,"#todos");renderEditable(state.settings,"#settings");updatePublicMsg();}
function render(){${isAdmin ? "renderAdmin();bindNotes('todos','#todos');bindNotes('settings','#settings');" : "renderPublic();"}}
${isAdmin ? `
document.addEventListener("input",e=>{const tr=e.target.closest("tr[data-i]");if(!tr)return;state.rows[Number(tr.dataset.i)][e.target.dataset.f]=e.target.value;renderAdmin();});
document.querySelector("#addTodo").onclick=()=>{state.todos.push({title:"新待处理事项",body:"请填写说明。"});render()};
document.querySelector("#addSetting").onclick=()=>{state.settings.push({title:"新发布设置",body:"请填写说明。"});render()};
document.querySelector("#save").onclick=async()=>{const res=await fetch("/api/save",{method:"POST",headers:{"content-type":"application/json","x-admin-pin":document.querySelector("#pin").value},body:JSON.stringify(state)});alert(res.ok?"已保存并发布":"PIN 错误或保存失败")};
function updatePublicMsg(){const top=sorted().slice(0,5);document.querySelector("#message").value=["【瑰宝榜 · 最新进度】","",...top.map((r,i)=>(i+1)+". "+r.name+"（"+(r.curators||"-")+"）"+r.total+"分"),"","请各策展继续补齐内容深度与风云题证据。"].join("\\n")}
function updateTeamMsg(){document.querySelector("#message").value=sorted().map((r,i)=>"#"+(i+1)+" "+r.name+"\\n策展人："+(r.curators||"-")+"\\n辅佐员："+(r.assistants||"-")+"\\n本月总分："+r.total+"\\nA履约："+r.a+"｜B品质："+r.b+"｜C内容："+r.c+"｜风云："+r.fengyun+"\\n").join("\\n")}
document.querySelector("#publicMsg").onclick=updatePublicMsg;document.querySelector("#teamMsg").onclick=updateTeamMsg;document.querySelector("#copyMsg").onclick=()=>navigator.clipboard.writeText(document.querySelector("#message").value);
` : ""}
load();`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) return handleApi(request, env);
    if (url.pathname === "/admin") return adminPage();
    return publicPage();
  }
};
