import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router
import { auth } from './firebase';

let app;

// Listen for auth state changes
auth.onAuthStateChanged(() => { // user
  if (!app) {
    // Initialize the app after Firebase auth state is determined
    app = createApp(App);
    app.use(router);
    app.mount('#app');
  }
});
