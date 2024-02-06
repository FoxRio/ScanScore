<template>
  <div class="createDocumentForm">
    <form @submit.prevent="handleSubmit" id="createNewDocumentForm">
      <div v-for="(question, index) in questions" :key="index">
        <NewQuestion :id="'question-' + index" :name="'question-' + index" :questionNumber="index + 1" />
      </div>
      <button type="button" @click="addNewQuestionPrompt">Add New Question</button>
      <button v-if="testHasQuestions" type="submit">Submit</button>
    </form>
  </div>
</template>

<script>
import NewQuestion from './NewQuestion.vue';

export default {
  components: {
    NewQuestion,
  },
  data() {
    return {
      taskDescription: '',
      testHasQuestions: false,
      questions: [],
      correctAnswers: [[]], // Add correctAnswers array here
    };
  },
  methods: {
    collapse() {
      this.$emit('collapse');
    },
    addNewQuestionPrompt() {
      // Add a new question component to the array when the button is clicked
      this.testHasQuestions = true;
      this.questions.push({ text: '', answerChoices: ['', '', '', ''], correctAnswer: 0 });
      console.log(this.questions);
    },
    async handleSubmit() {
      const formElement = document.getElementById('createNewDocumentForm');
      console.log(formElement);
      const formData = new FormData(formElement);
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
    },
  },
};
</script>

<style>
.createDocumentForm {
  max-width: 600px;
  margin: 0 auto;
}

.add-question-button,
.submit-button {
  display: block;
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-question-button:hover,
.submit-button:hover {
  background-color: #45a049;
}
</style>
