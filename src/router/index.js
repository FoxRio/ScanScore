import { createRouter, createWebHistory } from 'vue-router';
import CheckPermisionsView from '../views/CheckPermisionsView.vue';
import Home from '../views/HomeView.vue';
import Register from '../views/RegisterView.vue';
import Login from '../views/LoginView.vue';
import Landing from '../views/LandingView.vue';
import CreateTest from '../views/CreateTestView.vue';
import { auth } from '../firebase';
import GetCreatedTests from '../views/GetCreatedTests.vue';
import EditTest from '../views/EditTestView.vue';
import Settings from '../views/SettingsView.vue';
import Goodbye from '../views/GoodbyeView.vue';
import GradeTests from '../views/GradeTestView.vue';

const routes = [
  {
    path: '/my-tests',
    name: 'Mytests',
    component: GetCreatedTests,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/check',
    name: 'Check',
    component: CheckPermisionsView,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/create-test',
    name: 'CreateTest',
    component: CreateTest,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/about',
    component: Landing,
    name: 'Landing',
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/edit-test/:id',
    name: 'EditTest',
    component: EditTest,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/grade-tests',
    name: 'GradeTests',
    component: GradeTests,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/goodbye',
    name: 'Goodbye',
    component: Goodbye,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const { currentUser } = auth;

  if (requiresAuth && !currentUser) {
    console.log('Failed authorisation. Insufficient Permisions');
    next('/');
  } else {
    next();
  }
});

export default router;
