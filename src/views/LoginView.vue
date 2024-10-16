<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="loginUser">
      <div>
        <label for="email">Email:
        <input type="email" v-model="email" required /></label>
      </div>
      <div>
        <label for="password">Password:
        <input type="password" v-model="password" required /></label>
      </div>
      <button type="submit">Login</button>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async loginUser() {
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        // Redirect to home or another page upon successful login
        this.$router.push('/about'); // Adjust the redirect as needed
      } catch (error) {
        this.errorMessage = error.message; // Display error message
      }
    },
  },
};
</script>

<style scoped>
.login {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error {
  color: red;
}
</style>
