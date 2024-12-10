<template>
  <div>
    <h2>Generate a Test Question</h2>
    <input v-model="userInput" placeholder="Enter a topic for the question" />
    <button @click="generateQuestion">Generate Question</button>

    <div v-if="question">
      <h3>Generated Question:</h3>
      <p>{{ question.questionText }}</p>
      <h4>Answers:</h4>
      <ul>
        <li v-for="(answer, key) in question.answers" :key="key">
          {{ answer.text }} <span v-if="answer.correct">(Correct)</span>
        </li>
      </ul>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
// import { generateContent } from './firebase'; // Adjust the path as necessary

export default {
  data() {
    return {
      userInput: '',
      question: null,
      error: null,
    };
  },
  methods: {
    // async generateQuestion() {
    //   this.error = null; // Reset error state
    //   try {
    //     const prompt = `Generate a multiple choice question about ${this.userInput}. Provide the question text and four answer options, with one correct answer.`;
    //     const generatedContent = await generateContent(prompt);

    //     // Parse the AI's response into the desired format
    //     this.question = this.parseQuestion(generatedContent);
    //   } catch (error) {
    //     this.error = 'Failed to generate question. Please try again.';
    //     console.error(error);
    //   }
    // },
    parseQuestion(content) {
      // Example parsing logic; this should match the format returned by your AI model
      return {
        questionText: content.questionText || 'Generated question text here', // Replace with actual AI response
        answers: {
          answer1: { text: content.answers[0].text, correct: content.answers[0].correct },
          answer2: { text: content.answers[1].text, correct: content.answers[1].correct },
          answer3: { text: content.answers[2].text, correct: content.answers[2].correct },
          answer4: { text: content.answers[3].text, correct: content.answers[3].correct },
        },
      };
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
