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
          <div v-if="editingIndex !== index">
            <NewQuestion
              :questionData="question"
              @deleteEvent="deleteQuestion(index)"
              @editEvent="editQuestion(index)"
            />
          </div>
          <div v-else>
            <QuestionEditComponent
              :questionData="question"
              @updateQuestion="updateQuestion(index, $event)"
              @cancelEdit="cancelEdit"
            />
          </div>
        </div>

        <button @click="addQuestion" type="button">Add Question</button>
        <button type="submit">Save Changes</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import {
  getFirestore, doc, getDoc, updateDoc,
} from 'firebase/firestore';
import NewQuestion from '../components/DisplayedQuestion.vue';
import QuestionEditComponent from '../components/QuestionEditComponent.vue';

export default {
  name: 'EditTest',
  components: {
    NewQuestion,
    QuestionEditComponent,
  },
  data() {
    return {
      test: {
        title: '',
        description: '',
        questions: [],
      },
      loading: true,
      testId: null,
      editingIndex: null,
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
      console.log(this.test);
      const db = getFirestore();
      try {
        const docRef = doc(db, 'tests', this.testId);
        await updateDoc(docRef, this.test);
        alert('Test updated successfully!');
        this.$router.push({ name: 'Mytests' });
      } catch (error) {
        console.error('Error updating test:', error);
      }
    },

    cancelEdit() {
      this.$router.push({ name: 'Mytests' });
    },

    deleteQuestion(index) {
      console.log('deleteQuestion', index);
      this.test.questions.splice(index, 1);
    },

    addQuestion() {
      this.test.questions.push({
        questionText: '',
        answers: [
          { text: '', correct: false },
          { text: '', correct: false },
          { text: '', correct: false },
          { text: '', correct: false },
        ],
      });
      this.editQuestion(this.test.questions.length - 1);
    },
    editQuestion(index) {
      this.editingIndex = index;
    },
    updateQuestion(index, updatedQuestion) {
      this.test.questions[index] = updatedQuestion;
      this.editingIndex = null;
    },
  },
  mounted() {
    this.testId = this.$route.params.id;
    this.fetchTest();
  },
};
</script>

<style scoped>
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
