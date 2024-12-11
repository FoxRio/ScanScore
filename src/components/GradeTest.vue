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
  },
};
</script>

<style>
.gradeTest {
  width: 70%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: relative;
}

.gradeTest>div {
  margin-bottom: 15px;
}

.gradeTest p {
  color: #333;
}

.gradeTest button {
  background-color: #3498db;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.description {
  margin: 10px;
}

.gradeTest button:hover {
  background-color: #2980b9;
}
</style>
