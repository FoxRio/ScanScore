<template>
  <div>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/about">Go to About</RouterLink>
    <RouterLink to="/create-test">Create a Test</RouterLink>
    <SignInButton />

  <div class="dropdown">
        <button class="dropbtn">Profile</button>
        <div class="dropdown-content">
          <RouterLink to="/my-tests">My Tests</RouterLink>
          <RouterLink to="/info">Info</RouterLink>
          <RouterLink to="/settings">Settings</RouterLink>
          <SignOutButton />
        </div>
      </div>
    </nav>
    <div class="content"></div>
  </div>
</template>

<script>
import SignOutButton from './SignOutButton.vue';
import SignInButton from './SignInButton.vue';

export default {
  name: 'NavbarComponent',
  components: {
    SignOutButton,
    SignInButton,
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #333;
  padding: 1rem;
  position: fixed; /* Fixes the navbar to the top */
  top: 0; /* Positions it at the top of the viewport */
  width: 100%; /* Makes it span the full width of the screen */
  z-index: 1000; /* Ensures it's above other content */
}

.navbar a {
  color: white;
  text-decoration: none;
  padding: 14px 20px;
  transition: background-color 0.3s;
}

.navbar a:hover {
  background-color: #575757;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background-color: #333;
  color: white;
  padding: 14px 20px;
  border: none;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

/* Add margin-top to the content to respect the navbar */
.content {
  margin-top: 100px; /* Adjust this value based on your navbar height */
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
