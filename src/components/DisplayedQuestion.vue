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

<style scoped>
.question-container {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f5fff6;
}

.question-container p {
  font-weight: bold;
  margin-bottom: 10px;
  color: #0638b8;
}

.correct-answer {
  background-color: lightgreen;
}

.answer-container input {
  margin-right: 10px;
}

.delete-button {
  padding: 8px 16px;
  background-color: #d44e00;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c83d00;
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

.save-button {
  padding: 8px 16px;
  background-color: #28a745;
  /* Green for Save */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #218838;
}

.cancel-button {
  padding: 8px 16px;
  background-color: #ffc107;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #e0a800;
}
</style>
