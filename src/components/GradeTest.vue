<template>
  <div class="gradeTest">
    <div><button @click="collapse" class="collapse">collapse</button></div>
<p>Here you can grade a Test</p>
  </div>
</template>

<script>
export default {
  data() {

  },
  methods: {
    collapse() {
      this.$emit('collapse');
    },
  },
};
</script>

<style>

</style>
