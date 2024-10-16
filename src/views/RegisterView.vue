<template>
  <div class="register">
    <h1>Register</h1>
    <form @submit.prevent="registerUser">
      <div>
        <label for="email">Email:
        <input type="email" id="email" v-model="email" required /></label>
      </div>
      <div>
        <label for="password">Password:
        <input type="password" id="password" v-model="password" required /></label>
      </div>
      <button type="submit">Register</button>
      <button @click="goToLogin">Login</button>
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </form>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async registerUser() {
      const auth = getAuth();
      try {
        await createUserWithEmailAndPassword(auth, this.email, this.password);
        // Optionally, redirect or show a success message
        this.$router.push('/login'); // Redirect to login after registration
      } catch (error) {
        this.errorMessage = error.message; // Display error message
      }
    },
    goToLogin() {
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.register {
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
