<template>
  <div class="createDocumentForm">
    <form @submit.prevent="addNewQuestionPrompt" id="createNewDocumentForm">

      <!-- Title Field -->
      <div class="mb-3">
        <label for="titleId" class="form-label">Title:
          <input type="text" :id="titleId" v-model="title" class="form-control form-control-lg" required
            placeholder="Enter the title" /></label>
      </div>

      <!-- Description Field -->
      <div class="mb-3">
        <label for="descriptionId" class="form-label">Description:
          <textarea :id="descriptionId" v-model="description" class="form-control form-control-lg" required
            placeholder="Enter the description"></textarea></label>
      </div>

      <!-- Question Field -->
      <div class="mb-3">
        <label for="questionId" class="form-label">Please enter Question:
          <textarea :id="questionId" v-model="questionText" class="form-control form-control-lg" required
            :placeholder="placeholderQText"></textarea></label>
      </div>

      <!-- Answer Fields -->
      <div class="mb-4">
        <!-- Answer 1 -->
        <div class="mb-3">
          <label for="answer1" class="form-label">Answer 1:
            <input type="text" id="answer1" v-model="answer1" class="form-control form-control-lg"
              :placeholder="placeholderAText" required /></label>
          <div class="form-check">
            <label for="correctanswer1" class="form-check-label">This is the correct answer
              <input type="checkbox" id="correctanswer1" v-model="isChecked1" class="form-check-input" /></label>
          </div>
        </div>

        <!-- Answer 2 -->
        <div class="mb-3">
          <label for="answer2" class="form-label">Answer 2:
            <input type="text" id="answer2" v-model="answer2" class="form-control form-control-lg"
              :placeholder="placeholderAText" required /></label>
          <div class="form-check">
            <label for="correctanswer2" class="form-check-label">This is the correct answer
              <input type="checkbox" id="correctanswer2" v-model="isChecked2" class="form-check-input" /></label>
          </div>
        </div>

        <!-- Answer 3 -->
        <div class="mb-3">
          <label for="answer3" class="form-label">Answer 3:
            <input type="text" id="answer3" v-model="answer3" class="form-control form-control-lg"
              :placeholder="placeholderAText" required /></label>
          <div class="form-check">
            <label for="correctanswer3" class="form-check-label">This is the correct answer
              <input type="checkbox" id="correctanswer3" v-model="isChecked3" class="form-check-input" /></label>
          </div>
        </div>

        <!-- Answer 4 -->
        <div class="mb-3">
          <label for="answer4" class="form-label">Answer 4:
            <input type="text" id="answer4" v-model="answer4" class="form-control form-control-lg"
              :placeholder="placeholderAText" required /></label>
          <div class="form-check">
            <label for="correctanswer4" class="form-check-label">This is the correct answer
              <input type="checkbox" id="correctanswer4" v-model="isChecked4" class="form-check-input" /></label>
          </div>
        </div>
      </div>

      <!-- Add Question Button -->
      <button type="button" @click="addNewQuestionPrompt" class="btn btn-primary w-100">Add This Question</button>
    </form>
  </div>
</template>

<script setup>
// import NewQuestion from './DisplayedQuestion.vue';

const emit = defineEmits(['updatedQuestions']);

function updateHasQuestions(value) {
  emit('updatedQuestions', value);
}
defineExpose({ updateHasQuestions });
</script>

<script>

export default {
  components: {
    // NewQuestion,
  },
  data() {
    return {
      title: '',
      description: '',
      questionText: process.env.NODE_ENV === 'production' ? null : 'TEST QUESTION x',
      answer1: process.env.NODE_ENV === 'production' ? null : 'TEST ANSWER 1',
      answer2: process.env.NODE_ENV === 'production' ? null : 'TEST ANSWER 2',
      answer3: process.env.NODE_ENV === 'production' ? null : 'TEST ANSWER 3',
      answer4: process.env.NODE_ENV === 'production' ? null : 'TEST ANSWER 4',
      isChecked1: process.env.NODE_ENV !== 'production',
      isChecked2: false,
      isChecked3: false,
      isChecked4: false,
      testHasQuestions: false,
      questions: [],
      placeholderQText: process.env.NODE_ENV === 'production' ? 'Write your question here...' : 'TEST QUESTION x',
      placeholderAText: process.env.NODE_ENV === 'production' ? 'Write your answer here...' : 'TEST ANSWER x',
      titleError: false,
    };
  },
  methods: {
    deleteQuestion(index) {
      // Remove the question at the specified index from the questions array
      console.log('deleteQuestion', index);
      this.questions.splice(index, 1);
      this.testHasQuestions = this.questions.length > 0;
      this.$emit('updatedQuestions', this.testHasQuestions, this.questions);
    },
    addNewQuestionPrompt() {
      // Add a new question component to the array when the button is clicked
      if (this.questionText && (this.answer1 || this.answer2 || this.answer3 || this.answer4)) {
        // console.log('--------BEFORE CREATING QUESTION----------');
        const question = {
          questionText: this.questionText,
          answers: {
            A: {
              text: this.answer1,
              correct: this.isChecked1,
            },
            B: {
              text: this.answer2,
              correct: this.isChecked2,
            },
            C: {
              text: this.answer3,
              correct: this.isChecked3,
            },
            D: {
              text: this.answer4,
              correct: this.isChecked4,
            },
          },
        };
        // console.log('--------Pushing to questions array----------');
        if (process.env.NODE_ENV !== 'production') {
          this.questions.push(
            {
              questionText: 'What is the capital of France?',
              answers: {
                A: { text: 'Paris', correct: true },
                B: { text: 'London', correct: false },
                C: { text: 'Berlin', correct: false },
                D: { text: 'Rome', correct: false },
              },
            },
            {
              questionText: 'Which planet is known as the Red Planet?',
              answers: {
                A: { text: 'Mars', correct: true },
                B: { text: 'Venus', correct: false },
                C: { text: 'Jupiter', correct: false },
                D: { text: 'Saturn', correct: false },
              },
            },
            {
              questionText: 'Who painted the Mona Lisa?',
              answers: {
                A: { text: 'Leonardo da Vinci', correct: true },
                B: { text: 'Vincent van Gogh', correct: false },
                C: { text: 'Pablo Picasso', correct: false },
                D: { text: 'Michelangelo', correct: false },
              },
            },
            {
              questionText: 'What is the tallest mountain in the world?',
              answers: {
                A: { text: 'Mount Everest', correct: true },
                B: { text: 'Mount Kilimanjaro', correct: true },
                C: { text: 'K2', correct: false },
                D: { text: 'Mount Fuji', correct: false },
              },
            },
            {
              questionText: 'What is the chemical symbol for water?',
              answers: {
                A: { text: 'H2O', correct: true },
                B: { text: 'CO2', correct: false },
                C: { text: 'O2', correct: false },
                D: { text: 'NaCl', correct: false },
              },
            },
          );
        }
        this.questions.push(question);
        this.testMetadata = {
          title: this.title,
          description: this.description,
        };
        this.testHasQuestions = true;
        this.$emit('updatedQuestions', true, this.questions, this.testMetadata);
        this.questionText = process.env.NODE_ENV === 'production' ? null : 'TEST QUESTION x';
        this.answer1 = process.env.NODE_ENV === 'production' ? null : 'TEST ANSWER 1';
        this.answer2 = process.env.NODE_ENV === 'production' ? null : 'TEST ANSWER 2';
        this.answer3 = process.env.NODE_ENV === 'production' ? null : 'TEST ANSWER 3';
        this.answer4 = process.env.NODE_ENV === 'production' ? null : 'TEST ANSWER 4';
        this.isChecked1 = process.env.NODE_ENV !== 'production';
        this.isChecked2 = false;
        this.isChecked3 = false;
        this.isChecked4 = false;
        console.log('questions', this.questions);
        return 0;
      }
      alert('Question Not Added, Please input a question text and at least one answer!');
      return 0;
    },
    async handleSubmit() {
      const formElement = document.getElementById('createNewDocumentForm');
      console.log('Form submitted with the following data:', formElement);
      const formData = new FormData(formElement);
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
    },
  },
};
</script>

<style scoped>
.createDocumentForm {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f5fff6;
}

.form-label {
  color: #0638b8;
}

button {
  background-color: #d44e00;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #ba4300;
}

.form-control-lg {
  font-size: 1.25rem;
  height: 6rem;
  width: 600px;

}

textarea.form-control-lg {
  width: 600px;
}

input.form-control-lg {
  height: 3rem;
  width: 600px;

}
</style>
