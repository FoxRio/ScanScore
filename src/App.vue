<template>
  <div>
    <h1> {{ title }}</h1>
    <h2>Sveiks, roland. Deploy test 2</h2>
  </div>
  <div class="description">
    <p>{{ appDescription }}</p>
  </div>
  <div>
    <button @click="openCreating" v-if="!creatingTest && !gradingTest">Create new test</button>
    <button @click="openGrading" v-if="!gradingTest && !creatingTest">Grade an existing test</button>
  </div>
  <CreateTest v-if="creatingTest && !gradingTest" @collapse="handleCollapse" />
  <GradeTest v-if="gradingTest && !creatingTest" @collapse="handleCollapse" />
</template>

<script>
// import Modal from './components/Modal-component.vue';
import CreateTest from './components/CreateTest.vue';
import GradeTest from './components/GradeTest.vue';

export default {
  name: 'App',
  components: {
    CreateTest,
    GradeTest,
  },
  data() {
    return {
      creatingTest: false,
      gradingTest: false,
      title: 'Scan App',
      appDescription: 'Short description of what this is. Short description of what this is.Short description of what this is.Short description of what this is.Short description of what this is.Short description of what this is.Short description of what this is.',
    };
  },
  methods: {
    openCreating() {
      this.creatingTest = true;
      // console.log('creatingTest', this.creatingTest);
      // console.log('gradingTest", this.gradingTest);
    },
    openGrading() {
      this.gradingTest = true;
      console.log(this.gradingTest);
    },
    handleCollapse() {
      this.creatingTest = false;
      this.gradingTest = false;
      console.log(this.creatingTest);
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.description {
  width: 400px;
  padding: 20px;
  margin: 100px auto;
}
</style>
