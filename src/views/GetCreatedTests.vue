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
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      tests: [],
    };
  },
  async mounted() {
    const db = getFirestore();
    const querySnapshot = await getDocs(collection(db, 'tests'));
    this.tests = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },
  methods: {
    editTest(id) {
      // Redirect to edit page or load test for editing
      this.$router.push({ name: 'EditTest', params: { id } });
    },
  },
};
</script>
