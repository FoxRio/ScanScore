<template>
  <div v-if="isAuthenticated" class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" style="background-color: #d44e00; color: #0638b8; border: none;">
      Profile
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton" style="background-color: #f5fff6;">
      <li><RouterLink to="/my-tests" class="dropdown-item" style="color: #0638b8;">My Tests</RouterLink></li>
      <li><RouterLink to="/info" class="dropdown-item" style="color: #0638b8;">Info</RouterLink></li>
      <li><RouterLink to="/settings" class="dropdown-item" style="color: #0638b8;">Settings</RouterLink></li>
      <li><SignOutButton /></li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import SignOutButton from './SignOutButton.vue';

export default {
  components: {
    SignOutButton,
  },
  setup() {
    const auth = getAuth();
    const isAuthenticated = ref(false);

    onMounted(() => {
      onAuthStateChanged(auth, (user) => {
        isAuthenticated.value = !!user;
      });
    });

    return {
      isAuthenticated,
    };
  },
};
</script>
