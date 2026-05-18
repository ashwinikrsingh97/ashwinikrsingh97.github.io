/**
 * Advanced 3D Interactive Portfolio
 * Three.js (Interactive Cyber-Fluid Grid) + GSAP (ScrollTrigger) + DOM Interactions
 */

// Initialize Lucide Icons
lucide.createIcons();

// --- 1. Custom Magnetic & Interactive Cursor ---
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let fX = 0, fY = 0;
let rawMouseX = 0, rawMouseY = 0; // Normalized -1 to 1

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  rawMouseX = (e.clientX / window.innerWidth) * 2 - 1;
  rawMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  
  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;
});

// Cursor Click Effect
document.addEventListener('mousedown', () => {
  gsap.to(cursor, { scale: 0.5, duration: 0.1 });
  gsap.to(follower, { scale: 1.5, borderColor: '#00f0ff', duration: 0.1 });
});
document.addEventListener('mouseup', () => {
  gsap.to(cursor, { scale: 1, duration: 0.2 });
  gsap.to(follower, { scale: 1, borderColor: 'rgba(255, 255, 255, 0.3)', duration: 0.2 });
});

// --- Smooth Cursor Follower Animation ---
const animateFollower = () => {
  fX += (mouseX - fX) * 0.15;
  fY += (mouseY - fY) * 0.15;
  follower.style.left = `${fX}px`;
  follower.style.top = `${fY}px`;
  
  requestAnimationFrame(animateFollower);
};
animateFollower();

// Magnetic Links & Hover Details
const magneticElements = document.querySelectorAll('.magnetic, .btn, a');
const hoverTargets = document.querySelectorAll('.magnetic, .btn, .glass-panel, .stat-card, a');
// Hover cursor target effect
hoverTargets.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover-active');
    follower.classList.add('hover-active');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover-active');
    follower.classList.remove('hover-active');
  });
});

// Magnetic pull effect
magneticElements.forEach((el) => {
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
  });
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const pull = 0.3;
    gsap.to(el, { x: x * pull, y: y * pull, duration: 0.3, ease: 'power2.out' });
  });
});

// Subtle Slide Effect for Cards & Panels
const slideElements = document.querySelectorAll('.stat-card, .glass-panel');
slideElements.forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const xPct = (x / rect.width - 0.5) * 2; // -1 to 1
    const yPct = (y / rect.height - 0.5) * 2; // -1 to 1
    
    const slideMax = 4; // Shift up to 4 pixels
    const slideX = xPct * slideMax;
    const slideY = yPct * slideMax;
    
    gsap.to(el, {
      x: slideX,
      y: slideY,
      rotationX: 0,
      rotationY: 0,
      ease: "power1.out",
      duration: 0.3,
      boxShadow: `${-slideX * 2}px ${-slideY * 2}px 20px rgba(0, 240, 255, 0.1)`
    });
  });
  
  el.addEventListener('mouseleave', () => {
    gsap.to(el, {
      x: 0,
      y: 0,
      rotationX: 0,
      rotationY: 0,
      ease: "power2.out",
      duration: 0.5,
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)" // Reset to default glassmorphism shadow
    });
  });
});


// --- 2. Three.js: Interactive Cyber-Fluid Grid ---
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.02);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 15, 20);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const gridSize = 150;
const particlesCount = gridSize * gridSize;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);
const originalPositions = new Float32Array(particlesCount * 3);
const scales = new Float32Array(particlesCount);

const spacing = 0.6;
let i = 0;
for (let ix = 0; ix < gridSize; ix++) {
  for (let iz = 0; iz < gridSize; iz++) {
    const x = (ix - gridSize / 2) * spacing;
    const y = 0;
    const z = (iz - gridSize / 2) * spacing;
    
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    
    originalPositions[i * 3] = x;
    originalPositions[i * 3 + 1] = y;
    originalPositions[i * 3 + 2] = z;
    
    scales[i] = Math.random();
    i++;
  }
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('aOriginalPosition', new THREE.BufferAttribute(originalPositions, 3));
geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

// Interactive Shader Material
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uMouse3D: { value: new THREE.Vector3(0, -1000, 0) },
    uMouseRadius: { value: 6.0 },
    uMouseForce: { value: 3.5 },
    uShockwaveCenter: { value: new THREE.Vector3(0, -1000, 0) },
    uShockwaveTime: { value: 999.0 }, // High start value so it's inactive
    uWaveAmplitude: { value: 0.2 },
    uColorBase: { value: new THREE.Color('#03102a') },
    uColorActive: { value: new THREE.Color('#005c66') },
    uColorScroll: { value: new THREE.Color('#3d0012') }
  },
  vertexShader: `
    uniform float uTime;
    uniform vec3 uMouse3D;
    uniform float uMouseRadius;
    uniform float uMouseForce;
    
    uniform vec3 uShockwaveCenter;
    uniform float uShockwaveTime;
    
    uniform float uWaveAmplitude;
    uniform vec3 uColorBase;
    uniform vec3 uColorActive;
    uniform vec3 uColorScroll;
    
    attribute float aScale;
    attribute vec3 aOriginalPosition;
    
    varying vec3 vColor;
    varying float vActiveRatio;
    
    void main() {
      vec3 pos = aOriginalPosition;
      
      // 1. Base ambient wave
      float wave = sin(pos.x * 0.2 + uTime) * cos(pos.z * 0.2 + uTime) * uWaveAmplitude;
      pos.y += wave;
      
      // 2. Interactive Mouse Attraction (Gravity Vortex)
      float distToMouse = distance(vec3(pos.x, 0.0, pos.z), vec3(uMouse3D.x, 0.0, uMouse3D.z));
      float attraction = smoothstep(uMouseRadius * 1.5, 0.0, distToMouse);
      
      if (attraction > 0.0) {
        // Pull towards mouse on XZ plane
        vec3 directionToMouse = normalize(vec3(uMouse3D.x, pos.y, uMouse3D.z) - pos);
        
        // Swirl effect (cross product with UP vector)
        vec3 swirl = cross(directionToMouse, vec3(0.0, 1.0, 0.0));
        
        // Apply pull and swirl
        pos += directionToMouse * attraction * (uMouseForce * 0.5);
        pos += swirl * attraction * (uMouseForce * 0.8);
        
        // Lift up to form a peak/tornado
        pos.y += attraction * uMouseForce * 2.5;
      }
      
      // 3. Click Shockwave Effect
      float shockDist = distance(pos, uShockwaveCenter);
      float shockRadius = uShockwaveTime * 30.0; // Shockwave expands rapidly
      float shockThickness = 3.0;
      float shockPower = max(0.0, shockThickness - abs(shockDist - shockRadius)) / shockThickness;
      
      // Fade shockwave over time
      shockPower *= max(0.0, 1.0 - uShockwaveTime * 0.5);
      
      if (shockPower > 0.0) {
        pos.y += shockPower * 8.0; // Jump up on shockwave
      }
      
      // 4. Colors
      vActiveRatio = max(attraction, shockPower); // Highlight for both mouse and shockwave
      
      // Shift active color to a fiery/neon pink for the vortex
      vec3 activeColor = vec3(1.0, 0.0, 0.5); 
      vec3 mixedColor = mix(uColorBase, activeColor, attraction);
      float waveRatio = smoothstep(0.0, 3.0, wave);
      vec3 finalColor = mix(mixedColor, uColorScroll, waveRatio);
      
      // Flash white on shockwave
      vColor = mix(finalColor, vec3(1.0, 1.0, 1.0), shockPower);
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      
      gl_PointSize = (4.0 * aScale + attraction * 20.0 + shockPower * 20.0) * (1.0 / -mvPosition.z);
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vActiveRatio;
    
    void main() {
      float dist = distance(gl_PointCoord, vec2(0.5));
      if(dist > 0.5) discard;
      float alpha = (0.5 - dist) * (2.0 + vActiveRatio * 2.0);
      gl_FragColor = vec4(vColor, alpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const points = new THREE.Points(geometry, material);
points.rotation.x = -Math.PI * 0.1;
scene.add(points);


// Floating Interactive Data Cores (Hexagons)
const shapeGroup = new THREE.Group();
const shapeGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.5, 6);
const shapeMat = new THREE.MeshBasicMaterial({ 
  color: 0x00f0ff, 
  wireframe: true,
  transparent: true,
  opacity: 0.1
});

for(let j=0; j<8; j++) {
  const mesh = new THREE.Mesh(shapeGeo, shapeMat);
  mesh.position.set(
    (Math.random() - 0.5) * 30,
    Math.random() * 5 + 2,
    (Math.random() - 0.5) * 30
  );
  mesh.userData = {
    rx: (Math.random() - 0.5) * 0.02,
    ry: (Math.random() - 0.5) * 0.02,
    originY: mesh.position.y
  };
  shapeGroup.add(mesh);
}
scene.add(shapeGroup);


// --- 3. Animation Loop, Raycaster & Interaction ---
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const mouseVec = new THREE.Vector2();

const planeGeo = new THREE.PlaneGeometry(200, 200);
planeGeo.rotateX(-Math.PI / 2);
const planeMat = new THREE.MeshBasicMaterial({ visible: false });
const intersectPlane = new THREE.Mesh(planeGeo, planeMat);
scene.add(intersectPlane);

const smoothMouse3D = new THREE.Vector3(0, -100, 0);
let targetCamX = 0;
let targetCamY = 15;

// Global Click Event for 3D Shockwave
document.addEventListener('mousedown', () => {
  if (smoothMouse3D.y > -50) { // Only if mouse is currently over the grid
    material.uniforms.uShockwaveCenter.value.copy(smoothMouse3D);
    material.uniforms.uShockwaveTime.value = 0.0;
  }
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - material.uniforms.uTime.value;
  material.uniforms.uTime.value = elapsedTime;
  
  // Progress shockwave
  if (material.uniforms.uShockwaveTime.value < 5.0) {
    material.uniforms.uShockwaveTime.value += deltaTime;
  }
  
  // Raycast
  mouseVec.x = rawMouseX;
  mouseVec.y = rawMouseY;
  raycaster.setFromCamera(mouseVec, camera);
  
  const intersects = raycaster.intersectObject(intersectPlane);
  if (intersects.length > 0) {
    smoothMouse3D.lerp(intersects[0].point, 0.15);
    material.uniforms.uMouse3D.value.copy(smoothMouse3D);
  } else {
    smoothMouse3D.lerp(new THREE.Vector3(0, -100, 0), 0.05);
    material.uniforms.uMouse3D.value.copy(smoothMouse3D);
  }
  
  // Data Cores react to mouse and shockwave
  shapeGroup.children.forEach(mesh => {
    mesh.rotation.x += mesh.userData.rx;
    mesh.rotation.y += mesh.userData.ry;
    
    mesh.position.y = mesh.userData.originY + Math.sin(elapsedTime * 2 + mesh.userData.originY) * 0.5;
    
    // Elements calmly return to original Y without orbiting mouse
    
    // Repel from shockwave
    const shockDist = mesh.position.distanceTo(material.uniforms.uShockwaveCenter.value);
    const shockRadius = material.uniforms.uShockwaveTime.value * 30.0;
    if(Math.abs(shockDist - shockRadius) < 3.0 && material.uniforms.uShockwaveTime.value < 2.0) {
       mesh.position.y += 2.0; // Pop up
       mesh.rotation.x += 0.2; // Spin faster
       mesh.rotation.y += 0.2;
    }
    
    mesh.position.y += (mesh.userData.originY - mesh.position.y) * 0.02;
  });
  
  targetCamX = rawMouseX * 5;
  camera.position.x += (targetCamX - camera.position.x) * 0.05;
  
  camera.lookAt(0, 0, 0);
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


// --- 4. GSAP Scroll Animations ---
gsap.registerPlugin(ScrollTrigger);

const fadeUps = document.querySelectorAll('.fade-up');
fadeUps.forEach(el => {
  gsap.fromTo(el, 
    { y: 50, opacity: 0 },
    {
      y: 0, opacity: 1, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" }
    }
  );
});

// 4.2 Interactive Grid Scroll Timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1 
  }
});

tl.to(camera.position, {
  y: 2,
  z: 15,
  ease: "power1.inOut"
}, 0);

tl.to(points.rotation, {
  x: -Math.PI * 0.45,
  ease: "power2.inOut"
}, 0);

tl.to(material.uniforms.uWaveAmplitude, {
  value: 1.2,
  ease: "power1.inOut"
}, 0);

tl.to(material.uniforms.uMouseRadius, {
  value: 12.0,
  ease: "none"
}, 0);
tl.to(material.uniforms.uMouseForce, {
  value: 8.0,
  ease: "none"
}, 0);

tl.to(material.uniforms.uColorBase.value, {
  r: 0.02, g: 0.0, b: 0.08,
  ease: "none"
}, 0);
tl.to(material.uniforms.uColorActive.value, {
  r: 0.3, g: 0.3, b: 0.0,
  ease: "none"
}, 0);
