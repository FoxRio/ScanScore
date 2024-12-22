<template>
  <div>
    <nav class="navbar navbar-expand-lg fixed-top" style="background-color: #d44e00;">
      <div class="container">
        <a class="navbar-brand" href="/" style="color: #0638b8;">
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
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="background-color: #f5fff6;">
            <li><RouterLink to="/my-tests" class="dropdown-item" style="color: #0638b8;">
              My Tests
            </RouterLink></li>
            <li><RouterLink to="/info" class="dropdown-item" style="color: #0638b8;">
              Info
            </RouterLink></li>
            <li><RouterLink to="/settings" class="dropdown-item" style="color: #0638b8;">
              Settings
            </RouterLink></li>
            <li><SignOutButton class="dropdown-item" style="color: #0638b8;" />
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="content" style="background-color: #f5fff6; padding-top: 60px;">
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
    const route = useRoute();

    const isActive = (path) => route.path === path;

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        isAuthenticated.value = !!user;
      });
    });

    return {
      isAuthenticated,
      isActive,
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
    color: #ffffff !important;
    background-color: #0638b8;
  }

  .dropdown-toggle::after {
    border-top-color: #0638b8 !important;
  }

  .nav-link.active {
    font-weight: bold;
    color: #ffffff !important;
    background-color: #0638b8;
    border-radius: 5px;
    padding: 5px 10px;
  }
</style>
