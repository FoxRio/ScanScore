<template>
  <div class="createNewTest">

    <div><button @click="collapse" class="collapse">collapse</button></div>
<p>Here you can create a new Test that will be outputed as a .docx download</p>
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
