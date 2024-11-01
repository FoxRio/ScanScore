import { createRouter, createWebHistory } from 'vue-router';
import CheckPermisionsView from '../views/CheckPermisionsView.vue';
import Home from '../views/HomeView.vue';
import Register from '../views/RegisterView.vue';
import Login from '../views/LoginView.vue';
import Landing from '../views/LandingView.vue';
import AvailableTests from '../views/AvailableTestsView.vue';
import { auth } from '../firebase'; // Import Firebase authentication
import GetCreatedTests from '../views/GetCreatedTests.vue';
import AItestView from '..components/AIGeneratedQuestion.vue';

const routes = [
  {
    path: '/my-tests',
    name: 'Mytests',
    component: GetCreatedTests,
    meta: {
      requiresAuth: false, // Home page is accessible to everyone
    },
  },
  {
    path: '/test-view',
    name: 'TestView',
    component: AItestView,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresAuth: false, // Home page is accessible to everyone
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false, // Home page is accessible to everyone
    },
  },
  {
    path: '/check',
    name: 'Check',
    component: CheckPermisionsView,
    meta: {
      requiresAuth: false, // Home page is accessible to everyone
    },
  },
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
      requiresAuth: true,
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
    console.log('Failed authorisation. Insufficient Permisions');
    next('/');
  } else {
    next(); // Proceed to the route
  }
});

export default router;
