<template>
  <button @click="goToLanding">Go to Landing Page</button>
</template>

<script>
export default {
  methods: {
    goToLanding() {
      this.$router.push('/landing');
    }
  }
}
</script>
