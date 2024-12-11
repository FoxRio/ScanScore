<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <h1>Welcome to the Test Creation Tool!</h1>
      <p>Build, save, and grade tests with ease. Designed to help teachers create efficient and accurate assessments for their students.</p>
      <button @click="goToCreatePage">Start Creating Now</button>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2>Key Features</h2>
      <div class="feature-list">
        <div class="feature">
          <h3>Create Custom Tests</h3>
          <p>Easily create a variety of tests for your students with our intuitive interface.</p>
        </div>
        <div class="feature">
          <h3>Save Your Work</h3>
          <p>Save your tests for future use. Access and modify them anytime.</p>
        </div>
        <div class="feature">
          <h3>AI Assistant</h3>
          <p>Use the AI-powered assistant to help generate questions and estimate test difficulty.</p>
        </div>
        <div class="feature">
          <h3>Automated Grading</h3>
          <p>Grade tests instantly with machine vision technology for quick and accurate results.</p>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials">
      <h2>What Our Users Are Saying</h2>
      <div class="testimonial">
        <p>"This tool has saved me so much time! The AI assistant helps me come up with great questions, and the automated grading is a game-changer!"</p>
        <cite>- Sarah, High School Teacher</cite>
      </div>
      <div class="testimonial">
        <p>"I love how easy it is to create and save tests. The interface is user-friendly and the AI features are incredibly helpful."</p>
        <cite>- John, Middle School Teacher</cite>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta" v-if="!isLoggedIn">
      <h2>Ready to Get Started?</h2>
      <p>Sign up today and start creating your first test!</p>
      <button @click="goToSignUp">Sign Up</button>
    </section>
  </div>
</template>

<script>
import { auth } from '../firebase'; // Import Firebase authentication

export default {
  data() {
    return {
      isLoggedIn: false,
    };
  },
  created() {
    // Check if the user is logged in
    this.checkLoginStatus();
  },
  methods: {
    // Check if the user is logged in
    checkLoginStatus() {
      const user = auth.currentUser; // Get the current user from Firebase authentication
      if (user) {
        this.isLoggedIn = true; // User is logged in
      } else {
        this.isLoggedIn = false; // User is not logged in
      }
    },
    // Redirect to the test creation page
    goToCreatePage() {
      if (this.isLoggedIn) {
        this.$router.push('/create-test'); // Redirect logged-in users directly to /create-test
      } else {
        this.$router.push('/register'); // Redirect to register if not logged in
      }
    },
    // Redirect to the registration page
    goToSignUp() {
      this.$router.push('/register');
    },
  },
};
</script>

<style scoped>
.home-page {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.hero {
  background-color: #2c3e50;
  color: white;
  padding: 50px 20px;
  text-align: center;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.hero button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.hero button:hover {
  background-color: #218838;
}

.features {
  padding: 40px 20px;
  text-align: center;
  background-color: #2c3e50;
}

.features h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.feature-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.feature {
  background-color: #33364dc9;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  width: 22%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.feature h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.testimonials {
  padding: 40px 20px;
  text-align: center;
}

.testimonials h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.testimonial {
  margin: 20px 0;
  font-style: italic;
}

.testimonial cite {
  display: block;
  margin-top: 10px;
  font-weight: bold;
}

.cta {
  padding: 40px 20px;
  background-color: #2c3e50;
  color: white;
  text-align: center;
}

.cta h2 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.cta p {
  font-size: 1.2rem;
  margin-bottom: 20px;
}

.cta button {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cta button:hover {
  background-color: #218838;
}
</style>
