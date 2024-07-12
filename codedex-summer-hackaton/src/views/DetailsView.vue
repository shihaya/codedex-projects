<script setup>
import Schedule from "../components/Schedule.vue";
import Menu from "../components/Menu.vue";
import {computed} from "vue";
import {store} from "../store.js";

const isScheduleVisible = computed(() => store.showSchedule);
const isMenuVisible = computed(() => store.showMenu);

function closePopup() {
  store.showSchedule = false;
  store.showMenu = false;
}

</script>

<template>
  <div v-if="isScheduleVisible" class="popup">
    <Schedule/>
    <button @click="closePopup">CLOSE</button>
  </div>
  <div v-if="isMenuVisible" class="popup">
    <Menu/>
    <button @click="closePopup">CLOSE</button>
  </div>
</template>

<style scoped>
.popup {
  background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent black background */
  position: fixed; /* Ensure it covers the whole screen */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

button {
  margin: 50px auto;
  padding: 15px 40px;
  background-color: #dee9d3;
  border: 2px solid #f0f0f0;
  color: #1a1a1a;
  font-size: 18px;
  cursor: pointer;
  border-radius: 20px;
}

button:hover {
  background-color: #bac9ab;
}
</style>