<template>
  <NavBarComponent />
  <main>
    <RouterView />
  </main>
</template>

<script>
import NavBarComponent from './components/NavBarComponent.vue';

export default {
  name: 'App',
  components: {
    NavBarComponent,
  },
  data() {
    return {
      creatingTest: false,
      gradingTest: false,
      title: 'ScanApp',
    };
  },
  methods: {
    openCreating() {
      this.creatingTest = true;
    },
    openGrading() {
      this.gradingTest = true;
    },
    handleCollapse() {
      this.creatingTest = false;
      this.gradingTest = false;
    },
  },
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #f5fff6;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: rgb(10, 23, 11);
  height: 100%;
  width: 100%;
}

.description {
  width: 400px;
  margin: 100px auto;
}
</style>
