<template>
  <div v-if="isAuthenticated">
    <button @click="signOutUser">Sign Out</button>
  </div>
</template>

<script>
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const auth = getAuth();
    const isAuthenticated = ref(false);
    const router = useRouter(); // Get the router instance
    const signOutUser = async () => {
      try {
        await signOut(auth); // Sign out the user
        router.push('/');
      } catch (error) {
        console.error('Sign out error:', error);
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
      signOutUser,
    };
  },
};
</script>

<style scoped>
button {
  background-color: #f44336; /* Red */
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
}
button:hover {
  background-color: #d32f2f; /* Darker Red */
}
</style>
