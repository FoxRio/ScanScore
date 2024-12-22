<template>
  <div v-if="!isAuthenticated">
    <button @click="redirectToLogin" class="btn btn-primary" style="background-color: #d44e00; color: #fff; border: none;">
      Sign In
    </button>
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
button:hover {
  background-color: #be4600;
}
</style>
