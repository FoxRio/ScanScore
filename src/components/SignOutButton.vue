<template>
  <button @click="signOutUser">Sign Out</button>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const auth = getAuth();
    const router = useRouter(); // Get the router instance

    const signOutUser = async () => {
      try {
        await signOut(auth); // Sign out the user
        router.push('/'); // Redirect to home page after sign out
      } catch (error) {
        console.error('Sign out error:', error);
      }
    };

    return {
      signOutUser,
    };
  },
};
</script>

<style scoped>
button {
  background-color: #d44e00; /* Primary color */
  color: #0638b8; /* Foreground color */
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
}

button:hover {
  background-color: #be4600; /* Darker primary color for hover */
  color: white; /* Change text color on hover for contrast */
}
</style>
