<script>
import * as THREE from 'three';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import Menu from "../components/Menu.vue";
import Schedule from "../components/Schedule.vue";
import {getCurrentInstance, markRaw, onMounted, onUnmounted, watch} from 'vue';
import {store} from '../store';

export default {
  components: {
    Schedule,
    Menu,
  },
  data() {
    return {
      interactionCues: markRaw([]),
      showSchedule: false,
      camera: null,
      controls: null,
      renderer: null,
      scene: null,
      initialCameraPosition: null,
      initialControlsPosition: null,
      disableInteraction: false,
    };
  },
  mounted() {
    this.initThreeJs();
    this.storeInitialCameraState();
  },
  setup() {

    const instance = getCurrentInstance();

    const clickHandler = (event) => {
      console.log('Click event detected');
      instance.proxy.onDocumentMouseDown(event);
    };

    onMounted(() => {
      window.addEventListener('click', clickHandler);
    });

    onUnmounted(() => {
      window.removeEventListener('click', clickHandler);
    });

    watch([() => store.showSchedule, () => store.showMenu], ([newShowSchedule, newShowMenu]) => {
      if (!newShowSchedule && !newShowMenu) {
        instance.proxy.resetCamera();
      }
    });

    return {clickHandler};
  },
  methods: {
    initThreeJs() {
      this.instance = getCurrentInstance();
      const {proxy} = this.instance;
      this.scene = markRaw(new THREE.Scene());
      proxy.$scene = this.scene;

      // Renderer
      this.renderer = markRaw(new THREE.WebGLRenderer({antialias: false}));
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.BasicShadowMap;
      document.body.appendChild(this.renderer.domElement);

      // Model loader
      const loader = new GLTFLoader();
      const model = new URL('/public/Cafe Model/scene.gltf', import.meta.url).href;
      const calendarModel = new URL('/public/Calendar Model/scene.gltf', import.meta.url).href;

      loader.load(model, (gltf) => {
        const cafeModel = markRaw(gltf.scene);
        this.scene.add(cafeModel);

        // Calculate the bounding box of the model and get the center
        const boundingBox = new THREE.Box3().setFromObject(cafeModel);
        const center = boundingBox.getCenter(new THREE.Vector3());

        // Place the camera and controls in the center of the model
        this.camera.position.set(center.x, center.y - 0.2, center.z);
        this.controls.target.set(center.x, center.y - 0.2, center.z);

        this.controls.update();

        this.addInteractionCues(this.scene);
      }, undefined, (error) => {
        console.error(error);
      });

      loader.load(calendarModel, (gltf) => {
        const calendarModel = markRaw(gltf.scene);
        this.scene.add(calendarModel);

        calendarModel.position.set(-2.7, 1.5, -0.5);
        calendarModel.scale.set(0.4, 0.4, 0.4);
        calendarModel.rotation.set(0, Math.PI, 0);
      }, undefined, (error) => {
        console.error(error);
      });

      // Cube for reference and easy positioning
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
      const cube = markRaw(new THREE.Mesh(geometry, material));
      cube.position.set(-1.5, 1, -2);
      this.scene.add(cube);

      // Ambient Light
      const ambientLight = markRaw(new THREE.AmbientLight(0x404040, 50));
      ambientLight.position.set(-1.5, 1, -2).normalize();
      this.scene.add(ambientLight);

      // Camera controls
      this.camera = markRaw(new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000));

      this.controls = markRaw(new OrbitControls(this.camera, this.renderer.domElement));
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.screenSpacePanning = false;
      this.controls.enablePan = false;

      // Limits for zooming
      this.controls.minDistance = 1;
      this.controls.maxDistance = 1;

      // Limits for vertical movement
      this.controls.maxPolarAngle = Math.PI / 2;
      this.controls.minPolarAngle = Math.PI / 2.5;

      this.renderer.domElement.addEventListener('click', this.onDocumentMouseDown, false);

      this.animate();
    },
    animate() {
      requestAnimationFrame(this.animate);

      this.controls.update();

      this.renderer.render(this.scene, this.camera);
    },
    addInteractionCues(scene) {
      const createCue = (text, isVisible) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const size = isVisible ? 128 : 256;
        canvas.width = size;
        canvas.height = size;

        if (isVisible) {
          context.beginPath();
          context.arc(size / 2, size / 2, size / 2 - 10, 0, 2 * Math.PI, false);
          context.lineWidth = 10;
          context.strokeStyle = 'black';
          context.stroke();
          context.fillStyle = 'white';
          context.fill();

          context.font = 'bold 40px Arial';
          context.fillStyle = 'black';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          context.fillText(text, size / 2, size / 2);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true, // Ensure transparency is enabled
          opacity: isVisible ? 1 : 0, // Visible cue is fully opaque, invisible cue is fully transparent
        });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(isVisible ? 0.2 : 0.4, isVisible ? 0.2 : 0.4, 1); // Adjust scale for invisible cue
        sprite.renderOrder = isVisible ? 1 : 0; // Ensure visible cue is rendered on top

        return sprite;
      };

      const scheduleCue = createCue('1', true);
      const scheduleInvisibleCue = createCue('', false);
      scheduleInvisibleCue.name = "Schedule";
      scheduleCue.position.set(-2.65, 1.5, -0.6);
      scheduleInvisibleCue.position.copy(scheduleCue.position);

      scene.add(scheduleInvisibleCue);
      scene.add(scheduleCue);

      this.interactionCues.push(scheduleInvisibleCue);

      const menuCue = createCue('2', true);
      const menuInvisibleCue = createCue('', false);
      menuInvisibleCue.name = "Menu";
      menuCue.position.set(-2.25, 0.6, -2.6);
      menuInvisibleCue.position.copy(menuCue.position);

      scene.add(menuInvisibleCue);
      scene.add(menuCue);

      this.interactionCues.push(menuInvisibleCue);

      console.log('Interaction cue added. Total cues:', this.interactionCues.length);
    },
    onDocumentMouseDown(event) {
      if (this.disableInteraction) {
        console.log('Interaction is disabled or details panel is open, ignoring clicks.');
        return;
      }

      event.preventDefault();

      const rect = this.renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, this.camera);
      const intersects = raycaster.intersectObjects(this.interactionCues, true);

      // Log the number of intersections found
      console.log('Intersections found:', intersects.length);

      if (intersects.length > 0) {
        console.log('Sprite intersected');

        this.storeInitialCameraState();

        this.zoomToObject(intersects[0], () => {
          this.openDetails(intersects[0].object.name);
        });

      } else {
        console.log('No sprite intersected');
      }
    },
    zoomToObject(object, callback) {

      let targetPosition = new THREE.Vector3();

      if (object.object.name === 'Schedule') {
        console.log('Zooming to Schedule')
        targetPosition = new THREE.Vector3(object.point.x, object.point.y, object.point.z - 1);
      } else if (object.object.name === 'Menu') {
        console.log('Zooming to Menu')
        targetPosition = new THREE.Vector3(object.point.x + 0.5, object.point.y, object.point.z + 0.6);
      }

      const duration = 1000; // Duration of the animation in milliseconds
      const startTime = performance.now();

      const initialCameraPosition = this.camera.position.clone();
      const initialTarget = this.controls.target.clone();
      const finalLookAtPosition = new THREE.Vector3(object.point.x, object.point.y, object.point.z); // The exact point to look at

      const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const fraction = elapsedTime / duration;

        if (fraction < 1) {
          // Smoothly interpolate the camera and controls target positions
          this.camera.position.lerpVectors(initialCameraPosition, targetPosition, fraction);
          const newTarget = initialTarget.clone().lerp(finalLookAtPosition, fraction);
          this.controls.target.set(newTarget.x, newTarget.y, newTarget.z);
          this.camera.lookAt(newTarget.x, newTarget.y, newTarget.z); // Smoothly adjust the camera's orientation
          this.controls.update();

          requestAnimationFrame(animate);
        } else {
          // Ensure the final positions and orientation are set
          this.camera.position.copy(targetPosition);
          this.controls.target.set(finalLookAtPosition.x, finalLookAtPosition.y, finalLookAtPosition.z);
          this.camera.lookAt(finalLookAtPosition.x, finalLookAtPosition.y, finalLookAtPosition.z);
          this.controls.update();

          // Call the callback function after the animation
          if (callback) {
            callback();
          }
        }
      };

      requestAnimationFrame(animate);
    },
    openDetails(name) {
      if (name === 'Schedule' && !store.showSchedule) {
        store.showSchedule = true;
      } else if (name === 'Menu' && !store.showMenu) {
        store.showMenu = true;
      }

      this.controls.enabled = false;
      this.disableInteraction = true;
      console.log('Opening details for:', name);
    },
    storeInitialCameraState() {
      this.initialCameraPosition = this.camera.position.clone();
      this.initialControlsPosition = this.controls.target.clone();
    },
    resetCamera() {
      const duration = 1000; // Adjust duration as needed
      const startTime = performance.now();

      const initialCameraPosition = this.camera.position.clone();
      const initialTarget = this.controls.target.clone();

      const animate = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const fraction = elapsedTime / duration;

        if (fraction < 1) {
          // Smoothly interpolate the camera and controls target positions
          this.camera.position.lerpVectors(initialCameraPosition, this.initialCameraPosition, fraction);
          const newTarget = initialTarget.clone().lerp(this.initialControlsPosition, fraction);
          this.controls.target.set(newTarget.x, newTarget.y, newTarget.z);
          this.camera.lookAt(newTarget.x, newTarget.y, newTarget.z); // Smoothly adjust the camera's orientation
          this.controls.update();

          requestAnimationFrame(animate);
        } else {
          // Ensure the final positions and orientation are set
          this.camera.position.copy(this.initialCameraPosition);
          this.controls.target.set(this.initialControlsPosition.x, this.initialControlsPosition.y, this.initialControlsPosition.z);
          this.camera.lookAt(this.initialControlsPosition.x, this.initialControlsPosition.y, this.initialControlsPosition.z);

          this.controls.update();
        }

        this.controls.enabled = true;
        this.disableInteraction = false;
      };

      requestAnimationFrame(animate);
    },
  },
};

</script>

<template>
  <div id="cafe-container"></div>
</template>

<style scoped>
/* Your styles here */
</style>