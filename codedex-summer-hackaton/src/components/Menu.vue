<script setup>
import {ref, onMounted, markRaw} from 'vue';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";

const highlightItem = ref({
      title: 'Highlight of the Day',
      name: 'MATCHA BOBA TEA w COOKIES',
      price: '$5.99',
      modelPath: '/Food Models/bubble_tea_and_cookies/scene.gltf',
      scale: 1,
      cameraPosition: new THREE.Vector3(1, 1.2, 3.5),
    }
);

const menuItems = ref([
  {
    name: 'Cappuccino',
    price: '$4.50(H)',
    modelPath: '/Food Models/cafe_latte_with_art/scene.gltf',
    scale: 2,
    cameraPosition: new THREE.Vector3(-0.1, 0.6, 2.7),
  },
  {
    name: 'Americano',
    price: '$3.75(H)',
    modelPath: '/Food Models/cafe_latte_with_art/scene.gltf',
    scale: 2,
    cameraPosition: new THREE.Vector3(-0.1, 0.6, 2.7),
  },
  {
    name: 'Croissant',
    price: '$3.99',
    modelPath: '/Food Models/croissant__food/scene.gltf',
    scale: 5,
    cameraPosition: new THREE.Vector3(-0.1, 0.2, 1),
  },
  {
    name: 'THE OG',
    price: '$4.25(M)',
    modelPath: '/Food Models/boba_tea_cup/scene.gltf',
    scale: 1,
    cameraPosition: new THREE.Vector3(2.5, 3, 6),
  },
]);

const loadModel = (container, modelPath, scale, cameraPosition) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({alpha: true});
  renderer.setSize(200, 200);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0x404040, 50);
  scene.add(ambientLight);

  const loader = new GLTFLoader();
  loader.load(modelPath, (gltf) => {
    const model = gltf.scene;
    model.scale.set(scale, scale, scale);
    scene.add(model);
  });

  camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  controls.target.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
  controls.update();

  const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };
  animate();
};

onMounted(() => {
  const highlightContainer = document.getElementById('highlight-model');
  loadModel(highlightContainer, highlightItem.value.modelPath, highlightItem.value.scale, highlightItem.value.cameraPosition);

  menuItems.value.forEach((item, index) => {
    const container = document.getElementById(`model-${index}`);
    loadModel(container, item.modelPath, item.scale, item.cameraPosition);
  });
});
</script>

<template>
  <div class="menu-content">
    <div class="highlight-item">
      <h2>{{ highlightItem.title }}</h2>
      <div id="highlight-model"></div>
      <p class="item-name">{{ highlightItem.name }}</p>
      <p class="item-price">{{ highlightItem.price }}</p>
    </div>
    <div class="menu-grid">
      <div v-for="(item, index) in menuItems" :key="index" class="menu-item">
        <div :id="`model-${index}`" class="model-container"></div>
        <div class="item-details">
          <p class="item-name">{{ item.name }}</p>
          <p class="item-price">{{ item.price }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  text-transform: uppercase;
  font-size: 16px;
}

.highlight-item {
  background-color: #dee9d3;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid #f0f0f0;
  border-radius: 20px;
}

.highlight-item #highlight-model {
  width: 200px;
  height: 200px;
  margin: 20px 0;
}

.menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 20px;
}

.menu-item {
  display: flex;
  background-color: #dee9d3;
  padding: 20px;
  border: 2px solid #f0f0f0;
  border-radius: 20px;
}

.model-container {
  width: 200px;
  height: 200px;
}

.item-details {
  flex-grow: 1;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-name {
  font-weight: bold;
}

.item-price {
  color: #859675;
}
</style>