<template>
  <div>
    <p>HELLO TO MY NAVBAR</p>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/about">Go to About</RouterLink>
    <RouterLink to="/available-tests">Create a Test</RouterLink>

  </nav>
  <div class="dropdown">
        <button class="dropbtn">Profile</button>
        <div class="dropdown-content">
          <RouterLink to="/available-tests">My Tests</RouterLink>
          <RouterLink to="/info">Info</RouterLink>
          <RouterLink to="/settings">Settings</RouterLink>
        </div>
    </div>
  </div>

</template>

<!-- <script>
export default {
  methods: {
    goToLanding() {
      this.$router.push('/about');
    },
  },
};
</script> -->
