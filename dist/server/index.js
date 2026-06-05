const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>瑰宝榜 · 对外 Dashboard</title>
    <style>
      :root { --ink:#22201c; --paper:#f8f3e8; --jade:#2f6f63; --cinnabar:#b9472e; --gold:#c89b3c; --line:rgba(34,32,28,.12); }
      *{box-sizing:border-box} body{margin:0;min-height:100vh;font-family:"Noto Sans SC","Microsoft YaHei",system-ui,sans-serif;background:linear-gradient(180deg,#fbf7ed 0%,var(--paper) 100%);color:var(--ink)}
      header{position:sticky;top:0;z-index:10;border-bottom:1px solid var(--line);background:rgba(248,243,232,.94);backdrop-filter:blur(12px)}
      .nav,main{width:min(1180px,calc(100% - 32px));margin:0 auto}.nav{display:flex;min-height:64px;align-items:center;justify-content:space-between;gap:16px}.brand{display:flex;align-items:center;gap:10px;font-weight:900}.mark{display:grid;width:38px;height:38px;place-items:center;border-radius:8px;background:var(--cinnabar);color:white}
      main{padding:28px 0 52px}.hero{display:grid;grid-template-columns:.9fr 1.1fr;gap:28px;align-items:start}.eyebrow{width:fit-content;border-left:4px solid var(--cinnabar);background:rgba(255,255,255,.7);padding:8px 14px;font-size:14px;font-weight:900}
      h1{margin:22px 0 12px;font-size:clamp(42px,8vw,76px);line-height:.98}.lead{max-width:620px;color:rgba(34,32,28,.76);font-size:18px;line-height:1.8}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:24px}.stat,.panel,.table-wrap{border:1px solid var(--line);border-radius:8px;background:rgba(255,255,255,.74)}.stat{padding:16px}.stat b{display:block;font-size:28px}.stat span{color:rgba(34,32,28,.64);font-size:13px;font-weight:800}
      .panel{padding:18px}.panel-top{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:14px}.pill{border-radius:8px;background:var(--jade);color:white;padding:8px 10px;font-size:13px;font-weight:900}.rank-list{display:grid;gap:9px}.rank-item{display:grid;grid-template-columns:42px 1fr auto;align-items:center;gap:12px;border:1px solid rgba(34,32,28,.1);border-radius:8px;background:rgba(248,243,232,.72);padding:12px}.rank-no{font-size:20px;font-weight:900}.rank-name{font-weight:900}.rank-person{color:rgba(34,32,28,.58);font-size:13px}.rank-score{color:var(--cinnabar);font-weight:900}
      .section-title{margin:34px 0 16px;font-size:26px}.table-wrap{overflow-x:auto}table{width:100%;min-width:980px;border-collapse:collapse}th{background:var(--ink);color:var(--paper);font-size:14px;text-align:left}th,td{padding:13px 14px;border-top:1px solid rgba(34,32,28,.1);white-space:nowrap}td{font-size:14px}.up{color:var(--jade);font-weight:900}
      @media(max-width:860px){.hero{grid-template-columns:1fr}.stats{grid-template-columns:1fr}}
    </style>
  </head>
  <body>
    <header><div class="nav"><div class="brand"><span class="mark">榜</span><span>瑰宝榜</span></div><strong>公开总榜</strong></div></header>
    <main>
      <section class="hero">
        <div><div class="eyebrow">2027 丁未年槟城庙会 · 对外 Dashboard</div><h1>瑰宝榜</h1><p class="lead">让每一个瑰宝策展的履约、品质、内容深度与风云表现被看见。公开页显示排名、进度与亮点；内部评语保留给策划组。</p><div class="stats"><div class="stat"><b>17</b><span>瑰宝策展</span></div><div class="stat"><b>6月</b><span>当前评分月</span></div><div class="stat"><b>Top 12</b><span>庙会冲刺晋级线</span></div></div></div>
        <aside class="panel"><div class="panel-top"><div><strong>实时总榜</strong><div class="rank-person">本月 Top 6</div></div><span class="pill">2026-06</span></div><div class="rank-list" id="rank-list"></div></aside>
      </section>
      <h2 class="section-title">公开总榜</h2>
      <div class="table-wrap"><table><thead><tr><th>排名</th><th>策展名称</th><th>策展人</th><th>辅佐员</th><th>A 履约</th><th>B 品质</th><th>C 内容</th><th>基础</th><th>风云</th><th>本月</th><th>YTD</th></tr></thead><tbody id="board-body"></tbody></table></div>
    </main>
    <script>
      const rows = [
        ["牛郎织女","欣颖","-",28,22,30,80,120,200],
        ["红楼梦","雯靖","-",30,18,28,76,60,136],
        ["西游记","喻萱","-",18,12,22,52,180,232],
        ["白蛇传","慧翎","-",26,24,24,74,80,154],
        ["花木兰","凯钲","-",24,20,24,68,90,158],
        ["嫦娥奔月","可薇","-",22,19,18,59,100,159]
      ].sort((a,b)=>b[8]-a[8]);
      document.querySelector("#rank-list").innerHTML = rows.slice(0,6).map((r,i)=>'<div class="rank-item"><span class="rank-no">'+(i+1)+'</span><div><div class="rank-name">'+r[0]+'</div><div class="rank-person">策展人：'+r[1]+'</div><div class="rank-person">辅佐员：'+r[2]+'</div></div><span class="rank-score">'+r[8]+'</span></div>').join("");
      document.querySelector("#board-body").innerHTML = rows.map((r,i)=>'<tr><td>'+(i+1)+'</td><td><b>'+r[0]+'</b></td><td>'+r[1]+'</td><td>'+r[2]+'</td><td>'+r[3]+'</td><td>'+r[4]+'</td><td>'+r[5]+'</td><td>'+r[6]+'</td><td>+'+r[7]+'</td><td><b>'+r[8]+'</b></td><td>'+r[8]+'</td></tr>').join("");
    </script>
  </body>
</html>`;

export default {
  async fetch() {
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8"
      }
    });
  }
};
