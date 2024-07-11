import {createRouter, createWebHistory} from "vue-router"
import HomeView from "./views/HomeView.vue"
import AboutView from "./views/AboutView.vue"
import GamesView from "./views/GamesView.vue";
import MenuView from "./views/MenuView.vue";
import ReservationsView from "./views/ReservationsView.vue";
import ScheduleView from "./views/ScheduleView.vue";

const routes = [
    {path: "/", component: HomeView},
    {path: "/about", component: AboutView},
    {path: "/games", component: GamesView},
    {path: "/menu", component: MenuView},
    {path: "/reservations", component: ReservationsView},
    {path: "/schedule", component: ScheduleView},];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;