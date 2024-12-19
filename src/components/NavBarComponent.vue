<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg fixed-top" style="background-color: #d44e00;"> <!-- themePrimary -->
      <div class="container">
        <!-- Logo or Brand -->
        <a class="navbar-brand" href="/" style="color: #0638b8;"> <!-- neutralPrimary -->
          ScanScore
        </a>

        <div class="navbar-nav ml-auto">
          <RouterLink
            to="/"
            class="nav-link"
            :class="{ active: isActive('/') }"
            style="color: #0638b8;"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/about"
            class="nav-link"
            :class="{ active: isActive('/about') }"
            style="color: #0638b8;"
          >
            About
          </RouterLink>
          <RouterLink
            to="/create-test"
            class="nav-link"
            :class="{ active: isActive('/create-test') }"
            style="color: #0638b8;"
          >
            Create a Test
          </RouterLink>
          <RouterLink
            to="/grade-tests"
            class="nav-link"
            :class="{ active: isActive('/grade-tests') }"
            style="color: #0638b8;"
          >
            Grade a Test
          </RouterLink>
        </div>

        <!-- Sign-In Button (if not signed in) -->
        <SignInButton v-if="!isAuthenticated" />

        <!-- Profile Dropdown (only if authenticated) -->
        <div v-if="isAuthenticated" class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="color: #0638b8; background-color: #d44e00; border: none;"> <!-- themePrimary -->
            Profile
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="background-color: #f5fff6;"> <!-- themeLighter -->
            <li><RouterLink to="/my-tests" class="dropdown-item" style="color: #0638b8;"> <!-- neutralPrimary -->
              My Tests
            </RouterLink></li>
            <li><RouterLink to="/info" class="dropdown-item" style="color: #0638b8;"> <!-- neutralPrimary -->
              Info
            </RouterLink></li>
            <li><RouterLink to="/settings" class="dropdown-item" style="color: #0638b8;"> <!-- neutralPrimary -->
              Settings
            </RouterLink></li>
            <li><SignOutButton class="dropdown-item" style="color: #0638b8;" /> <!-- neutralPrimary -->
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="content" style="background-color: #f5fff6; padding-top: 60px;"> <!-- themeLighter -->
      <!-- Your content goes here -->
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import SignOutButton from './SignOutButton.vue';
import SignInButton from './SignInButton.vue';

export default {
  name: 'NavbarComponent',
  components: {
    SignOutButton,
    SignInButton,
  },
  setup() {
    const auth = getAuth();
    const isAuthenticated = ref(false);
    const route = useRoute(); // Reactive route object

    const isActive = (path) => route.path === path; // Compare current path to the provided one

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        isAuthenticated.value = !!user;
      });
    });

    return {
      isAuthenticated,
      isActive, // Pass isActive function to template
    };
  },
};
</script>

<style scoped>
  .navbar {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .nav-link:hover,
  .dropdown-item:hover {
    color: #ffffff !important; /* Text color for hover */
    background-color: #0638b8; /* neutralPrimary hover */
  }

  .dropdown-toggle::after {
    border-top-color: #0638b8 !important; /* Change dropdown arrow color */
  }

  .nav-link.active {
    font-weight: bold;
    color: #ffffff !important; /* Active link color */
    background-color: #0638b8; /* Highlight active link background */
    border-radius: 5px; /* Optional: Add rounded corners */
    padding: 5px 10px; /* Optional: Add padding for better UX */
  }
</style>
