/* ---------- character behaviour ---------- */
const FACE_CAM=.62;let mode='idle',waveT=0,lookAt=null,tadaT=0,blinkT=2.5,blinkHold=0,glanceT=3,glance={y:0,x:0};
SP.swivel.x=SP.swivel.t=FACE_CAM;rig.rotation.y=FACE_CAM;
function angleTo(p){return Math.atan2(p.x-rig.position.x,p.z-rig.position.z)}
function setSwivel(a){let d=a-SP.swivel.x;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;
  SP.swivel.t=SP.swivel.x+d;SP.swivel.v-=Math.sign(d)*Math.min(1,Math.abs(d))*.9; // anticipation wind-up
  SP.squash.v-=.8}
function turnTo(id){if(id==='about'){setSwivel(FACE_CAM);mode='idle';lookAt=null;wave();return}
  const a=hotspots[id].anchor;setSwivel(angleTo(a));
  if(id==='experience'){mode='type';lookAt=null;setMood('focus')}else{mode='point';lookAt=a;setMood('happy',2.5)}}
function wave(){waveT=2.4;SP.squash.v-=2.5;setMood('happy',3)}
function tada(){tadaT=.9;SP.squash.v-=4.5;SP.squash.x=.92;setMood('happy',2.5)}
let lineIdx=0;const LINES=["Hi, I'm Ashwini. Welcome to my night shift.","Batch is green. Coffee is hot.","Try the Page me button. I dare you.","I've handled 10–15 incidents a day. Bring it on.","Click my bookshelf to see my toolkit."];
const gazeRay=new THREE.Raycaster(),gp=V(0,0,0),HEAD_LOCAL=V(0,2.54,-.1);
function gazeAt(world){gp.copy(world);rig.worldToLocal(gp).sub(HEAD_LOCAL);return {y:Math.atan2(gp.x,gp.z),x:Math.atan2(gp.y,Math.hypot(gp.x,gp.z))}}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function stepCharacter(dt,t){
  if(moodHold>0){moodHold-=dt;if(moodHold<=0&&!incident&&mode!=='type')mood='neutral'}
  let M=MOODS[mood];if(mood==='neutral'&&hover==='about')M=MOODS.curious;
  /* gaze: eyes lead, head follows, body last */
  let g={y:0,x:-.1};
  if(incident&&!incident.acked)g=gazeAt(phone.position);
  else if(mode==='type'||mode==='rush'){g={y:Math.sin(t*(mode==='rush'?2.6:.6))*.18,x:-.12}}
  else if(mode==='point'&&lookAt)g=gazeAt(lookAt);
  else{
    g=gazeAt(camera.position);g.y*=.6;g.x*=.6; // relaxed look toward the viewer, not the cursor
    {glanceT-=dt;if(glanceT<0){glanceT=1.5+Math.random()*2.5;glance=Math.random()<.5?{y:0,x:0}:{y:(Math.random()-.5)*.9,x:(Math.random()-.5)*.4}}g.y+=glance.y;g.x+=glance.x}
  }
  const rel=g.y-(SP.swivel.x-rig.rotation.y);g.y=clamp(g.y,-1.2,1.2);g.x=clamp(g.x,-.6,.6);
  SP.headY.t=g.y*.78;SP.headX.t=g.x*.75;SP.spineY.t=g.y*.18;
  SP.eyeY.t=clamp(g.y-SP.headY.x-SP.spineY.x,-.45,.45);SP.eyeX.t=clamp(g.x-SP.headX.x,-.3,.3);
  SP.headZ.t=-SP.swivel.v*.07+Math.sin(t*.55)*.04+(M===MOODS.curious?.14:0);
  SP.spineZ.t=SP.swivel.v*.05+Math.sin(t*.38)*.02;
  SP.spineX.t=mode==='rush'?.2:mode==='type'?.1:(incident&&!incident.acked)?.12:0;
  /* face */
  blinkT-=dt;if(blinkT<0){blinkHold=.09;blinkT=1.8+Math.random()*3.5;if(Math.random()<.2)blinkT=.25}
  if(blinkHold>0)blinkHold-=dt;
  SP.lid.t=blinkHold>0?0:M.lid;SP.squint.t=M.squint;SP.browY.t=M.browY;SP.browR.t=M.browR;SP.smile.t=M.smile;
  SP.open.t=talkT>0?.2+.45*Math.abs(Math.sin(t*13))*Math.abs(Math.sin(t*4.7)):tadaT>0?.55:mood==='happy'?.12:0;
  /* arms */
  const A=(n,sx,sz,ex,ez,wx,wz)=>{SP[n+'sx'].t=sx;SP[n+'sz'].t=sz;SP[n+'ex'].t=ex;SP[n+'ez'].t=ez;SP[n+'wx'].t=wx||0;SP[n+'wz'].t=wz||0};
  A('L',-.32,.16,-1.15,-.08,.1);A('R',-.32,-.16,-1.15,.08,.1);
  if(mode==='type'||mode==='rush'){const f=mode==='rush'?24:11;A('L',-.68,.12,-1.0+Math.sin(t*f)*.13,0,.25+Math.sin(t*f)*.2);A('R',-.68,-.12,-1.0+Math.sin(t*f+1.9)*.13,0,.25+Math.sin(t*f+1.9)*.2)}
  if(mode==='point')A('R',-1.45,-.12,-.15,0,-.1);
  if(incident&&!incident.acked){A('R',-.85,-.1,-.75,0,.2)} // calmly reaches for the phone
  if(waveT>0){waveT-=dt;A('R',-.25,-2.6,0,-.45+Math.sin(t*9)*.6,0)}
  if(tadaT>0){tadaT-=dt;A('L',-.5,1.05,-.3,0,0);A('R',-.5,-1.05,-.3,0,0)}
  ['L','R'].forEach(n=>{SP[n+'wz'].t+= -SP[n+'ez'].v*.06}); // follow-through on the wrist
  if(talkT>0)talkT-=dt;
  /* integrate */
  const steps=Math.ceil(dt/.008),h=dt/steps;for(let i=0;i<steps;i++)for(const k in SP)SP[k].step(h);
  /* apply */
  rig.rotation.y=SP.swivel.x;
  const sq=SP.squash.x,br=1+Math.sin(t*1.8)*.014;
  spine.scale.set(1/Math.sqrt(sq),sq*br,1/Math.sqrt(sq));
  spine.rotation.set(SP.spineX.x,SP.spineY.x,SP.spineZ.x);
  chest.rotation.x=SP.spineX.x*.4;
  neck.rotation.set(-SP.headX.x*.35,SP.headY.x*.3,SP.headZ.x*.3);
  head.rotation.set(-SP.headX.x*.65,SP.headY.x*.7,SP.headZ.x*.7);
  head.scale.set(1/Math.sqrt(sq)*.5+.5,1/sq*.5+.5,1); // head counter-squash, softer
  eyes.forEach(e=>{e.ball.rotation.set(-SP.eyeX.x,SP.eyeY.x,0);
    e.lidU.rotation.x=.25-SP.lid.x*1.32-SP.eyeX.x*.35;e.lidL.rotation.x=1.1-SP.squint.x*.62;
    e.brow.position.y=.024+SP.browY.x*.25+(mood==='neutral'&&hover==='about'&&e.s>0?.005:0);e.brow.rotation.z=e.s*SP.browR.x});
  const sm=SP.smile.x;smileArc.scale.set(1+Math.max(0,sm)*.25,clamp(sm,-1,1.3)||.01,1);
  const op=Math.max(0,SP.open.x);mouthIn.scale.y=.05+op*.75;teeth.visible=op>.12;teeth.position.y=.003+op*.005;smileArc.position.y=.002+op*.008;
  ckL.position.y=ckR.position.y=.088+SP.squint.x*.008;
  [['L',armL],['R',armR]].forEach(([n,a])=>{a.sh.rotation.set(SP[n+'sx'].x,0,SP[n+'sz'].x);a.el.rotation.set(SP[n+'ex'].x,0,SP[n+'ez'].x);a.wr.rotation.set(SP[n+'wx'].x,0,SP[n+'wz'].x)});
}

/* ---------- interaction ---------- */
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),mouse=new THREE.Vector2();
const ptr=new Map();let drag=0,pinch=0,lastMove=0,hover=null;
function pick(e){const r=canvas.getBoundingClientRect();ndc.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(ndc,camera);
  const h=ray.intersectObjects(pickables,false);return h.length?h[0].object.userData.sec:null}
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});drag=0});
canvas.addEventListener('pointermove',e=>{
  mouse.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);
  const p=ptr.get(e.pointerId);
  if(!p){const s=pick(e);if(s!==hover){if(hover)glow(hover,false);hover=s;if(s)glow(s,true)}canvas.style.cursor=s?'pointer':'grab';return}
  lastMove=performance.now();
  if(ptr.size===2){p.x=e.clientX;p.y=e.clientY;const q=[...ptr.values()];const d=Math.hypot(q[0].x-q[1].x,q[0].y-q[1].y);if(pinch)goal.r=Math.min(24,Math.max(3.5,goal.r*pinch/d));pinch=d;drag+=20;return}
  const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;drag+=Math.abs(dx)+Math.abs(dy);
  goal.th=Math.min(1.45,Math.max(.08,goal.th-dx*.005));goal.ph=Math.min(1.45,Math.max(.6,goal.ph-dy*.004));
});
function up(e){const tap=ptr.size===1&&drag<6;ptr.delete(e.pointerId);if(ptr.size<2)pinch=0;
  if(tap&&e.type==='pointerup'){const s=pick(e);
    if(s==='contact'&&incident){ack();return}
    if(s==='about'&&current===0){tada();say(LINES[lineIdx++%LINES.length],4000);return}
    if(s){open(SECS.findIndex(x=>x.id===s));return}
    if(hitLamp(e)){toggleLamp();return}
    if(current>=0)close()}}
canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
canvas.addEventListener('wheel',e=>{e.preventDefault();goal.r=Math.min(24,Math.max(3.5,goal.r*(1+Math.sign(e.deltaY)*.08)))},{passive:false});
const lampParts=[];lamp.traverse(o=>{if(o.isMesh)lampParts.push(o)});
function hitLamp(e){ray.setFromCamera(ndc,camera);return ray.intersectObjects(lampParts,false).length>0}
function toggleLamp(){lampOn=!lampOn;document.body.classList.toggle('lamp-off',!lampOn);$('#lampBtn').setAttribute('aria-pressed',lampOn);
  say(lampOn?'Lights on.':'Monitor glow only. Classic 2 AM.',2500)}
$('#lampBtn').onclick=toggleLamp;

/* Sev1 */
const alarm=$('#alarm'),toast=$('#toast');let toastT;
$('#pageBtn').onclick=()=>{if(incident)return;if(current>=0)close();incident={t0:performance.now(),acked:false};screenState='down';drawScreens('down');
  alarm.hidden=false;toast.hidden=true;spots.contact.classList.add('hot');setSwivel(angleTo(V(1.55,1.6,-3.3)));mode='idle';setMood('focus');
  say('Sev1 alert. Let me take a look.',0)};
function ack(){if(!incident||incident.acked)return;incident.acked=true;const s=(performance.now()-incident.t0)/1000;incident.ack=s;
  alarm.hidden=true;spots.contact.classList.remove('hot');screenState='fixing';drawScreens('fixing');setSwivel(angleTo(hotspots.experience.anchor));mode='rush';setMood('focus');
  say('Acked. Checking logs, restarting the job...',0);
  setTimeout(()=>{screenState='ok';logs.push('SNOW INC RESOLVED · RCA LOGGED');drawScreens('ok');mode='idle';incident=null;setSwivel(FACE_CAM);tada();
    say('Fixed. Root cause noted for the morning call.',4500);
    let best=null;try{best=parseFloat(localStorage.getItem('aks2am-ack'))||null;if(!best||s<best)localStorage.setItem('aks2am-ack',s.toFixed(2))}catch(e){}
    toast.textContent=`Resolved. You acked in ${s.toFixed(1)}s`+(best&&s>=best?` (best ${best.toFixed(1)}s)`:best?' · new best':'');toast.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>toast.hidden=true,4500)},reduce?800:3200)}
setInterval(()=>{if(incident&&!incident.acked)$('#alarmT').textContent=((performance.now()-incident.t0)/1000).toFixed(1)+'s'},100);

/* resize */
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();if(current<0)home();else focus(current)}
addEventListener('resize',resize);resize();
const hi=SECS.findIndex(s=>'#'+s.id===location.hash);
setTimeout(()=>{if(hi>=0)open(hi);else{wave();say(LINES[0],5000)}},600);

/* ---------- loop ---------- */
const tmp=V(0,0,0),wp=V(0,0,0);let last=performance.now(),t=0,blink=3;
const lerp=(a,b,k)=>a+(b-a)*k;
function angLerp(a,b,k){let d=b-a;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;return a+d*k}
function frame(now){
  const dt=Math.min((now-last)/1000,.05);last=now;t+=dt;
  const k=1-Math.exp(-dt*3);
  cam.th+=(goal.th-cam.th)*k;cam.ph+=(goal.ph-cam.ph)*k;cam.r+=(goal.r-cam.r)*k;cam.t.lerp(goal.t,k);
  camera.position.set(cam.t.x+cam.r*Math.sin(cam.ph)*Math.sin(cam.th),cam.t.y+cam.r*Math.cos(cam.ph),cam.t.z+cam.r*Math.sin(cam.ph)*Math.cos(cam.th));camera.lookAt(cam.t);

  stepCharacter(dt,t);

  /* props */
  steam.forEach(s=>{const p=(t*.35+s.userData.o)%1;s.position.y=.3+p*.5;s.position.x=Math.sin(p*6+s.userData.o*5)*.04;s.material.opacity=.25*(1-p);s.scale.setScalar(1+p*1.5)});
  if(incident&&!incident.acked){phone.position.x=1.55+Math.sin(t*60)*.012;phone.rotation.y=-.3+Math.sin(t*50)*.05}else{phone.position.x=1.55;phone.rotation.y=-.3}
  lampLight.intensity=lerp(lampLight.intensity,lampOn?1.6:0,.1);bulb.material.color.setHex(lampOn?0xfff1cf:0x444444);shade.material.emissiveIntensity=lampOn?.4:0;
  const alertGlow=incident?(.5+.5*Math.sin(t*8)):0;
  screenLight.color.setHex(screenState==='down'?0xff5468:0x9fe3c4);screenLight.intensity=.9+alertGlow*1.2;
  const d=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'}));
  hS.rotation.z=-d.getSeconds()/60*Math.PI*2;hM.rotation.z=-(d.getMinutes()+d.getSeconds()/60)/60*Math.PI*2;hH.rotation.z=-((d.getHours()%12)+d.getMinutes()/60)/12*Math.PI*2;

  /* DOM overlays */
  const W=innerWidth,H=innerHeight;
  SECS.forEach((s,i)=>{const b=spots[s.id];tmp.copy(hotspots[s.id].anchor).project(camera);
    if(tmp.z>1){b.style.visibility='hidden';return}b.style.visibility='visible';
    b.style.transform=`translate(${(tmp.x*.5+.5)*W-13}px,${(-tmp.y*.5+.5)*H-13}px)`;b.classList.toggle('on',current===i)});
  head.getWorldPosition(wp);wp.y+=.55;tmp.copy(wp).project(camera);
  bubble.style.transform=`translate(${Math.min(W-260,(tmp.x*.5+.5)*W+30)}px,${Math.max(70,(-tmp.y*.5+.5)*H-70)}px)`;

  renderer.render(scene,camera);requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
