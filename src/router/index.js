import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'; // Your Home component
import Landing from '../views/Landing.vue'; // Your Landing page component

const routes = [
  { path: '/', component: Home },
  { path: '/landing', component: Landing, }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
