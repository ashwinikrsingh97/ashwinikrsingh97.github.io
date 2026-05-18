/**
 * Advanced 3D Interactive Portfolio
 * Three.js (Data Wave) + GSAP (ScrollTrigger & Animations)
 */

// Initialize Lucide Icons
lucide.createIcons();

// --- 1. Custom Magnetic Cursor ---
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let mouseX = 0, mouseY = 0;
let fX = 0, fY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Instant cursor movement
  cursor.style.left = `${mouseX}px`;
  cursor.style.top = `${mouseY}px`;
});

// Smooth follower animation
const animateFollower = () => {
  fX += (mouseX - fX) * 0.15;
  fY += (mouseY - fY) * 0.15;
  follower.style.left = `${fX}px`;
  follower.style.top = `${fY}px`;
  requestAnimationFrame(animateFollower);
};
animateFollower();

// Magnetic & Hover Effects
const magneticElements = document.querySelectorAll('.magnetic, .btn, .glass-panel');
magneticElements.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hover-active');
    follower.classList.add('hover-active');
  });
  
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hover-active');
    follower.classList.remove('hover-active');
    // Reset transform if it was a slight magnetic pull
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
  });

  // Magnetic Pull logic for specific elements
  if (el.classList.contains('magnetic') || el.classList.contains('magnetic-slight')) {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const pull = el.classList.contains('magnetic-slight') ? 0.1 : 0.3;
      
      gsap.to(el, {
        x: x * pull,
        y: y * pull,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  }
});


// --- 2. Three.js: Interactive Data Wave ---
const canvas = document.querySelector('.webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.03);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 5, 20);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create Particle Wave (Grid of Points)
const particlesCount = 2000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particlesCount * 3);
const scales = new Float32Array(particlesCount);

const gridSize = Math.sqrt(particlesCount);
const spacing = 1.5;

let i = 0;
for (let ix = 0; ix < gridSize; ix++) {
  for (let iz = 0; iz < gridSize; iz++) {
    positions[i * 3] = (ix - gridSize / 2) * spacing;
    positions[i * 3 + 1] = 0; // y controlled in animation loop
    positions[i * 3 + 2] = (iz - gridSize / 2) * spacing;
    
    scales[i] = Math.random();
    i++;
  }
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));

// Custom Shader Material for glowing particles
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#fcee0a') },
    uColor2: { value: new THREE.Color('#ff003c') }
  },
  vertexShader: `
    uniform float uTime;
    attribute float aScale;
    varying float vElevation;
    
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Create a wave effect based on x, z and time
      float elevation = sin(modelPosition.x * 0.2 + uTime) * 
                        sin(modelPosition.z * 0.2 + uTime) * 3.0;
                        
      // Add secondary higher frequency wave
      elevation += sin(modelPosition.x * 0.5 - uTime * 0.5) * 1.0;
      
      modelPosition.y += elevation;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      
      // Point size based on z-depth
      gl_PointSize = (10.0 * aScale) * (1.0 / -viewPosition.z);
      
      vElevation = elevation;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying float vElevation;
    
    void main() {
      // Circular point
      float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
      float strength = 0.05 / distanceToCenter - 0.1;
      
      // Mix colors based on elevation
      float mixStrength = (vElevation + 4.0) / 8.0;
      vec3 color = mix(uColor2, uColor1, mixStrength);
      
      gl_FragColor = vec4(color, strength);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const points = new THREE.Points(geometry, material);
// Rotate slightly so it looks like a landscape going into the distance
points.rotation.x = -Math.PI * 0.1;
scene.add(points);


// Floating Hexagons (Servers/Nodes)
const hexGroup = new THREE.Group();
const hexGeo = new THREE.CylinderGeometry(1, 1, 0.2, 6);
const hexEdges = new THREE.EdgesGeometry(hexGeo);
const hexMat = new THREE.LineBasicMaterial({ color: 0xfcee0a, transparent: true, opacity: 0.3 });

for(let j=0; j<15; j++) {
  const hex = new THREE.LineSegments(hexEdges, hexMat);
  hex.position.x = (Math.random() - 0.5) * 40;
  hex.position.y = (Math.random() - 0.5) * 20 + 5;
  hex.position.z = (Math.random() - 0.5) * 40 - 10;
  
  hex.rotation.x = Math.random() * Math.PI;
  hex.rotation.y = Math.random() * Math.PI;
  
  // Random speed property for animation loop
  hex.userData = {
    rx: (Math.random() - 0.5) * 0.01,
    ry: (Math.random() - 0.5) * 0.01,
    yOffset: Math.random() * Math.PI * 2
  };
  
  hexGroup.add(hex);
}
scene.add(hexGroup);


// --- 3. Animation Loop & Parallax ---
const clock = new THREE.Clock();
let targetCamX = 0;
let targetCamY = 5; // Base camera Y height

document.addEventListener('mousemove', (e) => {
  // Normalize mouse position from -1 to 1
  const nx = (e.clientX / window.innerWidth) * 2 - 1;
  const ny = -(e.clientY / window.innerHeight) * 2 + 1;
  
  targetCamX = nx * 3;
  // Parallax Y offset
  targetCamY = 5 + (ny * 1.5);
});

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  
  // Update Shader Time
  material.uniforms.uTime.value = elapsedTime * 0.5;
  
  // Animate Hexagons
  hexGroup.children.forEach(hex => {
    hex.rotation.x += hex.userData.rx;
    hex.rotation.y += hex.userData.ry;
    hex.position.y += Math.sin(elapsedTime + hex.userData.yOffset) * 0.01;
  });
  
  // Smooth Camera Parallax (Only affects X and Y slightly. Z is controlled by GSAP)
  camera.position.x += (targetCamX - camera.position.x) * 0.05;
  // We use GSAP to control the base Y. So we add the base Y to the parallax target
  camera.position.y += (targetCamY - camera.position.y) * 0.05;
  
  // Always look near the center but slightly forward
  camera.lookAt(0, 0, 0);
  
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


// --- 4. GSAP Scroll Animations ---
gsap.registerPlugin(ScrollTrigger);

// 4.1 HTML Element Animations (Fade Ups)
const fadeUps = document.querySelectorAll('.fade-up, .glass-panel');
fadeUps.forEach(el => {
  gsap.fromTo(el, 
    { y: 50, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    }
  );
});

// Staggered Stats
gsap.fromTo('.stat-card', 
  { y: 30, opacity: 0 },
  {
    y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out",
    scrollTrigger: { trigger: '.stats-grid', start: "top 80%" }
  }
);

// 4.2 Three.js Camera Scroll Timeline
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 1 // Link animation strictly to scroll bar
  }
});

// As we scroll down, dive into the wave and rotate it
tl.to(camera.position, {
  z: -5,
  ease: "none"
}, 0);

tl.to(points.rotation, {
  x: -Math.PI * 0.3, // Tilt the wave up
  ease: "none"
}, 0);

tl.to(material.uniforms.uColor1.value, {
  r: 1.0, // 0xff003c (Pink)
  g: 0.0,
  b: 0.235,
  ease: "none"
}, 0);

tl.to(material.uniforms.uColor2.value, {
  r: 0.0, // 0x00f0ff (Cyan)
  g: 0.941,
  b: 1.0,
  ease: "none"
}, 0);
