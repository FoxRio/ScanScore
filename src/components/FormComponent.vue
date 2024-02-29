<template>
  <div class="createDocumentForm">
    <form @submit.prevent="addNewQuestionPrompt" id="createNewDocumentForm">
      <label :for="id" class="question-label">Please enter Question:
        <textarea :id="name" :name="name" required placeholder="Write your question here..." v-model="questionText"
          class="question-textarea"></textarea>
      </label>
      <div class="answer-container">
        <label for="answer1"> Answer:
          <input type=" text" id="answer1" name="answer1" v-model="answer1">
          <label for="correctanswer1">This is the correct answer
            <input type="checkbox" id="correctanswer1" v-model="isChecked1">
          </label></label>
        <label for="answer2"> Answer:
          <input type=" text" id="answer1" name="answer2" v-model="answer2" required>
          <label for="correctanswer2">This is the correct answer
            <input type="checkbox" id="correctanswer2" v-model="isChecked2">
          </label></label>
        <label for="answer3"> Answer:
          <input type=" text" id="answer3" name="answer3" v-model="answer3" required>
          <label for="correctanswer3">This is the correct answer
            <input type="checkbox" id="correctanswer3" v-model="isChecked3">
          </label></label>
        <label for="answer4"> Answer:
          <input type=" text" id="answer4" name="answer4" v-model="answer4" required>
          <label for="correctanswer4">This is the correct answer
            <input type="checkbox" id="correctanswer4" v-model="isChecked4">
          </label></label>
      </div>
      <button type="button" @click="addNewQuestionPrompt">Add This Question</button>
    </form>
    <div v-for="(question, index) in questions" :key="index">
      <NewQuestion :questionData="question" @deleteEvent="deleteQuestion(index)" />
    </div>
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
      questionText: null,
      answer1: null,
      answer2: null,
      answer3: null,
      answer4: null,
      isChecked1: false,
      isChecked2: false,
      isChecked3: false,
      isChecked4: false,
      testHasQuestions: false,
      questions: [],
    };
  },
  methods: {
    collapse() {
      this.$emit('collapse');
    },
    deleteQuestion(index) {
      // Remove the question at the specified index from the questions array
      console.log('deleteQuestion', index);
      this.questions.splice(index, 1);
      console.log(this.questions);
    },
    addNewQuestionPrompt() {
      // Add a new question component to the array when the button is clicked
      if (this.questionText && (this.answer1 || this.answer2 || this.answer3 || this.answer4)) {
        const question = {
          questionText: this.questionText,
          answers: {
            answer1: {
              text: this.answer1,
              correct: this.isChecked1,
            },
            answer2: {
              text: this.answer2,
              correct: this.isChecked2,
            },
            answer3: {
              text: this.answer3,
              correct: this.isChecked3,
            },
            answer4: {
              text: this.answer4,
              correct: this.isChecked4,
            },
          },
        };
        this.testHasQuestions = true;
        this.questions.push(question);
        this.questionText = null;
        this.answer1 = null;
        this.answer2 = null;
        this.answer3 = null;
        this.answer4 = null;
        this.isChecked1 = false;
        this.isChecked2 = false;
        this.isChecked3 = false;
        this.isChecked4 = false;
      }
      alert('Question Not Added, Please input a question text and at least one answer!');
    },
    async handleSubmit() {
      const formElement = document.getElementById('createNewDocumentForm');
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
  border: 1px solid #ccc;
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

.question-label {
  font-weight: bold;
}

.question-textarea {
  width: 90%;
  height: 100px;
  /* Adjust height as needed */
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 8px;
  margin-bottom: 20px;
}

.answer-container {
  margin-bottom: 20px;
}

.answer-container label {
  display: block;
  margin-bottom: 10px;
}

.answer-container input[type="text"] {
  width: calc(100% - 30px);
  /* Adjust width as needed */
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.answer-container input[type="checkbox"] {
  margin-left: 10px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
}

button:hover {
  background-color: #0056b3;
}
</style>
