
const SECS=[
  {id:'about',label:'About',line:"Hi, I'm Ashwini. Welcome to my night shift."},
  {id:'skills',label:'Skills',line:'Unix, SQL, AutoSys, mainframe. My everyday toolkit.'},
  {id:'experience',label:'Experience',line:'7+ years keeping banking systems running.'},
  {id:'awards',label:'Awards',line:'Two TCS awards. I am proud of both.'},
  {id:'education',label:'Education',line:'Mechanical engineer by degree, prod engineer by choice.'},
  {id:'contact',label:'Contact',line:'Say hello. I reply faster than a Sev1 SLA.'}
];
const N=SECS.length,$=s=>document.querySelector(s);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const narrow=()=>innerWidth<=900;
let current=-1,glOK=false,incident=null,lampOn=true,talkT=0;

/* ---------- UI ---------- */
const dock=$('#dock'),sheet=$('#sheet'),body=$('#sheetBody'),hotEl=$('#hot'),bubble=$('#bubble');
const dockBtns=SECS.map((s,i)=>{const b=document.createElement('button');b.type='button';b.textContent=s.label;b.onclick=()=>open(i);dock.appendChild(b);return b});
let bubbleT;
function say(text,ms){bubble.textContent=text;talkT=Math.min(3.2,text.length*.05);bubble.classList.remove('gone');clearTimeout(bubbleT);if(ms)bubbleT=setTimeout(()=>bubble.classList.add('gone'),ms)}
function open(i){
  if(i<0)return;current=i;sheet.hidden=false;document.body.classList.add('open');
  $('#sheetKicker').textContent=SECS[i].label;
  body.querySelectorAll('article').forEach(a=>a.hidden=a.dataset.sec!==SECS[i].id);body.scrollTop=0;
  dockBtns.forEach((b,j)=>b.classList.toggle('on',j===i));
  say(SECS[i].line,5000);
  if(glOK)focus(i);
}
function close(){current=-1;sheet.hidden=true;document.body.classList.remove('open');dockBtns.forEach(b=>b.classList.remove('on'));if(glOK)home();}
$('#close').onclick=close;$('#prev').onclick=()=>open((current-1+N)%N);$('#next').onclick=()=>open((current+1)%N);
addEventListener('keydown',e=>{if(e.key==='Escape'&&current>=0)close();if(current>=0&&(e.key==='ArrowRight'||e.key==='ArrowLeft'))open((current+(e.key==='ArrowRight'?1:-1)+N)%N)});
document.addEventListener('click',e=>{const c=e.target.closest('[data-copy]');if(!c)return;
  const done=()=>{c.textContent='Copied';setTimeout(()=>c.textContent='Copy',1500)};
  const fallback=()=>{const a=c.parentElement.querySelector('a'),r=document.createRange();r.selectNodeContents(a);const s=getSelection();s.removeAllRanges();s.addRange(r)};
  try{navigator.clipboard.writeText(c.dataset.copy).then(done,fallback)}catch(err){fallback()}});

/* ---------- 3D ---------- */
const canvas=$('#scene');let renderer;
try{if(!window.THREE)throw 0;renderer=new THREE.WebGLRenderer({canvas,antialias:true})}catch(e){document.body.classList.add('nogl');say(SECS[0].line);bubble.style.transform='translate(24px,220px)';throw new Error('WebGL not available')}
glOK=true;
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.outputEncoding=THREE.sRGBEncoding;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x0c0f1f);
const camera=new THREE.PerspectiveCamera(40,1,.1,100);
const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const mat=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.8,metalness:0},o||{}));
function mesh(geo,m,x,y,z,parent,shadow=true){const o=new THREE.Mesh(geo,m);o.position.set(x||0,y||0,z||0);o.castShadow=shadow;o.receiveShadow=true;(parent||scene).add(o);return o}
const box=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
function canvasTex(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return {c,g:c.getContext('2d'),t}}

/* lights */
scene.add(new THREE.HemisphereLight(0x8a96ff,0x2a2030,.55));
const key=new THREE.DirectionalLight(0xffe2c4,.75);key.position.set(6,9,7);key.castShadow=true;
key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-7,right:7,top:7,bottom:-7,near:1,far:30});key.shadow.bias=-.0008;scene.add(key);
const moon=new THREE.DirectionalLight(0x8fa8ff,.75);moon.position.set(-2,6,-8);scene.add(moon);
const rimL=new THREE.SpotLight(0xa8c4ff,1.4,12,.5,.6);rimL.position.set(-1.5,5,-4.6);rimL.target.position.set(.15,2.2,-2.15);scene.add(rimL,rimL.target);
const faceFill=new THREE.PointLight(0xffd2b0,.55,7,1.5);faceFill.position.set(2.2,3,1);scene.add(faceFill);
const lampLight=new THREE.PointLight(0xffb547,1.6,7,1.6);scene.add(lampLight);
const screenLight=new THREE.PointLight(0x9fe3c4,.9,5,1.8);screenLight.position.set(0,2.4,-3.2);scene.add(screenLight);

/* room */
const wallM=mat(0x1b2045),floorM=mat(0x2a2236,{roughness:.9});
mesh(box(10,.2,10),floorM,0,-.1,0);
mesh(box(10,5.2,.2),wallM,0,2.6,-5.1);
mesh(box(.2,5.2,10),wallM,-5.1,2.6,0);
mesh(box(10,.18,.06),mat(0x2a3163),0,.09,-4.98);mesh(box(.06,.18,10),mat(0x2a3163),-4.98,.09,0);
for(let i=-4;i<5;i+=1){mesh(box(.02,.005,10),mat(0x231c2e),i,.001,0,null,false)}
const rug=mesh(new THREE.CircleGeometry(1.9,48),mat(0x323a6e,{roughness:1}),.2,.01,-1.9,null,false);rug.rotation.x=-Math.PI/2;

/* hotspot registry */
const hotspots={};const pickables=[];
function hot(id,group,anchor){group.traverse(o=>{if(o.isMesh){o.userData.sec=id;pickables.push(o)}});if(!hotspots[id])hotspots[id]={group,anchor};}
function glow(id,on){const h=hotspots[id];if(!h)return;h.group.traverse(o=>{if(o.isMesh&&o.material.emissive&&!o.userData.keepEmissive){o.material.emissive.setHex(on?0x2b5a49:0x000000)}})}

/* desk */
const desk=new THREE.Group();scene.add(desk);
const woodM=mat(0x5b3d2e,{roughness:.6});
mesh(box(4.4,.12,1.5),woodM,0,1.5,-3.9,desk);
[[-2.05,-3.3],[2.05,-3.3],[-2.05,-4.5],[2.05,-4.5]].forEach(p=>mesh(box(.1,1.44,.1),mat(0x1a1a24,{metalness:.6,roughness:.4}),p[0],.72,p[1],desk));

/* monitors with live screens */
const mon1=canvasTex(512,320),mon2=canvasTex(512,320);
const monitors=new THREE.Group();scene.add(monitors);
function monitor(x,ry,tex){const g=new THREE.Group();g.position.set(x,0,-4.05);g.rotation.y=ry;monitors.add(g);
  mesh(box(1.42,.88,.06),mat(0x111320,{metalness:.5,roughness:.4}),0,2.36,0,g);
  const s=mesh(new THREE.PlaneGeometry(1.32,.8),new THREE.MeshBasicMaterial({map:tex.t,toneMapped:false}),0,2.36,.032,g,false);
  mesh(box(.08,.5,.08),mat(0x111320),0,1.75,-.05,g);mesh(box(.5,.04,.3),mat(0x111320),0,1.58,-.05,g);return s}
monitor(-.62,.12,mon1);monitor(.82,-.14,mon2);
mesh(box(1.3,.04,.42),mat(0x1b1d2b),.1,1.58,-3.35,monitors);
mesh(box(.18,.04,.26),mat(0x1b1d2b),.95,1.58,-3.35,monitors);
hot('experience',monitors,V(.1,3.05,-4));

/* phone */
const phoneTex=canvasTex(128,256);
const phone=new THREE.Group();phone.position.set(1.55,1.575,-3.3);phone.rotation.y=-.3;scene.add(phone);
mesh(box(.24,.03,.46),mat(0x0f1018,{metalness:.5,roughness:.3}),0,0,0,phone);
const phoneScreen=mesh(new THREE.PlaneGeometry(.21,.42),new THREE.MeshBasicMaterial({map:phoneTex.t,toneMapped:false}),0,.017,0,phone,false);phoneScreen.rotation.x=-Math.PI/2;
hot('contact',phone,V(1.55,1.85,-3.3));

/* mug + steam */
const mug=new THREE.Group();mug.position.set(-1.05,1.56,-3.2);scene.add(mug);
mesh(new THREE.CylinderGeometry(.13,.12,.26,24),mat(0x9fe3c4,{roughness:.5}),0,.13,0,mug);
const handle=mesh(new THREE.TorusGeometry(.07,.022,8,16),mat(0x9fe3c4,{roughness:.5}),.15,.14,0,mug);
const steam=[0,1,2].map(i=>{const s=mesh(new THREE.SphereGeometry(.05,8,8),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.25}),0,.3,0,mug,false);s.userData.o=i/3;return s});

/* lamp */
const lamp=new THREE.Group();lamp.position.set(-1.75,1.56,-3.9);scene.add(lamp);
const lampM=mat(0x2d3360,{metalness:.4,roughness:.4});
mesh(new THREE.CylinderGeometry(.2,.24,.06,24),lampM,0,.03,0,lamp);
const arm1=mesh(new THREE.CylinderGeometry(.025,.025,.9,8),lampM,.12,.45,.05,lamp);arm1.rotation.z=-.3;
const arm2=mesh(new THREE.CylinderGeometry(.025,.025,.6,8),lampM,.42,.95,.25,lamp);arm2.rotation.set(.6,0,1.1);
const shade=mesh(new THREE.ConeGeometry(.2,.3,24,1,true),mat(0xffb547,{side:THREE.DoubleSide,emissive:0xffb547,emissiveIntensity:.4}),.62,.85,.45,lamp);shade.rotation.set(-.3,0,-.5);shade.userData.keepEmissive=true;
const bulb=mesh(new THREE.SphereGeometry(.07,12,12),new THREE.MeshBasicMaterial({color:0xfff1cf}),.6,.75,.45,lamp,false);
lamp.localToWorld(lampLight.position.set(.6,.7,.45));

/* desk photo frame */
const photoImg=new Image();const photoTex=new THREE.Texture(photoImg);photoTex.encoding=THREE.sRGBEncoding;
photoImg.onload=()=>photoTex.needsUpdate=true;photoImg.src=document.querySelector('.meet img').src;
const pframe=new THREE.Group();pframe.position.set(-1.45,1.56,-4.35);pframe.rotation.set(-.12,.35,0);scene.add(pframe);
mesh(box(.46,.5,.04),mat(0xf2ead8),0,.27,0,pframe);
mesh(new THREE.PlaneGeometry(.38,.42),new THREE.MeshBasicMaterial({map:photoTex}),0,.27,.022,pframe,false);

/* chair + character */
const rig=new THREE.Group();rig.position.set(.15,0,-2.15);scene.add(rig);
const chairM=mat(0x22263f,{roughness:.6});
mesh(new THREE.CylinderGeometry(.05,.05,.7,10),mat(0x777b90,{metalness:.8,roughness:.3}),0,.45,0,rig);
for(let i=0;i<5;i++){const a=i/5*Math.PI*2;const l=mesh(box(.06,.05,.55),mat(0x15172a),Math.sin(a)*.27,.08,Math.cos(a)*.27,rig);l.rotation.y=a}
mesh(new THREE.CapsuleGeometry(.42,.3,8,20).rotateZ(Math.PI/2).scale(1,.3,1.05),chairM,0,.86,0,rig);
const back=mesh(new THREE.CapsuleGeometry(.45,.5,8,20).scale(1.05,1,.25),chairM,0,1.62,-.55,rig);back.rotation.x=-.1;

/* materials: warm skin, textured mint blazer like the real one */
const P=(o)=>new THREE.MeshPhysicalMaterial(o);
const weave=document.createElement('canvas');weave.width=weave.height=128;{const g=weave.getContext('2d');g.fillStyle='#b9d1c2';g.fillRect(0,0,128,128);
  g.strokeStyle='#9fbcaa';g.lineWidth=2.2;for(let y=0;y<128;y+=8){g.beginPath();for(let x=0;x<=128;x+=8)g.lineTo(x,y+((x/8)%2?4:0));g.stroke()}
  g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=1;for(let y=4;y<128;y+=8){g.beginPath();for(let x=0;x<=128;x+=8)g.lineTo(x,y+((x/8)%2?4:0));g.stroke()}}
const weaveT=new THREE.CanvasTexture(weave);weaveT.wrapS=weaveT.wrapT=THREE.RepeatWrapping;weaveT.repeat.set(6,4);weaveT.encoding=THREE.sRGBEncoding;weaveT.anisotropy=4;
const skin=P({color:0x7e472b,roughness:.52,sheen:.3,sheenColor:new THREE.Color(0xd77a55),sheenRoughness:.6,clearcoat:.04});
const hairM=P({color:0x120d0b,roughness:.6,clearcoat:.1});
const blazer=P({map:weaveT,color:0xffffff,roughness:.9,sheen:.3,sheenColor:new THREE.Color(0xf2fff7),sheenRoughness:.8});
const blazerDk=P({map:weaveT,color:0xc6d9cd,roughness:.9});
const shirt=P({color:0xf3f3ef,roughness:.6});
const pants=P({color:0x1f2436,roughness:.8,sheen:.2,sheenColor:new THREE.Color(0x8890a8)});
const shoeM=P({color:0x2a1d16,roughness:.3,clearcoat:.7}),sole=mat(0x111111,{roughness:.7});
const sph=(r,w=32,h=24)=>new THREE.SphereGeometry(r,w,h);
function limb(r1,r2,len,seg=28){const g=new THREE.CylinderGeometry(r1,r2,len,seg,4);g.translate(0,-len/2,0);return g}
const lathe=(pts,seg=48)=>new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),seg);
const flat=o=>{o.castShadow=false;return o};

