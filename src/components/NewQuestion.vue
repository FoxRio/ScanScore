<template>
  <div class="question-container">
    <p>{{ questionData.questionText }}</p>
    <div v-for="(answer, index) in questionData.answers" :key="index" :class="{ 'correct-answer': answer.correct }">
      {{ answer.text }}
    </div>
    <button @click="deleteQuestion" class="delete-button">Delete</button>
  </div>
</template>

<script>
export default {
  props: ['questionData'],
  methods: {
    deleteQuestion() {
      this.$emit('deleteEvent');
    },
  },
};
</script>

<style scoped>
.question-container {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.question-container p {
  font-weight: bold;
  margin-bottom: 10px;
}

.correct-answer {
  background-color: lightgreen;
}

.delete-button {
  padding: 8px 16px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c82333;
}
</style>
