<template>
  <div v-if="!isAuthenticated">
    <button @click="redirectToLogin">Sign In</button>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const auth = getAuth();
    const isAuthenticated = ref(false);
    const router = useRouter();

    const redirectToLogin = () => {
      try {
        router.push('/login');
      } catch (error) {
        console.error('Sign in error:', error);
      }
    };

    onMounted(() => {
      // Listen for authentication state changes
      onAuthStateChanged(auth, (user) => {
        isAuthenticated.value = !!user;
      });
    });

    return {
      isAuthenticated,
      redirectToLogin,
    };
  },
};
</script>

<style scoped>
button {
  background-color: #4caf50; /* Green */
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
}
button:hover {
  background-color: #388e3c; /* Darker Green */
}
</style>
