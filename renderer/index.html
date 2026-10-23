<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>GlassCraft</title>
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'">
<style>
:root{--ink:#f1f2f4;--mute:#a4a7ad;--line:rgba(255,255,255,.16);--glass:rgba(255,255,255,.07);--r:22px;--font:Inter,"SF Pro Display",system-ui,"Segoe UI",sans-serif}
*{box-sizing:border-box;margin:0}
html,body{height:100%}
body{font:14px/1.5 var(--font);color:var(--ink);background:#141518;overflow:hidden;
 background-image:radial-gradient(520px 420px at 12% 18%,#8a8d94 0,transparent 70%),radial-gradient(600px 460px at 88% 80%,#6b6e75 0,transparent 70%),radial-gradient(380px 300px at 70% 10%,#3d3f45 0,transparent 70%),linear-gradient(160deg,#2a2c31,#101113)}
.glass{background:linear-gradient(135deg,rgba(255,255,255,.17),rgba(255,255,255,.04) 42%,rgba(255,255,255,.09));
 backdrop-filter:blur(26px) saturate(150%);-webkit-backdrop-filter:blur(26px) saturate(150%);border:1px solid var(--line);border-radius:var(--r);
 box-shadow:inset 0 1px 0 rgba(255,255,255,.35),inset 0 -1px 0 rgba(255,255,255,.05),0 18px 40px rgba(0,0,0,.35)}
.app{display:grid;grid-template-columns:210px 1fr;gap:16px;height:100%;padding:46px 16px 16px}
.top{position:fixed;inset:0 0 auto;height:38px;-webkit-app-region:drag}
nav{padding:18px 12px;display:flex;flex-direction:column;gap:6px}
nav h1{font-size:17px;font-weight:650;letter-spacing:-.01em;padding:2px 10px 16px}
nav button{all:unset;cursor:pointer;padding:10px 14px;border-radius:14px;color:var(--mute);transition:.18s}
nav button:hover{color:var(--ink);background:rgba(255,255,255,.06)}
nav button.on{color:var(--ink);background:rgba(255,255,255,.14);box-shadow:inset 0 1px 0 rgba(255,255,255,.3)}
nav .who{margin-top:auto;padding:12px;font-size:12px;color:var(--mute);border-top:1px solid var(--line)}
main{position:relative;overflow:hidden}
section{display:none;height:100%;padding:30px;flex-direction:column;gap:18px}
section.on{display:flex}
h2{font-size:26px;font-weight:650;letter-spacing:-.02em}
.sub{color:var(--mute)}
.chip{display:inline-block;padding:4px 14px;border-radius:99px;background:rgba(255,255,255,.12);border:1px solid var(--line);font-size:12px}
.btn{cursor:pointer;color:var(--ink);font:600 14px var(--font);padding:12px 26px;border-radius:16px;border:1px solid rgba(255,255,255,.3);
 background:linear-gradient(180deg,rgba(255,255,255,.34),rgba(255,255,255,.12));box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 8px 20px rgba(0,0,0,.3);transition:.15s}
.btn:hover{filter:brightness(1.15)}.btn:active{transform:scale(.98)}.btn:disabled{opacity:.45;cursor:default}
.btn.ghost{background:rgba(255,255,255,.06);box-shadow:none}
.btn:focus-visible,input:focus-visible{outline:2px solid #fff;outline-offset:2px}
input[type=text]{font:14px var(--font);color:var(--ink);padding:12px 16px;border-radius:14px;border:1px solid var(--line);background:rgba(0,0,0,.22);width:260px}
input[type=range]{accent-color:#d0d2d6;width:280px}
.hero{padding:26px;display:flex;flex-direction:column;gap:12px;flex:0 0 auto}
.bar{height:8px;border-radius:99px;background:rgba(255,255,255,.1);overflow:hidden}
.bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#9a9da3,#fff);transition:width .25s}
#log{flex:1;min-height:0;overflow:auto;padding:14px;font:12px/1.5 ui-monospace,Consolas,monospace;color:var(--mute);white-space:pre-wrap}
.row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.err{color:#ffb4b4;min-height:20px}
@media(max-width:760px){.app{grid-template-columns:1fr;grid-template-rows:auto 1fr}nav{flex-direction:row;flex-wrap:wrap}nav h1,nav .who{display:none}}
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
</style></head>
<body>
<div class="top"></div>
<div class="app">
  <nav class="glass">
    <h1>GlassCraft</h1>
    <button data-p="play" class="on">Play</button>
    <button data-p="acct">Account</button>
    <button data-p="set">Settings</button>
    <div class="who" id="who">Not signed in</div>
  </nav>
  <main class="glass">
    <section id="play" class="on">
      <h2>Minecraft Java Edition</h2>
      <div class="glass hero">
        <div class="row"><span class="chip" id="ver">1.21.11</span><span class="sub" id="status">Ready to play</span></div>
        <div class="row"><button class="btn" id="go">Play</button></div>
        <div class="bar"><i id="pct"></i></div>
        <div class="err" id="perr"></div>
      </div>
      <div class="glass" id="log"></div>
    </section>
    <section id="acct">
      <h2>Account</h2>
      <p class="sub" id="cur">Choose how you want to play.</p>
      <div class="row"><button class="btn" id="ms">Sign in with Microsoft</button><button class="btn ghost" id="out">Sign out</button></div>
      <div class="row"><input type="text" id="nick" placeholder="Offline username" maxlength="16"><button class="btn ghost" id="off">Use offline account</button></div>
      <div class="err" id="aerr"></div>
    </section>
    <section id="set">
      <h2>Settings</h2>
      <p class="sub">Memory for the game: <b id="ramv">4096</b> MB</p>
      <input type="range" id="ram" min="1024" max="16384" step="512" value="4096">
    </section>
  </main>
</div>
<script>
const $=id=>document.getElementById(id);
const show=a=>{$('who').textContent=a?`${a.name} · ${a.type==='msa'?'Microsoft':'Offline'}`:'Not signed in';
  $('cur').textContent=a?`Signed in as ${a.name} (${a.type==='msa'?'Microsoft account':'offline'}).`:'Choose how you want to play.'};
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('nav button,section').forEach(x=>x.classList.remove('on'));b.classList.add('on');$(b.dataset.p).classList.add('on')});
api.info().then(i=>{show(i.account);$('ver').textContent=i.version});
const guard=(btn,err,fn)=>async()=>{btn.disabled=true;err.textContent='';try{await fn()}catch(e){err.textContent=String(e.message||e).replace(/^Error invoking remote method '[^']+': (Error: )?/,'')}btn.disabled=false};
$('ms').onclick=guard($('ms'),$('aerr'),async()=>show(await api.loginMs()));
$('off').onclick=guard($('off'),$('aerr'),async()=>show(await api.loginOffline($('nick').value)));
$('out').onclick=async()=>{await api.logout();show(null)};
$('ram').value=localStorage.ram||4096;$('ramv').textContent=$('ram').value;
$('ram').oninput=e=>{localStorage.ram=e.target.value;$('ramv').textContent=e.target.value};
api.onProgress(d=>{$('status').textContent=d.text;$('pct').style.width=Math.round(d.pct*100)+'%'});
api.onLog(t=>{const l=$('log');l.textContent+=t;l.scrollTop=l.scrollHeight});
$('go').onclick=guard($('go'),$('perr'),async()=>{$('log').textContent='';$('status').textContent='Preparing…';
  try{await api.play(+$('ram').value);$('status').textContent='Game closed'}finally{$('pct').style.width='0'}});
</script>
</body></html>
