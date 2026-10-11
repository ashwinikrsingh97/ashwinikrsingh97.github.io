/* character built in metres, scaled 2x to match the room */
const ch=new THREE.Group();ch.scale.setScalar(2);rig.add(ch);
const hips=new THREE.Group();hips.position.set(0,.49,-.06);ch.add(hips);
mesh(sph(.14),pants,0,0,-.01,hips).scale.set(1.08,.7,.95);
[-1,1].forEach(s=>{const hip=new THREE.Group();hip.position.set(s*.095,0,.02);hip.rotation.x=-Math.PI/2+.05;hips.add(hip);
  mesh(sph(.09),pants,0,0,0,hip);mesh(limb(.09,.068,.44),pants,0,0,0,hip);
  const knee=new THREE.Group();knee.position.y=-.44;knee.rotation.x=Math.PI/2-.05;hip.add(knee);mesh(sph(.069),pants,0,0,0,knee);
  mesh(limb(.066,.056,.42),pants,0,0,0,knee);
  const ank=new THREE.Group();ank.position.y=-.43;knee.add(ank);
  mesh(sph(.06),shoeM,0,-.035,.045,ank).scale.set(.95,.62,1.95);
  mesh(new THREE.BoxGeometry(.105,.018,.245),sole,0,-.065,.05,ank)});

const spine=new THREE.Group();spine.position.y=.03;hips.add(spine);
mesh(lathe([[.001,-.16],[.165,-.16],[.17,-.08],[.158,.04],[.17,.18],[.19,.3],[.19,.4],[.165,.47],[.1,.52],[.001,.53]]),blazer,0,0,0,spine).scale.set(1.12,1,.74);
const vee=new THREE.Shape();vee.moveTo(-.085,.5);vee.quadraticCurveTo(0,.52,.085,.5);vee.lineTo(.008,.1);vee.lineTo(-.008,.1);vee.closePath();
const v=flat(mesh(new THREE.ShapeGeometry(vee,10),shirt,0,0,.152,spine));v.rotation.x=-.06;
[-1,1].forEach(s=>{const lp=new THREE.Shape();lp.moveTo(0,0);lp.lineTo(s*.03,0);lp.lineTo(s*.11,.3);lp.lineTo(s*.09,.38);lp.lineTo(s*.075,.36);lp.closePath();
  const m=flat(mesh(new THREE.ShapeGeometry(lp),blazerDk,s*.01,.12,.156,spine));m.rotation.x=-.06;m.rotation.y=s*.12});
mesh(sph(.011,12,10),P({color:0x8fa59a,roughness:.4}),0,.06,.134,spine);mesh(sph(.011,12,10),P({color:0x8fa59a,roughness:.4}),0,-.04,.13,spine);
mesh(sph(.012,12,10),mat(0x0c0c0c,{roughness:.3}),.06,.34,.15,spine); // lav mic
flat(mesh(new THREE.BoxGeometry(.07,.006,.01),blazerDk,-.1,.34,.142,spine)).rotation.y=-.3;
const chest=new THREE.Group();chest.position.y=.44;spine.add(chest);
[-1,1].forEach(s=>mesh(sph(.075),blazer,s*.17,0,-.005,chest).scale.set(1.1,.85,1));

const neck=new THREE.Group();neck.position.y=.08;chest.add(neck);
mesh(limb(.052,.058,.11,20).translate(0,.1,0),skin,0,0,.005,neck);
[-1,1].forEach(s=>{const c=new THREE.Shape();c.moveTo(0,0);c.lineTo(s*.06,-.005);c.lineTo(s*.035,-.07);c.closePath();
  flat(mesh(new THREE.ShapeGeometry(c),shirt,s*.022,.04,.05,neck)).rotation.set(-.35,s*.5,0)});
mesh(new THREE.TorusGeometry(.058,.012,8,24,Math.PI*1.2),shirt,0,.03,0,neck).rotation.set(Math.PI/2,0,Math.PI*1.4);

const head=new THREE.Group();head.position.set(0,.1,.01);neck.add(head);
const H=new THREE.Group();H.scale.setScalar(1.12);head.add(H);
mesh(sph(.104,48,36),skin,0,.115,0,H).scale.set(.93,1.13,1.02);
mesh(sph(.088,40,28),skin,0,.06,.016,H).scale.set(1.05,.86,1);
mesh(new THREE.SphereGeometry(.093,44,24,-.35,Math.PI+.7,Math.PI*.46,Math.PI*.46),hairM,0,.058,.016,H).scale.set(1.04,.9,1.04);
mesh(sph(.034,24,18),hairM,0,.022,.068,H).scale.set(1.2,.75,.75);
mesh(new THREE.TorusGeometry(.024,.0075,10,20,Math.PI),hairM,0,.075,.1,H).scale.set(1.15,.5,.6);
const ckL=mesh(sph(.022,16,12),skin,-.045,.088,.082,H),ckR=mesh(sph(.022,16,12),skin,.045,.088,.082,H);[ckL,ckR].forEach(c=>c.visible=false);
const mouthG=new THREE.Group();mouthG.position.set(0,.061,.104);H.add(mouthG);
const mouthIn=mesh(sph(.014,16,12),mat(0x2a0c08,{roughness:.6}),0,0,0,mouthG);mouthIn.scale.set(1.2,.05,.35);
const teeth=mesh(new THREE.BoxGeometry(.02,.0045,.004),mat(0xf6f3ea,{roughness:.3}),0,.003,.003,mouthG);
const smileArc=mesh(new THREE.TorusGeometry(.016,.0028,6,16,Math.PI),P({color:0x3a1a14,roughness:.5}),0,.002,.004,mouthG);smileArc.rotation.z=Math.PI;
mesh(sph(.019,20,16),skin,0,.097,.106,H).scale.set(1.05,1,1.05);
mesh(new THREE.CapsuleGeometry(.009,.03,6,10),skin,0,.118,.1,H).rotation.x=-.25;
[-1,1].forEach(s=>mesh(sph(.026,20,16),skin,s*.097,.112,-.004,H).scale.set(.42,1,.72));
const hcap=mesh(new THREE.SphereGeometry(.104,44,24,0,Math.PI*2,0,Math.PI*.47),hairM,0,.126,-.006,H);hcap.scale.set(.95,1.13,1.03);hcap.rotation.x=-.5;
[[-.045,.2,.045,.04],[0,.208,.05,.044],[.045,.2,.045,.04],[-.03,.208,0,.046],[.03,.208,-.005,.046],[0,.198,-.05,.046],[0,.212,.02,.04]].forEach(p=>mesh(sph(p[3],24,16),hairM,p[0],p[1],p[2],H).scale.set(.9,.5,.9));
const quiff=mesh(sph(.04,24,16),hairM,.005,.212,.07,H);quiff.scale.set(1.35,.6,.7);quiff.rotation.x=-.5;
const eyeW=P({color:0xf6f2ea,roughness:.12,clearcoat:1});
const eyes=[-1,1].map(s=>{const sock=new THREE.Group();sock.position.set(s*.036,.127,.084);H.add(sock);
  const ball=new THREE.Group();sock.add(ball);mesh(sph(.0165,24,18),eyeW,0,0,0,ball);
  const ir=mesh(sph(.0112,20,16),P({color:0x3a1e10,roughness:.2,clearcoat:1}),0,0,.0118,ball);ir.scale.z=.4;
  const pu=mesh(sph(.0062,14,12),new THREE.MeshBasicMaterial({color:0x050303}),0,0,.0152,ball);pu.scale.z=.3;
  mesh(sph(.0026,8,8),new THREE.MeshBasicMaterial({color:0xffffff}),.004,.004,.0168,ball);
  const lidU=mesh(new THREE.SphereGeometry(.0178,24,12,0,Math.PI*2,0,Math.PI/2),skin,0,0,0,sock);
  const lidL=mesh(new THREE.SphereGeometry(.0172,24,12,0,Math.PI*2,Math.PI/2,Math.PI/2),skin,0,0,0,sock);
  const brow=new THREE.Group();brow.position.set(0,.024,.006);sock.add(brow);
  mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(-.016,-.002,0),V(.002,.004,.004),V(.02,0,-.002)]),12,.0045,6,false),hairM,0,0,0,brow).scale.x=-s;
  return {s,ball,lidU,lidL,brow}});

function arm(s){const sh=new THREE.Group();sh.position.set(s*.185,0,-.005);chest.add(sh);
  mesh(sph(.058),blazer,0,0,0,sh);mesh(limb(.058,.048,.29),blazer,0,0,0,sh);
  const el=new THREE.Group();el.position.y=-.29;sh.add(el);mesh(sph(.049),blazer,0,0,0,el);
  mesh(limb(.048,.042,.24),blazer,0,0,0,el);mesh(limb(.036,.036,.03),shirt,0,-.23,0,el);
  const wr=new THREE.Group();wr.position.y=-.255;el.add(wr);
  mesh(new THREE.CapsuleGeometry(.03,.035,8,16),skin,0,-.045,0,wr).scale.set(1.15,1,.55);
  [-.024,-.008,.008,.024].forEach((x,i)=>{const f=new THREE.Group();f.position.set(x*s,-.078,0);f.rotation.x=.45+i*.05;wr.add(f);
    const L=[.032,.038,.036,.03][i];mesh(new THREE.CapsuleGeometry(.0078,L,6,10).translate(0,-L/2-.004,0),skin,0,0,0,f)});
  const th=new THREE.Group();th.position.set(-s*.03,-.03,.012);th.rotation.set(.3,0,-s*.6);wr.add(th);mesh(new THREE.CapsuleGeometry(.009,.03,6,10).translate(0,-.02,0),skin,0,0,0,th);
  return {sh,el,wr}}
const armL=arm(1),armR=arm(-1);
hot('about',rig,V(.15,3.25,-2.1));
hot('about',pframe,V(-1.45,2.2,-4.35));

/* ---------- springs: the secret to fluid motion ---------- */
class Spring{constructor(v,k,d){this.x=v;this.v=0;this.t=v;this.k=k;this.d=d}
  step(dt){const a=this.k*(this.t-this.x)-this.d*this.v;this.v+=a*dt;this.x+=this.v*dt;return this.x}}
const SP={};const sp=(n,v,k,d)=>SP[n]=new Spring(v,k,d);
sp('swivel',.62,38,8.5);           // chair turn, slight overshoot
sp('spineX',0,45,8);sp('spineZ',0,45,8);sp('spineY',0,40,9);
sp('headY',0,70,11);sp('headX',0,70,11);sp('headZ',0,50,8);
sp('eyeY',0,500,40);sp('eyeX',0,500,40);
sp('lid',1,700,45);sp('squint',0,200,22);
sp('browY',0,180,16);sp('browR',0,180,16);
sp('smile',.6,150,14);sp('open',0,400,28);
sp('squash',1,220,9);              // squash & stretch, bouncy
['L','R'].forEach(a=>{sp(a+'sx',-.3,150,15);sp(a+'sz',0,150,15);sp(a+'ex',-1.2,150,15);sp(a+'ez',0,130,12);sp(a+'wx',0,90,7);sp(a+'wz',0,90,7)});
const MOODS={neutral:{browY:0,browR:0,lid:1,squint:0,smile:.55},happy:{browY:.025,browR:.12,lid:.95,squint:.55,smile:1},
  focus:{browY:-.02,browR:-.18,lid:.82,squint:.15,smile:.15},alarm:{browY:.05,browR:.15,lid:1.25,squint:0,smile:-.4},curious:{browY:.035,browR:.05,lid:1.08,squint:0,smile:.7}};
let mood='neutral',moodHold=0;
function setMood(m,hold){mood=m;moodHold=hold||0}

/* bookshelf */
const shelf=new THREE.Group();shelf.position.set(-4.68,0,-.6);scene.add(shelf);
const shelfM=mat(0x4a3428,{roughness:.7});
mesh(box(.6,3.7,.06),shelfM,0,1.85,-1.1,shelf);mesh(box(.6,3.7,.06),shelfM,0,1.85,1.1,shelf);mesh(box(.04,3.7,2.2),shelfM,-.28,1.85,0,shelf);
const bookCols=[0x9fe3c4,0xffb547,0xff7a8a,0x7d8cff,0xe8e2d0,0x4fb39a,0xc08a5a];
for(let r=0;r<6;r++){const y=.08+r*.6;mesh(box(.6,.05,2.2),shelfM,0,y,0,shelf);
  if(r===5)break;let z=-1.02;let k=r*3;
  while(z<.95){const w=.08+Math.random()*.08,h=.36+Math.random()*.16;if(Math.random()<.12){z+=.12;continue}
    const b=mesh(box(.4,h,w),mat(bookCols[(k++)%bookCols.length],{roughness:.75}),0,y+.025+h/2,z+w/2,shelf);if(Math.random()<.08)b.rotation.x=.18;z+=w+.01}}
hot('skills',shelf,V(-4.5,3.9,-.6));

/* trophy shelf */
const tro=new THREE.Group();tro.position.set(3.05,3.0,-4.75);scene.add(tro);
mesh(box(1.9,.08,.42),shelfM,0,0,0,tro);
const gold=mat(0xe6b450,{metalness:.85,roughness:.25});
[-.45,.45].forEach((x,i)=>{mesh(box(.32,.12,.26),mat(0x2b2b38),x,.1,0,tro);mesh(new THREE.CylinderGeometry(.03,.05,.22,10),gold,x,.27,0,tro);
  mesh(new THREE.CylinderGeometry(.19,.07,.3,20),gold,x,.53,0,tro);[-1,1].forEach(s=>{const h=mesh(new THREE.TorusGeometry(.08,.018,8,14,Math.PI),gold,x+s*.19,.55,0,tro);h.rotation.z=s>0?-Math.PI/2:Math.PI/2})});
hot('awards',tro,V(3.05,3.85,-4.75));

/* diploma */
const dipTex=canvasTex(512,360);{const g=dipTex.g;g.fillStyle='#f4eedd';g.fillRect(0,0,512,360);g.strokeStyle='#b89a5a';g.lineWidth=10;g.strokeRect(18,18,476,324);
  g.fillStyle='#3a2f20';g.textAlign='center';g.font='600 22px Georgia,serif';g.fillText('ACADEMY OF TECHNOLOGY',256,90);
  g.font='italic 44px Georgia,serif';g.fillText('Bachelor of Technology',256,170);g.font='26px Georgia,serif';g.fillText('Mechanical Engineering',256,220);
  g.font='22px Georgia,serif';g.fillText('Ashwini Kumar Singh · 2018',256,285);g.fillStyle='#c24a3a';g.beginPath();g.arc(430,290,26,0,7);g.fill();dipTex.t.needsUpdate=true}
const dip=new THREE.Group();dip.position.set(-2.9,3.25,-4.98);scene.add(dip);
mesh(box(1.25,.92,.06),mat(0x2a1e16),0,0,0,dip);mesh(new THREE.PlaneGeometry(1.1,.78),new THREE.MeshStandardMaterial({map:dipTex.t,roughness:.9}),0,0,.035,dip,false);
hot('education',dip,V(-2.9,3.85,-4.95));

/* window with skyline */
const sky=canvasTex(768,384);
function drawSky(){const g=sky.g,W=768,H=384;const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#0a0d24');gr.addColorStop(1,'#2a2560');g.fillStyle=gr;g.fillRect(0,0,W,H);
  for(let i=0;i<70;i++){g.fillStyle=`rgba(255,255,255,${Math.random()*.7})`;g.fillRect(Math.random()*W,Math.random()*H*.6,1.5,1.5)}
  g.fillStyle='#f6f1da';g.beginPath();g.arc(620,80,30,0,7);g.fill();g.fillStyle='#1c1f45';g.beginPath();g.arc(608,72,28,0,7);g.fill();
  let x=0;while(x<W){const w=30+Math.random()*60,h=80+Math.random()*190;g.fillStyle='#121530';g.fillRect(x,H-h,w,h);
    for(let wy=H-h+10;wy<H-8;wy+=16)for(let wx=x+6;wx<x+w-8;wx+=12)if(Math.random()<.28){g.fillStyle=Math.random()<.8?'#ffcf73':'#9fe3c4';g.fillRect(wx,wy,5,7)}x+=w+4}
  sky.t.needsUpdate=true}
drawSky();
const win=new THREE.Group();win.position.set(.4,3.75,-4.99);scene.add(win);
mesh(new THREE.PlaneGeometry(2.9,1.45),new THREE.MeshBasicMaterial({map:sky.t,toneMapped:false}),0,0,.02,win,false);
const winM=mat(0x2c3160);[[0,.76,3.04,.08],[0,-.76,3.04,.08]].forEach(p=>mesh(box(p[2],p[3],.1),winM,p[0],p[1],.05,win));
[-1.48,0,1.48].forEach(x=>mesh(box(.08,1.6,.1),winM,x,0,.05,win));mesh(box(3.2,.08,.3),winM,0,-.84,.15,win);

/* clock on left wall (live IST) */
const clock=new THREE.Group();clock.position.set(-4.98,3.9,2.4);clock.rotation.y=Math.PI/2;scene.add(clock);
const face=mesh(new THREE.CylinderGeometry(.5,.5,.06,40),mat(0xeeeadf),0,0,0,clock);face.rotation.x=Math.PI/2;
const rim=mesh(new THREE.TorusGeometry(.5,.04,8,40),mat(0x2a2e55),0,0,.02,clock);
for(let i=0;i<12;i++){const a=i/12*Math.PI*2;mesh(box(.03,i%3?.05:.1,.01),mat(0x222222),Math.sin(a)*.4,Math.cos(a)*.4,.04,clock,false).rotation.z=-a}
const hand=(l,w,c)=>{const g=new THREE.Group();g.position.z=.05;clock.add(g);mesh(box(w,l,.01),mat(c),0,l/2,0,g,false);return g};
const hH=hand(.24,.035,0x1b1d2b),hM=hand(.36,.025,0x1b1d2b),hS=hand(.38,.01,0xff5468);

/* plant */
const plant=new THREE.Group();plant.position.set(4.1,0,-4.1);scene.add(plant);
mesh(new THREE.CylinderGeometry(.38,.3,.7,20),mat(0xd96d4f),0,.35,0,plant);
for(let i=0;i<9;i++){const l=mesh(new THREE.SphereGeometry(.3,10,8),mat(i%2?0x3e8f6a:0x2f7a58),0,0,0,plant);const a=i/9*Math.PI*2;
  l.scale.set(.35,1.3,.12);l.position.set(Math.sin(a)*.25,1.1+Math.random()*.3,Math.cos(a)*.25);l.rotation.set(Math.cos(a)*.5,a,-Math.sin(a)*.5)}

/* hotspot DOM */
const spots={};SECS.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='spot';
  b.innerHTML=`<i></i><b>${s.label}</b>`;b.setAttribute('aria-label',s.label);b.onclick=()=>{if(incident&&s.id==='contact')ack();else open(i)};
  b.onpointerenter=()=>glow(s.id,true);b.onpointerleave=()=>glow(s.id,hover===s.id);hotEl.appendChild(b);spots[s.id]=b});

/* ---------- screens ---------- */
const logs=[];const R=(a,b)=>Math.floor(a+Math.random()*(b-a));
const LG=[()=>`AUTOSYS EOD_SETTLE_${R(10,99)} SUCCESS`,()=>`SDSF JOB${R(10000,99999)} RC=0000`,()=>`KIBANA err 0.0${R(1,4)}% OK`,()=>`SNOW INC${R(1000000,9999999)} RESOLVED`,()=>`APPD p95 ${R(170,240)}ms OK`,()=>`OCP pod ues-api READY`,()=>`IBM-DS RECON COMPLETE`];
for(let i=0;i<9;i++)logs.push(LG[R(0,LG.length)]());
const bars=Array.from({length:22},()=>40+Math.random()*60);
function ist(){return new Date().toLocaleTimeString('en-GB',{timeZone:'Asia/Kolkata',hour12:false})}
function drawScreens(state){
  const red=state==='down',fix=state==='fixing';
  let g=mon1.g;g.fillStyle=red?'#2a0710':'#071815';g.fillRect(0,0,512,320);
  g.fillStyle=red?'#ff5468':'#9fe3c4';g.fillRect(0,0,512,40);g.fillStyle='#0c0f1f';g.font='bold 20px monospace';
  g.fillText(red?'SEV1 · PAYMENTS BATCH DOWN':fix?'WORKING · RESTARTING JOB':'UES-PROD · ALL GREEN',14,27);
  g.font='17px monospace';logs.slice(-9).forEach((l,i)=>{g.fillStyle=red&&i>6?'#ff5468':(i%3?'#b9f3d9':'#ffcf73');g.fillText(`${l}`,14,72+i*27)});
  mon1.t.needsUpdate=true;
  g=mon2.g;g.fillStyle='#0e1230';g.fillRect(0,0,512,320);g.fillStyle='#a8afcc';g.font='18px monospace';g.fillText('p95 latency (ms)',18,32);
  g.fillStyle='#eef0f8';g.font='bold 18px monospace';g.fillText(`IST ${ist()}`,330,32);
  bars.forEach((b,i)=>{g.fillStyle=red&&i>17?'#ff5468':'#7d8cff';const h=red&&i>17?230:b*2;g.fillRect(18+i*22,300-h,16,h)});
  g.strokeStyle='#ffb547';g.setLineDash([6,6]);g.beginPath();g.moveTo(10,120);g.lineTo(502,120);g.stroke();g.setLineDash([]);g.fillStyle='#ffb547';g.font='14px monospace';g.fillText('SLA',470,112);
  mon2.t.needsUpdate=true;
  g=phoneTex.g;g.fillStyle=red?'#ff5468':'#151a3a';g.fillRect(0,0,128,256);g.fillStyle=red?'#fff':'#9fe3c4';g.textAlign='center';
  g.font='bold 22px sans-serif';g.fillText(red?'SEV1':ist().slice(0,5),64,110);g.font='13px sans-serif';g.fillText(red?'Tap to ack':'No alerts',64,140);g.textAlign='left';phoneTex.t.needsUpdate=true;
}
let screenState='ok';drawScreens('ok');
setInterval(()=>{if(screenState==='ok'){logs.push(LG[R(0,LG.length)]());bars.shift();bars.push(40+Math.random()*60)}else if(screenState==='fixing'){logs.push(['kill -9 stuck pid','sendevent -E FORCE_STARTJOB','tail -f batch.log','RC=0000 ✓','commit; -- data ok'][R(0,5)])}drawScreens(screenState)},reduce?2000:700);

/* ---------- camera rig ---------- */
const cam={th:.72,ph:1.12,r:14,t:V(-.3,1.9,-1.6)},goal={th:.72,ph:1.12,r:14,t:V(-.3,1.9,-1.6)};
const VIEWS={about:{t:V(.15,2.3,-2.1),th:.55,ph:1.2,r:5.2},skills:{t:V(-4.4,1.9,-.6),th:1.25,ph:1.2,r:6.4},experience:{t:V(.1,2.3,-3.9),th:.3,ph:1.0,r:5.4},
  awards:{t:V(3.05,3.3,-4.7),th:.3,ph:1.3,r:4.2},education:{t:V(-2.9,3.25,-4.9),th:.3,ph:1.35,r:4.3},contact:{t:V(1.4,1.7,-3.3),th:.6,ph:.95,r:3.8}};
function home(){goal.th=.72;goal.ph=1.12;goal.r=narrow()?17:11.5;goal.t.set(-.4,narrow()?1.2:2,-2);if(!narrow()&&innerWidth>1100)goal.t.x-=.2}
function focus(i){const v=VIEWS[SECS[i].id];goal.th=v.th;goal.ph=v.ph;goal.r=v.r*(narrow()?1.45:1);goal.t.copy(v.t);
  const right=V(Math.cos(goal.th),0,-Math.sin(goal.th));
  if(narrow())goal.t.y-=v.r*.32;else goal.t.addScaledVector(right,v.r*.42);
  turnTo(SECS[i].id)}
home();cam.r=goal.r+5;cam.th=goal.th+.25;cam.t.copy(goal.t);

