import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import Landing from '../views/LandingView.vue';
import AvailableTests from '../views/AvailableTestsView.vue';
import { auth } from '../firebase'; // Import Firebase authentication

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: false, // Home page is accessible to everyone
    },
  },
  {
    path: '/available-tests',
    name: 'AvailableTests',
    component: AvailableTests,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: '/about',
    component: Landing,
    name: 'Landing',
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/', // Redirect any unknown routes to the home page
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const { currentUser } = auth;

  // If route requires authentication and user is not logged in, redirect to home
  if (requiresAuth && !currentUser) {
    next('/');
  } else {
    next(); // Proceed to the route
  }
});

export default router;
