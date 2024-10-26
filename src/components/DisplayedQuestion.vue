<template>
  <div class="question-container">
    <p>{{ questionData.questionText }}</p>
    <div v-for="(answer, index) in questionData.answers" :key="index" :class="{ 'correct-answer': answer.correct }">
      {{ answer.text }}
    </div>
    <button @click="deleteQuestion" class="delete-button">Delete</button>
    <button @click="editQuestion" class="edit-button">Edit</button>
  </div>
</template>

<script>
export default {
  props: ['questionData'],
  methods: {
    deleteQuestion() {
      this.$emit('deleteEvent');
    },
    editQuestion() {
      this.$emit('editEvent'); // Emit an event to the parent component to switch to edit mode
    },
  },
};
</script>

// TODO THERE IS STILL ISSUE WITH EDITING. NEED TO MAKE SURE THAT CANCEL EDIT IS WORKING and also thatsave button is working.

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

.edit-button {
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #0056b3;
}
</style>
