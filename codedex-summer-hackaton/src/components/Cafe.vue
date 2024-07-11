<script type="module">
// Imports
import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

let scene, renderer, camera, controls;
// Scene
scene = new THREE.Scene();

// Renderer
renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
document.body.appendChild( renderer.domElement );

// Model loader
const loader = new GLTFLoader();
const model = new URL('../assets/Cafe Model/scene.gltf', import.meta.url).href;

loader.load(model, function (gltf) {
  const cafeModel = gltf.scene;
  scene.add(cafeModel);

  // Calculate the bounding box of the model and get the center
  const boundingBox = new THREE.Box3().setFromObject(cafeModel);
  const center = boundingBox.getCenter(new THREE.Vector3());

  // Place the camera and controls in the center of the model
  camera.position.set(center.x, center.y, center.z);
  controls.target.set(center.x, center.y, center.z);

  controls.update();
}, undefined, function (error) {
  console.error(error);
});

// Cube for reference and easy positioning
const geometry = new THREE.BoxGeometry( 0.5, 0.5, 0.5 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
cube.position.set(-1.5, 1, -2);
scene.add( cube );

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x404040, 50); // soft white light
ambientLight.position.set(-1.5, 1, -2).normalize();
scene.add(ambientLight);

// Camera controls
controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;

// Limits for zooming
controls.minDistance = 1;
controls.maxDistance = 1;

// Limits for vertical movement
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 3;

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resize the renderer with the window
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

</script>

<template>
  <div id="cafe-model"></div>
</template>

<style scoped>

</style>