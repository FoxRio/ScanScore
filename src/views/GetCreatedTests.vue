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
import { getAuth } from 'firebase/auth';

export default {
  data() {
    return {
      tests: [],
    };
  },
  async mounted() {
    const db = getFirestore();
    const auth = getAuth();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (userId) {
      // Query to get only the tests created by the authenticated user
      const testsQuery = query(collection(db, 'tests'), where('ownerId', '==', userId));
      const querySnapshot = await getDocs(testsQuery);
      this.tests = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } else {
      console.error('User is not authenticated');
      // Handle unauthenticated state (e.g., redirect to login)
    }
  },
  methods: {
    editTest(id) {
      // Redirect to edit page or load test for editing
      this.$router.push({ name: 'EditTest', params: { id } });
    },
  },
};
</script>
