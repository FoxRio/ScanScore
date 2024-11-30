<template>
  <div class="register">
    <h1>Register</h1>
    <form @submit.prevent="registerUser">
      <div class="input-container">
        <label for="email" class="input-label">Email:
        <input type="email" id="email" v-model="email" required class="input-field" /></label>
      </div>
      <div class="input-container">
        <label for="password" class="input-label">Password:
        <input type="password" id="password" v-model="password" required class="input-field" /></label>
      </div>
      <button type="submit">Register</button>

      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </form>
  </div>
  <div class="login">
    <router-link to="/login">Already have an account? Login</router-link>
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

.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input-label {
  font-size: 1rem;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-field {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box; /* Ensures padding does not affect width */
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error {
  color: red;
  font-size: 0.875rem;
}

.login {
  text-align: center;
  margin-top: 15px;
}

a:link {
  color: green;
  background-color: transparent;
  text-decoration: none;
}

a:visited {
  color: pink;
  background-color: transparent;
  text-decoration: none;
}

a:hover {
  color: red;
  background-color: transparent;
  text-decoration: underline;
}

a:active {
  color: yellow;
  background-color: transparent;
  text-decoration: underline;
}
</style>
