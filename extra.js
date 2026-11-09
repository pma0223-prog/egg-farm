/* extra.js : 병아리 퍼즐 / 엄마 닭 찾기 미로 / 병아리 색칠공부 */
(function(){
var css=[
'.stage{display:flex;flex-direction:column;align-items:center;gap:14px;margin:6px 0 14px;width:100%}',
'.btn[disabled]{opacity:.45;box-shadow:none;cursor:default}',
/* 색칠공부 */
'.paper{width:100%;max-width:420px;background:#fff;border-radius:24px;border:4px solid #EAD7B0;padding:8px;box-shadow:0 6px 0 #E3C58A}',
'.paper svg{width:100%;height:auto;display:block}',
'.reg{cursor:pointer;stroke:#5a4632;stroke-width:2;stroke-linejoin:round}',
'.palette{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;width:100%;max-width:420px;padding:0 6px}',
'.sw{aspect-ratio:1;border-radius:50%;border:4px solid #fff;box-shadow:0 0 0 3px #C9B27F;cursor:pointer;padding:0;position:relative;font-size:0}',
'.sw.sel{box-shadow:0 0 0 6px #3B2A1A}',
'.sw.sel::after{content:"✔";font-size:26px;position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#3B2A1A;text-shadow:0 0 5px #fff}',
/* 미로 */
'.maze{display:grid;width:100%;max-width:440px;aspect-ratio:1;background:#FFFBEF;border-right:4px solid #8D6E4B;border-bottom:4px solid #8D6E4B;touch-action:none;border-radius:6px}',
'.mc{position:relative;display:flex;align-items:center;justify-content:center;box-sizing:border-box;border-top:4px solid transparent;border-left:4px solid transparent}',
'.mc.t{border-top-color:#8D6E4B}',
'.mc.l{border-left-color:#8D6E4B}',
'.mc.seen{background:#FFF2B8}',
'.mc.hint{background:#C7F0C0}',
'.mc svg{width:92%;height:92%;pointer-events:none}',
'.mc .goal{pointer-events:none}',
'.pad{display:grid;grid-template-columns:repeat(3,78px);grid-template-rows:repeat(2,78px);gap:8px;justify-content:center}',
'.pb{font:inherit;font-size:34px;border:0;border-radius:20px;background:#fff;color:#B45309;border:3px solid #F59E0B;box-shadow:0 5px 0 #E3C58A;cursor:pointer}',
'.pb:active{transform:translateY(4px);box-shadow:0 1px 0 #E3C58A}',
/* 퍼즐 */
'.board{display:grid;width:100%;max-width:360px;aspect-ratio:3/4;gap:3px;background:#C9B27F;padding:3px;border-radius:14px;position:relative}',
'.tile{position:relative;overflow:hidden;border-radius:6px;cursor:pointer;background:#fff;padding:0;border:0}',
'.tile svg{width:100%;height:100%;display:block;pointer-events:none}',
'.tile.sel{outline:6px solid #F59E0B;outline-offset:-6px;z-index:2}',
'.tile.ok::after{content:"✔";position:absolute;top:2px;right:5px;font-size:22px;color:#2F9E44;text-shadow:0 0 4px #fff}',
'.preview{position:absolute;inset:0;z-index:5;background:#fff;border-radius:14px;overflow:hidden}',
'.preview svg{width:100%;height:100%;display:block}'
].join('');
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

function nested(s,x,y,w,h){return s.replace('<svg ','<svg x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" ');}

/* ============ 색칠공부 ============ */
var SW=[['빨강','#FF6B6B'],['주황','#FFA94D'],['노랑','#FFD43B'],['초록','#69DB7C'],['하늘','#74C0FC'],['파랑','#4C6EF5'],['보라','#B197FC'],['분홍','#FFA8C5'],['갈색','#A9744F'],['흰색','#FFFFFF']];
var EYES='<circle cx="37" cy="51" r="6.5" fill="#2b2b2b" pointer-events="none"/><circle cx="63" cy="51" r="6.5" fill="#2b2b2b" pointer-events="none"/><circle cx="39.3" cy="48.6" r="2.4" fill="#fff" pointer-events="none"/><circle cx="65.3" cy="48.6" r="2.4" fill="#fff" pointer-events="none"/>';
var EYES2='<circle cx="40" cy="48" r="5.5" fill="#2b2b2b" pointer-events="none"/><circle cx="60" cy="48" r="5.5" fill="#2b2b2b" pointer-events="none"/><circle cx="41.8" cy="46" r="2" fill="#fff" pointer-events="none"/><circle cx="61.8" cy="46" r="2" fill="#fff" pointer-events="none"/>';
var PICS=[
 {name:'병아리',vb:'0 0 100 100',decor:EYES,parts:[
  ['ellipse','cx="38" cy="91" rx="8" ry="3.5"'],
  ['ellipse','cx="62" cy="91" rx="8" ry="3.5"'],
  ['ellipse','cx="14" cy="62" rx="8" ry="15" transform="rotate(18 14 62)"'],
  ['ellipse','cx="86" cy="62" rx="8" ry="15" transform="rotate(-18 86 62)"'],
  ['ellipse','cx="50" cy="57" rx="37" ry="35"'],
  ['ellipse','cx="50" cy="73" rx="22" ry="15"'],
  ['path','d="M42 27Q36 8 48 18Q50 4 56 18Q66 8 58 27Z"'],
  ['circle','cx="25" cy="63" r="6"'],
  ['circle','cx="75" cy="63" r="6"'],
  ['path','d="M43 59Q50 55 57 59Q50 70 43 59Z"']
 ]},
 {name:'알에서 나온 병아리',vb:'0 0 100 100',decor:EYES2,parts:[
  ['circle','cx="50" cy="48" r="27"'],
  ['path','d="M43 25Q37 10 47 18Q50 5 56 18Q65 10 57 25Z"'],
  ['path','d="M43 56Q50 52 57 56Q50 66 43 56Z"'],
  ['circle','cx="27" cy="58" r="5.5"'],
  ['circle','cx="73" cy="58" r="5.5"'],
  ['path','d="M12 70L26 57L38 70L50 57L62 70L74 57L88 70Q88 97 50 97Q12 97 12 70Z"'],
  ['path','d="M76 12L89 5L96 20L87 31L75 27Z"']
 ]},
 {name:'꽃밭',vb:'0 0 100 100',decor:'',parts:[
  ['ellipse','cx="50" cy="94" rx="42" ry="8"'],
  ['path','d="M46 40H54V92H46Z"'],
  ['path','d="M46 76Q26 62 18 72Q28 86 46 82Z"'],
  ['path','d="M54 68Q74 54 82 64Q72 78 54 74Z"'],
  ['ellipse','cx="50" cy="14" rx="9" ry="14" transform="rotate(0 50 30)"'],
  ['ellipse','cx="50" cy="14" rx="9" ry="14" transform="rotate(60 50 30)"'],
  ['ellipse','cx="50" cy="14" rx="9" ry="14" transform="rotate(120 50 30)"'],
  ['ellipse','cx="50" cy="14" rx="9" ry="14" transform="rotate(180 50 30)"'],
  ['ellipse','cx="50" cy="14" rx="9" ry="14" transform="rotate(240 50 30)"'],
  ['ellipse','cx="50" cy="14" rx="9" ry="14" transform="rotate(300 50 30)"'],
  ['circle','cx="50" cy="30" r="10"']
 ]},
 {name:'엄마 닭',vb:'0 0 100 100',decor:'<circle cx="76" cy="33" r="3.2" fill="#2b2b2b" pointer-events="none"/>',parts:[
  ['path','d="M20 52Q2 34 10 20Q22 30 30 46Z"'],
  ['rect','x="37" y="84" width="6" height="12" rx="2"'],
  ['rect','x="53" y="84" width="6" height="12" rx="2"'],
  ['ellipse','cx="48" cy="62" rx="32" ry="26"'],
  ['ellipse','cx="44" cy="64" rx="18" ry="12" transform="rotate(-15 44 64)"'],
  ['circle','cx="72" cy="36" r="16"'],
  ['circle','cx="66" cy="19" r="6"'],
  ['circle','cx="74" cy="16" r="6"'],
  ['circle','cx="81" cy="20" r="5.5"'],
  ['path','d="M86 33L99 38L86 43Z"'],
  ['ellipse','cx="83" cy="50" rx="4" ry="6"']
 ]},
 {name:'농장 집',vb:'0 0 100 100',decor:'<line x1="38" y1="56" x2="62" y2="88" stroke="#5a4632" stroke-width="2" pointer-events="none"/><line x1="62" y1="56" x2="38" y2="88" stroke="#5a4632" stroke-width="2" pointer-events="none"/>',parts:[
  ['circle','cx="86" cy="14" r="9"'],
  ['rect','x="0" y="88" width="100" height="12"'],
  ['rect','x="15" y="40" width="70" height="48"'],
  ['polygon','points="8,42 50,12 92,42"'],
  ['rect','x="38" y="56" width="24" height="32"'],
  ['circle','cx="50" cy="31" r="7"'],
  ['rect','x="20" y="52" width="12" height="12"'],
  ['rect','x="68" y="52" width="12" height="12"']
 ]},
 {name:'나비',vb:'0 0 100 100',decor:'<path d="M48 22Q42 10 37 8M52 22Q58 10 63 8" stroke="#5a4632" stroke-width="2" fill="none" stroke-linecap="round" pointer-events="none"/>',parts:[
  ['ellipse','cx="33" cy="38" rx="22" ry="20" transform="rotate(-25 33 38)"'],
  ['ellipse','cx="67" cy="38" rx="22" ry="20" transform="rotate(25 67 38)"'],
  ['ellipse','cx="38" cy="68" rx="16" ry="14" transform="rotate(20 38 68)"'],
  ['ellipse','cx="62" cy="68" rx="16" ry="14" transform="rotate(-20 62 68)"'],
  ['circle','cx="29" cy="36" r="6"'],
  ['circle','cx="71" cy="36" r="6"'],
  ['circle','cx="38" cy="68" r="5"'],
  ['circle','cx="62" cy="68" r="5"'],
  ['ellipse','cx="50" cy="54" rx="5" ry="24"'],
  ['circle','cx="50" cy="26" r="6.5"']
 ]},
 {name:'무지개',vb:'0 0 100 100',decor:'',parts:[
  ['circle','cx="85" cy="17" r="9"'],
  ['path','d="M6 80A44 44 0 0 1 94 80L87 80A37 37 0 0 0 13 80Z"'],
  ['path','d="M13 80A37 37 0 0 1 87 80L80 80A30 30 0 0 0 20 80Z"'],
  ['path','d="M20 80A30 30 0 0 1 80 80L73 80A23 23 0 0 0 27 80Z"'],
  ['path','d="M27 80A23 23 0 0 1 73 80L66 80A16 16 0 0 0 34 80Z"'],
  ['path','d="M34 80A16 16 0 0 1 66 80L59 80A9 9 0 0 0 41 80Z"'],
  ['path','d="M2 90Q-2 78 10 78Q12 68 24 71Q32 68 35 78Q44 80 40 90Z"'],
  ['path','d="M62 90Q58 80 66 78Q68 68 80 71Q88 67 92 77Q100 79 95 90Z"']
 ]},
 {name:'사과나무',vb:'0 0 100 100',decor:'',parts:[
  ['ellipse','cx="50" cy="95" rx="42" ry="6"'],
  ['rect','x="44" y="58" width="12" height="38"'],
  ['circle','cx="50" cy="36" r="30"'],
  ['circle','cx="37" cy="32" r="6"'],
  ['circle','cx="60" cy="26" r="6"'],
  ['circle','cx="63" cy="48" r="6"'],
  ['circle','cx="40" cy="50" r="6"']
 ]}
];
function pickUnseen(key,len){
  var seen=save[key]||[],left=[],i;
  for(i=0;i<len;i++)if(seen.indexOf(i)<0)left.push(i);
  if(!left.length){
    var last=seen[seen.length-1];seen=[];
    for(i=0;i<len;i++)if(i!==last)left.push(i);
  }
  var idx=left[rnd(left.length)];
  save[key]=seen.concat([idx]);persist();
  return idx;
}
function pickPic(){return pickUnseen('cseen',PICS.length);}

window.playColoring=function(x){
  var pic=PICS[pickPic()],n=pic.parts.length;
  var cur='#FFD43B',curName='노랑',filled={},hist=[];
  var h='<div class="paper"><svg viewBox="'+pic.vb+'">';
  pic.parts.forEach(function(p,i){h+='<'+p[0]+' class="reg" data-i="'+i+'" fill="#FFFFFF" '+p[1]+'/>';});
  h+=pic.decor+'</svg></div><div class="palette">';
  SW.forEach(function(s,i){h+='<button class="sw'+(i===2?' sel':'')+'" data-c="'+s[1]+'" data-n="'+s[0]+'" aria-label="'+s[0]+'" style="background:'+s[1]+'"></button>';});
  h+='</div>';
  x.stage.innerHTML=h;
  x.ctl.innerHTML='<button class="btn sub" id="undo">↩ 되돌리기</button><button class="btn" id="done" disabled>✔ 다 그렸어요</button>';
  var regs=x.stage.querySelectorAll('.reg');
  function count(){return Object.keys(filled).length;}
  function refresh(){
    x.score('"'+pic.name+'" 그림 · 칠한 칸 '+count()+' / '+n);
    var all=count()===n;
    document.getElementById('done').disabled=!all;
    x.msg(all?'모두 칠했어요! 아래 버튼을 눌러 주세요 🎉':'색을 고르고 그림을 눌러요 · 지금 색: '+curName);
  }
  x.stage.onclick=function(e){
    var t=e.target;
    if(t.classList.contains('sw')){
      x.stage.querySelectorAll('.sw').forEach(function(b){b.classList.remove('sel');});
      t.classList.add('sel');cur=t.dataset.c;curName=t.dataset.n;beep(520,.06,'triangle',.1);refresh();
    }else if(t.classList.contains('reg')){
      var i=+t.dataset.i;
      hist.push({i:i,fill:t.getAttribute('fill'),was:filled[i]});
      t.setAttribute('fill',cur);
      filled[i]=1;
      beep(660,.08,'triangle',.12);refresh();
    }
  };
  document.getElementById('undo').onclick=function(){
    var a=hist.pop();if(!a)return;
    regs[a.i].setAttribute('fill',a.fill);
    if(a.was)filled[a.i]=1;else delete filled[a.i];
    refresh();
  };
  document.getElementById('done').onclick=function(){
    if(!alive(x.t)||count()!==n)return;
    finish(x,'coloring','멋진 "'+pic.name+'" 그림을 완성했어요!');
  };
  refresh();
};

/* ============ 미로 ============ */
function genMaze(n){
  var cells=[],i;
  for(i=0;i<n*n;i++)cells.push({t:1,r:1,b:1,l:1,v:0});
  var stack=[0];cells[0].v=1;
  while(stack.length){
    var c=stack[stack.length-1],cx=c%n,cy=(c/n)|0,nb=[];
    if(cy>0&&!cells[c-n].v)nb.push(['t',c-n,'b']);
    if(cx<n-1&&!cells[c+1].v)nb.push(['r',c+1,'l']);
    if(cy<n-1&&!cells[c+n].v)nb.push(['b',c+n,'t']);
    if(cx>0&&!cells[c-1].v)nb.push(['l',c-1,'r']);
    if(!nb.length){stack.pop();continue;}
    var pick=nb[rnd(nb.length)];
    cells[c][pick[0]]=0;cells[pick[1]][pick[2]]=0;cells[pick[1]].v=1;stack.push(pick[1]);
  }
  /* 길이 조금 더 넓어지도록 벽을 몇 개 허문다 */
  for(i=0;i<n;i++){
    var q=rnd(n*n);
    if(rnd(2)===0&&q%n<n-1){cells[q].r=0;cells[q+1].l=0;}
    else if(((q/n)|0)<n-1){cells[q].b=0;cells[q+n].t=0;}
  }
  return cells;
}
function solveMaze(cells,n,from,goal){
  var prev={},q=[from];prev[from]=-1;
  while(q.length){
    var c=q.shift();if(c===goal)break;
    var nb=[];
    if(cells[c].t===0&&c>=n)nb.push(c-n);
    if(cells[c].b===0&&c<n*n-n)nb.push(c+n);
    if(cells[c].l===0&&c%n>0)nb.push(c-1);
    if(cells[c].r===0&&c%n<n-1)nb.push(c+1);
    nb.forEach(function(d){if(!(d in prev)){prev[d]=c;q.push(d);}});
  }
  var p=[],k=goal;
  while(k!==undefined&&k!==-1){p.push(k);k=prev[k];}
  return p.reverse();
}

window.playMaze=function(x){
  var n=Math.min(5+x.lv,9),cells=genMaze(n),goal=n*n-1,pos=0,seen={0:1},won=false,drag=false;
  var h='<div class="maze" id="maze" style="grid-template-columns:repeat('+n+',1fr);grid-template-rows:repeat('+n+',1fr)">';
  for(var i=0;i<n*n;i++){h+='<div class="mc'+(cells[i].t?' t':'')+(cells[i].l?' l':'')+'" data-i="'+i+'"></div>';}
  h+='</div><div class="pad"><span></span><button class="pb" data-d="t" aria-label="위">▲</button><span></span><button class="pb" data-d="l" aria-label="왼쪽">◀</button><button class="pb" data-d="b" aria-label="아래">▼</button><button class="pb" data-d="r" aria-label="오른쪽">▶</button></div>';
  x.stage.innerHTML=h;
  x.ctl.innerHTML='<button class="btn sub" id="hint">💡 길 알려 주기</button><button class="btn sub" id="reset">↺ 처음으로</button>';
  var maze=document.getElementById('maze'),els=maze.querySelectorAll('.mc');
  maze.style.fontSize=Math.round(maze.clientWidth/n*0.62)+'px';
  x.score('미로 크기 '+n+' x '+n);
  x.msg('병아리를 끌어서 엄마 닭에게 데려가 주세요!');
  function draw(){
    for(var i=0;i<n*n;i++){
      var e=els[i];
      e.className='mc'+(cells[i].t?' t':'')+(cells[i].l?' l':'')+(seen[i]?' seen':'');
      e.innerHTML=i===pos?chick('#FFD43B'):(i===goal?'<span class="goal">🐔</span>':'');
    }
  }
  function stepTo(i){
    if(won||i===pos)return false;
    var ok=false;
    if(i===pos-n&&pos>=n&&cells[pos].t===0)ok=true;
    else if(i===pos+n&&pos<n*n-n&&cells[pos].b===0)ok=true;
    else if(i===pos-1&&pos%n>0&&cells[pos].l===0)ok=true;
    else if(i===pos+1&&pos%n<n-1&&cells[pos].r===0)ok=true;
    if(!ok)return false;
    pos=i;seen[i]=1;beep(500+(i%7)*40,.06,'triangle',.1);draw();
    if(pos===goal){
      won=true;cheer();x.msg('엄마 닭을 만났어요! 🐔');
      setTimeout(function(){if(alive(x.t))finish(x,'maze','엄마 닭을 찾았어요!');},1100);
    }
    return true;
  }
  function dirStep(d){
    var t=d==='t'?pos-n:d==='b'?pos+n:d==='l'?pos-1:pos+1;
    if(!stepTo(t)&&!won){oops();}
  }
  function atPoint(e){
    var el=document.elementFromPoint(e.clientX,e.clientY),mc=el&&el.closest?el.closest('.mc'):null;
    if(mc)stepTo(+mc.dataset.i);
  }
  maze.addEventListener('pointerdown',function(e){drag=true;atPoint(e);});
  maze.addEventListener('pointermove',function(e){if(drag)atPoint(e);});
  var stop=function(){drag=false;};
  maze.addEventListener('pointerup',stop);maze.addEventListener('pointercancel',stop);maze.addEventListener('pointerleave',stop);
  x.stage.querySelectorAll('.pb').forEach(function(b){b.onclick=function(){dirStep(b.dataset.d);};});
  var keys={ArrowUp:'t',ArrowDown:'b',ArrowLeft:'l',ArrowRight:'r'};
  var kh=function(e){
    if(!alive(x.t)){window.removeEventListener('keydown',kh);return;}
    if(keys[e.key]){e.preventDefault();dirStep(keys[e.key]);}
  };
  window.addEventListener('keydown',kh);
  document.getElementById('reset').onclick=function(){if(won)return;pos=0;seen={0:1};draw();x.msg('처음부터 다시 가 볼까요?');};
  document.getElementById('hint').onclick=function(){
    if(won)return;
    var p=solveMaze(cells,n,pos,goal);
    p.forEach(function(i){if(i!==pos&&i!==goal)els[i].classList.add('hint');});
    x.msg('초록색 길을 따라가 보세요 🌿');
    setTimeout(function(){if(alive(x.t)&&!won){draw();x.msg('병아리를 끌어서 엄마 닭에게 데려가 주세요!');}},3500);
  };
  draw();
};

/* ============ 그림 퍼즐 ============ */
function sceneA(){
  var s='<rect width="300" height="400" fill="#BFE9FF"/><circle cx="238" cy="68" r="36" fill="#FFE066"/>'+
   '<ellipse cx="70" cy="85" rx="46" ry="20" fill="#fff"/><ellipse cx="105" cy="72" rx="34" ry="18" fill="#fff"/><ellipse cx="170" cy="140" rx="42" ry="16" fill="#fff"/>'+
   '<ellipse cx="80" cy="345" rx="200" ry="110" fill="#A5DC7B"/><ellipse cx="270" cy="375" rx="170" ry="95" fill="#7CC65A"/>'+
   nested(chick('#FFD43B'),60,150,180,180)+nested(egg,12,312,62,62)+nested(chick('#FFD43B'),215,300,70,70);
  var fl=[[30,372],[112,386],[190,380],[255,392],[150,362]];
  fl.forEach(function(f){s+='<circle cx="'+f[0]+'" cy="'+f[1]+'" r="11" fill="#FF8FB1"/><circle cx="'+f[0]+'" cy="'+f[1]+'" r="4.5" fill="#FFD43B"/>';});
  return s;
}
function sceneB(){
  return '<rect width="300" height="400" fill="#FFE8C2"/><circle cx="120" cy="130" r="62" fill="#FFC078"/>'+
   '<rect y="290" width="300" height="110" fill="#9AD870"/>'+
   '<polygon points="160,205 225,148 290,205" fill="#8D3B2E"/><rect x="170" y="205" width="110" height="95" fill="#D9534F"/>'+
   '<rect x="205" y="245" width="40" height="55" fill="#F8E7C8"/><line x1="205" y1="245" x2="245" y2="300" stroke="#8D3B2E" stroke-width="3"/><line x1="245" y1="245" x2="205" y2="300" stroke="#8D3B2E" stroke-width="3"/>'+
   '<rect x="0" y="300" width="300" height="8" fill="#fff"/><rect x="20" y="285" width="10" height="45" fill="#fff"/><rect x="90" y="285" width="10" height="45" fill="#fff"/>'+
   nested(chick('#FFD43B'),22,262,110,110)+nested(chick('#FFD43B'),130,300,78,78)+nested(chick('#FFD43B'),222,318,64,64)+
   '<ellipse cx="60" cy="70" rx="40" ry="16" fill="#fff"/><ellipse cx="95" cy="60" rx="30" ry="14" fill="#fff"/>';
}

function cloud(x,y,k){
  return '<ellipse cx="'+x+'" cy="'+y+'" rx="'+(44*k)+'" ry="'+(18*k)+'" fill="#fff"/><ellipse cx="'+(x+30*k)+'" cy="'+(y-12*k)+'" rx="'+(30*k)+'" ry="'+(16*k)+'" fill="#fff"/>';
}
function sceneCarton(){
  var s='<rect width="300" height="400" fill="#FFF3D6"/><circle cx="244" cy="62" r="34" fill="#FFD43B"/>'+cloud(70,70,1)+
   '<rect x="25" y="150" width="250" height="215" rx="22" fill="#D9C3A0" stroke="#B99B6A" stroke-width="6"/>';
  var xs=[65,150,235],ys=[195,262,329],k=0;
  ys.forEach(function(cy){xs.forEach(function(cx){
    s+='<circle cx="'+cx+'" cy="'+cy+'" r="31" fill="#B89B72"/>';
    s+=(k===1||k===4||k===8)?nested(chick('#FFD43B'),cx-30,cy-36,60,60):nested(egg,cx-26,cy-28,52,52);
    k++;
  });});
  return s;
}
function scenePond(){
  var s='<rect width="300" height="400" fill="#BFE9FF"/><circle cx="240" cy="60" r="32" fill="#FFE066"/>'+cloud(80,80,1)+cloud(190,140,0.7)+
   '<rect y="240" width="300" height="160" fill="#9AD870"/>'+
   '<ellipse cx="150" cy="322" rx="142" ry="64" fill="#5BB5E8" stroke="#3F9AD0" stroke-width="4"/>'+
   '<ellipse cx="95" cy="332" rx="26" ry="9" fill="#4FA85A"/><ellipse cx="205" cy="312" rx="22" ry="8" fill="#4FA85A"/><ellipse cx="170" cy="352" rx="28" ry="10" fill="#4FA85A"/>'+
   '<circle cx="205" cy="308" r="6" fill="#FF8FB1"/><circle cx="95" cy="328" r="6" fill="#FF8FB1"/>'+
   nested(chick('#FFD43B'),8,180,120,120)+nested(chick('#FFD43B'),140,268,64,64);
  [[270,220],[285,236],[258,240]].forEach(function(p){s+='<rect x="'+p[0]+'" y="'+p[1]+'" width="6" height="'+(300-p[1])+'" fill="#5a8f3a"/><ellipse cx="'+(p[0]+3)+'" cy="'+p[1]+'" rx="6" ry="13" fill="#8D5A2B"/>';});
  return s;
}
function sceneNight(){
  var s='<rect width="300" height="400" fill="#1F2A5A"/><circle cx="228" cy="82" r="42" fill="#FFF4B8"/><circle cx="214" cy="70" r="8" fill="#F0E08F"/><circle cx="240" cy="96" r="6" fill="#F0E08F"/>';
  [[40,50,3],[90,120,2.5],[150,40,3],[60,200,2],[130,170,2.5],[280,170,2.5],[20,130,2],[110,70,2],[190,150,2]].forEach(function(p){s+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+p[2]+'" fill="#fff"/>';});
  s+='<ellipse cx="150" cy="430" rx="280" ry="150" fill="#2F6B4F"/>'+nested(chick('#FFD43B'),82,225,136,136)+nested(egg,28,330,52,52)+nested(egg,222,340,48,48);
  return s;
}
function sceneSun(){
  var s='<rect width="300" height="400" fill="#BDEBFF"/><rect y="300" width="300" height="100" fill="#8ED16F"/>'+cloud(200,60,0.8);
  [[55,130,46],[245,110,40],[150,70,34]].forEach(function(f){
    var x=f[0],y=f[1],r=f[2],a;
    s+='<rect x="'+(x-4)+'" y="'+y+'" width="8" height="'+(330-y)+'" fill="#4E9B3A"/>';
    for(a=0;a<360;a+=36){s+='<ellipse cx="'+x+'" cy="'+(y-r*0.85)+'" rx="'+(r*0.3)+'" ry="'+(r*0.5)+'" fill="#FFC53D" transform="rotate('+a+' '+x+' '+y+')"/>';}
    s+='<circle cx="'+x+'" cy="'+y+'" r="'+(r*0.55)+'" fill="#7A4A21"/>';
  });
  s+=nested(chick('#FFD43B'),84,240,132,132);
  return s;
}
function sceneRainbow(){
  var s='<rect width="300" height="400" fill="#E6F6FF"/>';
  ['#FF6B6B','#FFA94D','#FFD43B','#69DB7C','#74C0FC','#B197FC'].forEach(function(c,i){
    var r=132-i*16;
    s+='<path d="M'+(150-r)+' 300A'+r+' '+r+' 0 0 1 '+(150+r)+' 300" fill="none" stroke="'+c+'" stroke-width="16"/>';
  });
  s+=cloud(40,300,0.9)+cloud(262,300,0.9)+'<ellipse cx="150" cy="420" rx="230" ry="100" fill="#A5DC7B"/>'+
   nested(chick('#FFD43B'),92,262,116,116)+nested(egg,22,330,50,50)+nested(chick('#FFD43B'),226,324,60,60);
  return s;
}
function sceneSnow(){
  var s='<rect width="300" height="400" fill="#DDF1FF"/>',i;
  [[52,230],[250,245]].forEach(function(p){
    s+='<rect x="'+(p[0]-6)+'" y="'+(p[1]+40)+'" width="12" height="40" fill="#8D5A2B"/>'+
       '<polygon points="'+p[0]+','+(p[1]-80)+' '+(p[0]-30)+','+p[1]+' '+(p[0]+30)+','+p[1]+'" fill="#3E8E5E"/>'+
       '<polygon points="'+p[0]+','+(p[1]-40)+' '+(p[0]-40)+','+(p[1]+45)+' '+(p[0]+40)+','+(p[1]+45)+'" fill="#3E8E5E"/>'+
       '<polygon points="'+p[0]+','+(p[1]-80)+' '+(p[0]-12)+','+(p[1]-52)+' '+(p[0]+12)+','+(p[1]-52)+'" fill="#fff"/>';
  });
  s+='<ellipse cx="150" cy="410" rx="270" ry="120" fill="#fff"/>'+nested(chick('#FFD43B'),84,236,132,132)+'<rect x="104" y="330" width="92" height="15" rx="7" fill="#FF6B6B"/><rect x="176" y="330" width="14" height="38" rx="6" fill="#FF6B6B"/>';
  for(i=0;i<26;i++){s+='<circle cx="'+((i*47+13)%300)+'" cy="'+((i*83+21)%330)+'" r="'+(2+(i%3))+'" fill="#fff"/>';}
  return s;
}
var SCENES=[sceneA,sceneB,sceneCarton,scenePond,sceneNight,sceneSun,sceneRainbow,sceneSnow];

window.playPuzzle=function(x){
  var dim=[[2,2],[2,3],[3,3],[3,4],[3,4],[4,4]][Math.min(x.lv,5)],cols=dim[0],rows=dim[1],N=cols*rows;
  var scene=SCENES[pickUnseen('pseen',SCENES.length)]();
  var arr=[],i,sel=-1,won=false;
  for(i=0;i<N;i++)arr.push(i);
  do{arr=shuffle(arr);}while(arr.every(function(v,k){return v===k;}));
  x.stage.innerHTML='<div class="board" id="board" style="grid-template-columns:repeat('+cols+',1fr);grid-template-rows:repeat('+rows+',1fr)"></div>';
  x.ctl.innerHTML='<button class="btn sub" id="peek">👀 완성 그림 보기</button>';
  var board=document.getElementById('board');
  function okCount(){var c=0;arr.forEach(function(v,p){if(v===p)c++;});return c;}
  function render(){
    var h='';
    for(var p=0;p<N;p++){
      var id=arr[p],cx=id%cols,cy=(id/cols)|0;
      var vb=(cx*300/cols)+' '+(cy*400/rows)+' '+(300/cols)+' '+(400/rows);
      h+='<button class="tile'+(id===p?' ok':'')+(sel===p?' sel':'')+'" data-p="'+p+'"><svg viewBox="'+vb+'" preserveAspectRatio="xMidYMid slice">'+scene+'</svg></button>';
    }
    board.innerHTML=h;
    x.score('제자리를 찾은 조각 '+okCount()+' / '+N);
  }
  x.msg('조각 두 개를 차례로 눌러 자리를 바꿔 보세요!');
  board.onclick=function(e){
    if(won)return;
    var t=e.target.closest?e.target.closest('.tile'):null;if(!t)return;
    var p=+t.dataset.p;
    if(arr[p]===p){x.msg('이 조각은 이미 제자리예요 ✔');return;}
    if(sel<0){sel=p;beep(520,.06,'triangle',.1);x.msg('바꿀 조각을 하나 더 눌러 주세요');}
    else if(sel===p){sel=-1;x.msg('조각 두 개를 차례로 눌러 자리를 바꿔 보세요!');}
    else{
      var tmp=arr[sel];arr[sel]=arr[p];arr[p]=tmp;sel=-1;
      if(okCount()===N){
        won=true;render();cheer();x.msg('그림이 완성됐어요! 🎉');
        setTimeout(function(){if(alive(x.t))finish(x,'puzzle','병아리 그림을 맞췄어요!');},1200);
        return;
      }
      peep();x.msg('좋아요! 계속 맞춰 보세요');
    }
    render();
  };
  document.getElementById('peek').onclick=function(){
    var pv=document.createElement('div');pv.className='preview';
    pv.innerHTML='<svg viewBox="0 0 300 400">'+scene+'</svg>';
    board.appendChild(pv);
    setTimeout(function(){if(pv.parentNode)pv.parentNode.removeChild(pv);},3000);
  };
  render();
};
})();
