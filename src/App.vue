<!-- <template>
  <div>
    <h1> {{ title }}</h1>
    <h2>WELL EAT MY BEANS, RUB MY BUTT AND CALL ME A GENIE, THAT THERES SUSSY FEEF</h2>
  </div>
  <div class="description">
    <p>{{ appDescription }}</p>
  </div>
  <div>
    <button @click="openCreating" v-if="!creatingTest && !gradingTest">Create new test</button>
    <button @click="openGrading" v-if="!gradingTest && !creatingTest">Grade existing test</button>
  </div>
  <CreateTest v-if="creatingTest && !gradingTest" @collapse="handleCollapse" />
  <GradeTest v-if="gradingTest && !creatingTest" @collapse="handleCollapse" />
</template> -->

<template>
  <NavBarComponent />
  <p>
    <strong>Current route path:</strong> {{ $route.fullPath }}
  </p>

  <main>
    <RouterView />
  </main>
</template>

<script>
// import Modal from './components/Modal-component.vue';
import NavBarComponent from './components/NavBarComponent.vue';
// import SignOutButton from './components/SignOutButton.vue';

export default {
  name: 'App',
  components: {
    NavBarComponent,
    // SignOutButton,
  },
  data() {
    return {
      creatingTest: false,
      gradingTest: false,
      title: 'ScanApp',
      appDescription: 'Short description of what this is. Short description of what this is.Short description of what this is.Short description of what this is.Short description of what this is.Short description of what this is.Short description of what this is.',
    };
  },
  methods: {
    openCreating() {
      this.creatingTest = true;
      console.log('creatingTest', this.creatingTest);
      console.log('gradingTest', this.gradingTest);
    },
    openGrading() {
      this.gradingTest = true;
      console.log('creatingTest', this.creatingTest);
      console.log('gradingTest', this.gradingTest);
    },
    handleCollapse() {
      this.creatingTest = false;
      this.gradingTest = false;
      console.log('creatingTest', this.creatingTest);
      console.log('gradingTest', this.gradingTest);
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
  background-color: #2c3e50;
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
