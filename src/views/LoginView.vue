<template>
  <div class="login">
    <h1>Login</h1>
    <form @submit.prevent="loginUser">
      <div class="input-container">
        <label for="email" class="input-label">Email:
        <input type="email" id="email" v-model="email" required class="input-field" /></label>
      </div>
      <div class="input-container">
        <label for="password" class="input-label">Password:
        <input type="password" id="password" v-model="password" required class="input-field" /></label>
      </div>
      <button type="submit">Login</button>

      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </form>
    <div class="forgot-password">
    <button @click="resetPassword" class="forgot-password">Forgot Password?</button></div>
  </div>
  <div class="register">
    <router-link to="/register">Don't have an account? Register</router-link>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

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
        this.$router.push('/about');
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    async resetPassword() {
      const auth = getAuth();
      if (!this.email) {
        this.errorMessage = 'Please enter your email to reset the password.';
        return;
      }
      try {
        await sendPasswordResetEmail(auth, this.email);
        this.errorMessage = 'Password reset email sent. Please check your inbox.';
      } catch (error) {
        this.errorMessage = error.message;
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
  border-radius: 8px;
  background-color: #f5fff6;
}

h1 {
  text-align: center;
  color: #0638b8;
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
  color: #0638b8;
}

.input-field {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #d44e00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
}

button:hover {
  background-color: #b43e00;
}

.forgot-password {
  margin-top: 10px;
  background-color: transparent;
  color: #0638b8;
  text-decoration: none;
  text-align: center;
  border: none;
  cursor: pointer;
}

button.forgot-password:hover {
  color: #d44e00;
  text-decoration: underline;
  background-color: transparent;
}

.error {
  color: red;
  font-size: 0.875rem;
  text-align: center;
}

.register {
  text-align: center;
  margin-top: 15px;
}

.register a {
  color: #0638b8;
  background-color: transparent;
  text-decoration: none;
}

.register a:hover {
  color: #d44e00;
  text-decoration: underline;
}
</style>
