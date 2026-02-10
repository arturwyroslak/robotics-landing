(function(){
  // Basic Three.js scene with a simple robot-like assembly made from primitives.
  const container = document.getElementById('canvas-container');
  const width = container.clientWidth || window.innerWidth;
  const height = Math.max(320, Math.floor(window.innerHeight * 0.6));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x071026);

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(2.5, 1.2, 3.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 1.2;
  controls.maxDistance = 10;

  // Lights
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  hemi.position.set(0, 2, 0);
  scene.add(hemi);

  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 10, 7.5);
  dir.castShadow = true;
  scene.add(dir);

  // Robot body
  const material = new THREE.MeshStandardMaterial({ color: 0xb0c4de, metalness: 0.4, roughness: 0.45 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 0.5), material);
  body.position.set(0, 0.4, 0);
  scene.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 16), material);
  head.position.set(0, 0.95, 0);
  scene.add(head);

  // Simple arm hierarchy
  const upperArmGeom = new THREE.BoxGeometry(0.15, 0.5, 0.15);
  const lowerArmGeom = new THREE.BoxGeometry(0.13, 0.45, 0.13);

  const leftUpper = new THREE.Mesh(upperArmGeom, material);
  leftUpper.position.set(-0.65, 0.45, 0);
  leftUpper.rotation.z = 0.2;

  const leftLower = new THREE.Mesh(lowerArmGeom, material);
  leftLower.position.set(0, -0.45, 0);
  leftUpper.add(leftLower);
  body.add(leftUpper);

  const rightUpper = leftUpper.clone();
  rightUpper.position.set(0.65, 0.45, 0);
  rightUpper.rotation.z = -0.2;
  rightUpper.children[0].position.set(0, -0.45, 0);
  body.add(rightUpper);

  // Legs
  const legGeom = new THREE.BoxGeometry(0.18, 0.7, 0.18);
  const leftLeg = new THREE.Mesh(legGeom, material);
  leftLeg.position.set(-0.25, -0.35, 0);
  scene.add(leftLeg);
  const rightLeg = leftLeg.clone();
  rightLeg.position.set(0.25, -0.35, 0);
  scene.add(rightLeg);

  // Floor
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x051023, roughness: 0.9, metalness: 0.0 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.7;
  scene.add(floor);

  // Small animation state
  let clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime();
    // gentle bob and head tilt
    body.position.y = 0.4 + Math.sin(t * 1.2) * 0.02;
    head.rotation.y = Math.sin(t * 0.6) * 0.08;

    // arms swing
    leftUpper.rotation.z = 0.2 + Math.sin(t * 2.0) * 0.25;
    rightUpper.rotation.z = -0.2 + Math.cos(t * 2.0) * 0.25;

    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  // Resize handling
  function onResize() {
    const w = container.clientWidth || window.innerWidth;
    const h = Math.max(320, Math.floor(window.innerHeight * 0.6));
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // accessibility: set focusable canvas
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D scene showing a robot');
  renderer.domElement.tabIndex = 0;

  document.getElementById('year').textContent = new Date().getFullYear();

  animate();
})();
