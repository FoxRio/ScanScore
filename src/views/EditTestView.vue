<template>
  <div>
    <h1>Edit Test</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <form @submit.prevent="updateTest">
        <div>
          <label for="testName">Test Name:
          <input
            type="text"
            id="testName"
            v-model="test.title"
            required
          /></label>
        </div>
        <div>
          <label for="testDescription">Description:
          <textarea
            id="testDescription"
            v-model="test.description"
            required
          ></textarea></label>
        </div>

        <h2>Questions</h2>
        <div v-for="(question, index) in test.questions" :key="index">
          <NewQuestion
            :questionData="question"
            @deleteEvent="deleteQuestion(index)"
          />
        </div>

        <button @click="addQuestion" type="button">Add Question</button>
        <button type="submit">Save Changes</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import NewQuestion from '../components/DisplayedQuestion.vue';

export default {
  name: 'EditTest',
  components: {
    NewQuestion,
  },
  data() {
    return {
      test: {
        title: '',
        description: '',
        questions: [],
      },
      loading: true,
      testId: null, // Store the test ID here
    };
  },
  methods: {
    async fetchTest() {
      const db = getFirestore();
      const docRef = doc(db, 'tests', this.testId);
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data());
          this.test = { id: docSnap.id, ...docSnap.data() };
        } else {
          console.error('No such document!');
        }
      } catch (error) {
        console.error('Error fetching test:', error);
      } finally {
        this.loading = false;
      }
    },

    async updateTest() {
      const db = getFirestore();
      try {
        await db.collection('tests').doc(this.testId).update({
          title: this.test.title,
          description: this.test.description,
          questions: this.test.questions,
        });
        alert('Test updated successfully!');
        this.$router.push({ name: 'Mytests' }); // Redirect after updating
      } catch (error) {
        console.error('Error updating test:', error);
      }
    },

    cancelEdit() {
      this.$router.push({ name: 'Mytests' }); // Redirect to the My Tests page
    },

    deleteQuestion(index) {
      console.log('deleteQuestion', index);
      this.test.questions.splice(index, 1);
    },

    addQuestion() {
      // Logic to add a new question
      this.test.questions.push({
        questionText: '',
        answers: [
          { text: '', correct: false },
          { text: '', correct: false },
          { text: '', correct: false },
          { text: '', correct: false },
        ],
      });
    },
  },
  mounted() {
    // Get the test ID from the route parameters
    this.testId = this.$route.params.id;
    this.fetchTest(); // Fetch the test data when the component is mounted
  },
};
</script>

<style scoped>
/* Add any styles you want for your EditTest component */
form {
  max-width: 400px;
  margin: auto;
}
label {
  display: block;
  margin: 0.5rem 0 0.2rem;
}
input, textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
button {
  margin-right: 1rem;
}
</style>
