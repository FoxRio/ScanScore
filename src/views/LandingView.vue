<template>
  <div class="about-page">
    <h1>About the Test Creation Tool</h1>

    <section class="feature">
      <h2>Create Tests Effortlessly</h2>
      <p>
        Our tool allows teachers to easily create customizable tests with a variety of question types. Whether you're
        creating multiple choice, true/false, or essay-based questions, this tool makes it simple and intuitive.
      </p>
    </section>

    <section class="feature">
      <h2>Save Your Tests for Later</h2>
      <p>
        Never worry about losing your tests. Save them securely for future use. Access them whenever you need to modify
        or reuse your tests for different classes or semesters.
      </p>
    </section>

    <section class="feature">
      <h2>AI-powered Assistant</h2>
      <p>
        Need help creating questions? Our built-in AI assistant can help you generate questions, suggest question
        types, and even estimate the difficulty level of your test. This assistant streamlines the creation process
        while saving you valuable time.
      </p>
    </section>

    <section class="feature">
      <h2>Automated Grading with Machine Vision</h2>
      <p>
        Once your students complete the tests, grading is automatic! Using cutting-edge machine vision technology, our
        tool can quickly and accurately grade tests, providing immediate feedback to both teachers and students.
      </p>
    </section>

    <section class="call-to-action">
      <h2>Ready to Start?</h2>
      <p>Sign up today and begin creating, saving, and grading your tests with ease!</p>
      <button @click="goToHome">Get Started</button>
    </section>
  </div>
</template>

<script>
import { auth } from '../firebase';

export default {
  data() {
    return {
      isLoggedIn: false,
    };
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const user = auth.currentUser;
      if (user) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    },
    goToHome() {
      if (this.isLoggedIn) {
        this.$router.push('/create-test');
      } else {
        this.$router.push('/signup');
      }
    },
  },
};
</script>

<style scoped>
.about-page {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f5fff6;
  color: #0638b8;
  border-radius: 10px;
}

h1 {
  text-align: center;
  color: #0638b8;
}

.feature {
  margin-bottom: 30px;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.feature h2 {
  font-size: 1.5rem;
  color: #d44e00;
  margin-bottom: 10px;
}

.feature p {
  font-size: 1rem;
  color: #0638b8;
  line-height: 1.6;
}

.call-to-action {
  text-align: center;
  margin-top: 40px;
}

.call-to-action h2 {
  font-size: 1.5rem;
  color: #d44e00;
}

.call-to-action p {
  font-size: 1.2rem;
  color: #0638b8;
  margin-bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #d44e00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #b43e00;
}
</style>
