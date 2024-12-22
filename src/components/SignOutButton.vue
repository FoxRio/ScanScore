<template>
  <button @click="signOutUser">Sign Out</button>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const auth = getAuth();
    const router = useRouter();

    const signOutUser = async () => {
      try {
        await signOut(auth);
        router.push('/');
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
  background-color: #d44e00;
  color: #0638b8;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 14px;
}

button:hover {
  background-color: #be4600;
  color: white;
}
</style>
