<template>
  <div>
    <h1>Saved Tests</h1>
    <div v-for="test in tests" :key="test.id">
      <h2>{{ test.title }}</h2>
      <button @click="editTest(test.id)">Edit</button>
    </div>
  </div>
</template>

<script>
import {
  getFirestore, collection, query, where, getDocs,
} from 'firebase/firestore';
import { auth } from '../firebase';

export default {
  data() {
    return {
      tests: [],
    };
  },
  async mounted() {
    const db = getFirestore();
    const userId = auth.currentUser ? auth.currentUser.uid : null;
    console.log('User ID:', userId);

    if (userId) {
      // Query to get only the tests created by the authenticated user
      const testsQuery = query(collection(db, 'tests'), where('userId', '==', userId));
      const querySnapshot = await getDocs(testsQuery);
      this.tests = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } else {
      console.error('User is not authenticated');
      this.goToHome();
    }
  },
  methods: {
    editTest(id) {
      // Redirect to edit page or load test for editing
      this.$router.push({ name: 'EditTest', params: { id } });
    },
    goToHome() {
      this.$router.push('/');
    },
  },
};
</script>
