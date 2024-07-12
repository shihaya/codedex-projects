import {createRouter, createWebHistory} from "vue-router"
import AboutView from "./views/AboutView.vue"
import GamesView from "./views/GamesView.vue";
import ReservationsView from "./views/ReservationsView.vue";
import Schedule from "./components/Schedule.vue";
import Cafe from "./components/Cafe.vue";
import Menu from "./components/Menu.vue";

const routes = [
    {path: "/", component: Cafe},
    {path: "/about", component: AboutView},
    {path: "/games", component: GamesView},
    {path: "/menu", component: Menu},
    {path: "/reservations", component: ReservationsView},
    {path: "/schedule", component: Schedule},];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;