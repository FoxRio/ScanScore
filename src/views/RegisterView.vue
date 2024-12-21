<template>
  <div class="register">
    <h1>Register</h1>
    <form @submit.prevent="registerUser">
      <div class="input-container">
        <label for="email" class="input-label">
          Email:
          <input type="email" id="email" v-model="email" required class="input-field" />
        </label>
      </div>
      <div class="input-container">
        <label for="password" class="input-label">
          Password:
          <input type="password" id="password" v-model="password" required class="input-field" />
        </label>
      </div>
      <div class="input-container">
        <label for="confirmPassword" class="input-label">
          Confirm Password:
          <input type="password" id="confirmPassword" v-model="confirmPassword" required class="input-field" />
        </label>
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
      confirmPassword: '',
      errorMessage: '',
    };
  },
  methods: {
    async registerUser() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Passwords do not match.';
        return;
      }

      const auth = getAuth();
      try {
        await createUserWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push('/create-test');
      } catch (error) {
        this.errorMessage = error.message;
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

.error {
  color: red;
  font-size: 0.875rem;
  text-align: center;
}

.login {
  text-align: center;
  margin-top: 15px;
}

.login a {
  color: #0638b8;
  background-color: transparent;
  text-decoration: none;
}

.login a:hover {
  color: #d44e00;
  text-decoration: underline;
}
</style>
