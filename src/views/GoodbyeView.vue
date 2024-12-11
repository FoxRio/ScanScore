<template>
  <div class="goodbye">
    <h1>We're Sorry to See You Go!</h1>
    <p>Your account and all associated tests have been deleted successfully.</p>
    <p>Thank you for being a part of our community. We hope to see you again someday!</p>
    <router-link to="/" class="home-link">Go back to homepage</router-link>
  </div>
</template>

<script>
export default {
  name: 'GoodbyeView',
};
</script>

<style scoped>
.goodbye {
  width: 80%;
  margin: auto;
  background-color: #f5fff6; /* Background color */
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  box-sizing: border-box;
}

h1 {
  color: #0638b8; /* Text color */
  font-size: 2rem;
  margin-bottom: 20px;
}

p {
  color: #0638b8; /* Text color */
  font-size: 1.1rem;
  margin: 10px 0;
}

.home-link {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #d44e00; /* Primary color */
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.home-link:hover {
  background-color: #b43e00; /* Darker shade of primary color for hover */
}
</style>
