(() => {
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll()];
const Animals=[
{name:'Kelinci',w:'Wortel',cost:20,range:120,dmg:6,rate:60,color:'#ff6600'},
{name:'Kura-kura',w:'Selada',cost:25,range:110,dmg:8,rate:70,color:'#00aa55'},
{name:'Bug',w:'Panci',cost:30,range:130,dmg:10,rate:80,color:'#34c759'},
{name:'Bebek',w:'Gelembung',cost:22,range:115,dmg:5,rate:50,color:'#ffcc00'},
{name:'Kucing',w:'Benang',cost:28,range:125,dmg:7,rate:60,color:'#ff99cc'},
{name:'Anjing',w:'Tulang',cost:24,range:120,dmg:6,rate:55,color:'#cc9966'},
{name:'Sandal Ronda',w:'Sandal',cost:18,range:100,dmg:9,rate:90,color:'#996633'},
{name:'Katak',w:'Lalat',cost:20,range:105,dmg:5,rate:45,color:'#66cc33'},
{name:'Gajah',w:'Semangka',cost:50,range:140,dmg:18,rate:120,color:'#9999ff'},
{name:'Panda',w:'Bambu',cost:35,range:120,dmg:9,rate:75,color:'#eeeeee'},
{name:'Beruang',w:'Madu',cost:45,range:125,dmg:13,rate:95,color:'#aa6633'},
{name:'Monke',w:'Pisang',cost:30,range:118,dmg:8,rate:65,color:'#ff9933'},
{name:'Serigala Air',w:'Es',cost:60,range:150,dmg:20,rate:110,color:'#66ccff'}
];
const Maps=[
{name:'Sungai Numbo 1',path:[[0,80],[300,80],[300,200],[600,200],[600,80],[960,80]],slots:[[100,40],[250,40],[250,160],[450,160],[450,240],[750,120],[850,40]]},
{name:'Sungai Numbo 2',path:[[0,270],[250,270],[250,80],[500,80],[500,270],[750,270],[750,140],[960,140]],slots:[[100,220],[200,220],[350,40],[600,40],[650,220],[850,100]]},
{name:'Sungai Lapisan Kayu',path:[[0,270],[960,270]],slots:[[80,220],[180,220],[300,220],[420,220],[540,220],[660,220],[820,220]],move:true},
{name:'RajaMahalawa Malam',path:[[0,80],[240,80],[240,270],[480,270],[480,80],[720,80],[720,270],[960,270]],slots:[[80,40],[300,220],[360,40],[620,220],[580,40],[820,220]],night:true},
{name:'Gunung Purba 3D',ship:true}
];
let mapI=0,level=0,money=120,placed=[],enemies=[],sh=0,running=false,sel=null,shipTime=180,cam=0,col=0;
const cv=$('#cv'),x=cv.getContext('2d');
window.show=id=>{['intro','maps','game'].forEach(i=>$('#'+i).classList.toggle('hidden',i!==id))};
window.exitGame=()=>{running=false;show('maps')};
$('#btnStart').onclick=()=>show('maps');
$('#btnBack').onclick=()=>alert('BUGGAMES dev Bawapi — Check the Water');
$$('#maps [data-map]').forEach(b=>b.onclick=()=>{if(b.dataset.map==='4'&&level<0){} start(+b.dataset.map)});
$$('#maps [data-mini]').forEach(b=>b.onclick=()=>{mapI=2;level=6;start(2,b.dataset.mini)});
$('#shop').innerHTML=Animals.map((a,i)=>`<div class="card" data-i="${i}"><i>${a.name[0]}</i><b>${a.name}</b><small>${a.w} • ${a.cost}</small></div>`).join('');
$$('#shop .card').forEach(c=>c.onclick=()=>{sel=Animals[+c.dataset.i];$$('#shop .card').forEach(y=>y.classList.remove('sel'));c.classList.add('sel');$('#info').textContent=c.dataset.i+' — tap slot tepi sungai'});
function start(mi,mini){mapI=mi;placed=[];enemies=[];level=0;money=120;shipTime=180;running=true;show('game');$('#ship').classList.toggle('hidden',!Maps[mi].ship);spawn();loop()}
function spawn(){let m=Maps[mapI];enemies=[];if(m.ship)return;
let n=6+level*2,boss=(level%7===6);
for(let i=0;i<n;i++)enemies.push({p:-i*2,hp:40+level*25,spd:0.8+level*0.08,boss:false});
if(boss)enemies.push({p:-n*2,hp:400+level*80,spd:0.8,boss:true});
$('#hud').textContent=`${m.name} Lv ${level+1}/7 • Cpin ${money}`;if(m.move)$('#info').textContent='Kayu gerak! Tap kayu buat lompat ke kayu berikut ⛵';else if(m.night)$('#info').textContent='Malam! Batu Bulan akan jatuhkan 1 hewan!';else $('#info').textContent='Tap slot 👉 buaya lewat!'}
cv.onclick=e=>{let r=cv.getBoundingClientRect(),mx=(e.clientX-r.left)*(cv.width/r.width),my=(e.clientY-r.top)*(cv.height/r.height);
if(Maps[mapI].ship){let en=enemies[0];if(en&&Math.abs(mx-en.x)<40&&Math.abs(my-en.y)<30){en.hp-=40;if(en.hp<=0){enemies.shift();money+=100;$('#msg').textContent='BOOM! +100 Cpin'}}return}
let m=Maps[mapI];
for(let s of m.slots){let sx=s[0]+(m.move?Math.sin(Date.now()/900)*30:0);if(Math.abs(mx-sx)<28&&Math.abs(my-s[1])<28&&sel){if(money<sel.cost){$('#msg').textContent='Cpin kurang!'}else{money-=sel.cost;placed.push({x:sx,y:s[1],a:sel,t:0});$('#hud').textContent=`${m.name} Lv ${level+1}/7 • Cpin ${money}`}sel=null;$$('#shop .card').forEach(c=>c.classList.remove('sel'));break}}
if(m.move){for(let s of m.slots){let sx=s[0]+Math.sin(Date.now()/900)*30;if(Math.abs(mx-sx)<40&&Math.abs(my-s[1])<30){$('#msg').textContent='Kamu lompat ke kayu berikut!'}}}
};
function loop(){if(!running)return;requestAnimationFrame(loop);tick()}
function tick(){x.clearRect(0,0,960,540);let m=Maps[mapI];
if(m.ship){shipTime-=1/60;$('#shipTime').textContent=`Sisa: ${Math.max(0,shipTime|0)}s — tap monster!`;
x.fillStyle='#87ceeb';x.fillRect(0,0,960,300);x.fillStyle='#0a2a6b';x.fillRect(0,300,960,240);
x.fillStyle='#5d4420';x.fillRect(320,380,320,80);x.fillRect(300,360,40,100);
for(let i=0;i<3;i++){x.fillStyle='#4a3318';x.fillRect(360+i*70,340,50,80)}
if(Math.random()<0.02)enemies.push({x:960+Math.random()*100,y:260+Math.random()*80,hp:120+level*40,spd:1+rnd()});
enemies.forEach(e=>{e.x-=e.spd*2;x.fillStyle='#1a5c2e';x.fillRect(e.x,e.y,70,26);x.fillStyle='#fff';x.fillRect(e.x+50,e.y+6,10,8)});
enemies=enemies.filter(e=>e.x>250);if(shipTime<=0){$('#msg').textContent='KAPAL KEBALIK! Coba lagi!';running=false}
if(enemies.length===0&&shipTime>0)spawn();return}
if(m.night){x.fillStyle='#050a1e';x.fillRect(0,0,960,540);x.fillStyle='#fff3b0';x.beginPath();x.arc(860,60,28,0,7);x.fill();x.fillStyle='#111';x.fillRect(830,40,40,40);if(Math.random()<0.005&&placed.length){placed.shift();$('#msg').textContent='Batu Bulan tabrakan! 1 hewan hancur sendiri!'}}
else{x.fillStyle='#7baed6';x.fillRect(0,0,960,540);x.fillStyle='#5b8a3c';x.fillRect(0,0,960,540)}
// river
x.strokeStyle='#0d4a7a';x.lineWidth=70;x.lineJoin='round';x.beginPath();m.path.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();
x.strokeStyle='#4ec3ff';x.lineWidth=6;x.stroke();
// slots
m.slots.forEach(s=>{let sx=s[0]+(m.move?Math.sin(Date.now()/900)*30:0);x.fillStyle=m.move?'#8b6b3d':'#d6c48a';x.fillRect(sx-28,s[1]-14,56,28);x.strokeStyle='#0003';x.strokeRect(sx-28,s[1]-14,56,28)});
// towers shoot
placed.forEach(t=>{x.fillStyle=t.a.color;x.beginPath();x.arc(t.x,t.y,18,0,7);x.fill();x.fillStyle='#fff';x.font='bold 16px sans-serif';x.fillText(t.a.name[0],t.x-5,t.y+6);t.t++;let tgt=enemies.find(e=>dist(e,t)<t.a.range);if(tgt&&t.t>t.a.rate){t.t=0;tgt.hp-=t.a.dmg;spawnShot(t,tgt);if(tgt.hp<=0){tgt.dead=true;money+=20;$('#hud').textContent=`${m.name} Lv ${level+1}/7 • Cpin ${money}`}}});
enemies.forEach(e=>{let pts=m.path;let seg=e.p|0,f=e.p-seg;if(seg>=pts.length-1){e.dead=true;$('#msg').textContent='Buaya lolos!';return}let a=pts[seg],b=pts[seg+1],ex=lerp(a[0],b[0],f),ey=lerp(a[1],b[1],f);let sz=e.boss?48:22;e.x=ex;e.y=ey;x.fillStyle='#1a5c2e';x.beginPath();x.ellipse(ex,ey,sz+18,sz,0,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(ex+18,ey-8,7,0,7);x.fill();if(e.boss){x.fillStyle='#5b2e8a';x.fillRect(ex-20,ey-40,40,10);x.fillStyle='#f44';x.fillRect(ex-20,ey-40,40*Math.max(0,e.hp/(400+level*80)),10)}e.p+=e.spd/60});
enemies=enemies.filter(e=>!e.dead);
if(enemies.length===0){level=(level+1)%7;spawn();if(level===0){$('#msg').textContent='HABIS 7 LEVEL! Bis main ulang / Boss / Buaya!'}else $('#msg').textContent=`Level ${level+1} mulai!`}
}
function spawnShot(t,e){x.fillStyle=t.a.color;x.fillRect((t.x+e.x)/2,(t.y+e.y)/2,8,8)}
function dist(e,t){let pts=Maps[mapI].path;let a=pts[Math.min(pts.length-2,e.p|0)]||[0,0];return Math.hypot(a[0]-t.x,a[1]-t.y)+ (e.p*6)}
const lerp=(a,b,t)=>a+(b-a)*t;
const rnd=()=>Math.random()*1;}
)();
