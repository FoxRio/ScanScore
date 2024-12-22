<template>
  <div>
    <h1>Check User Permissions</h1>
    <button @click="checkUserPermissions">Check Permissions</button>
    <div v-if="message">{{ message }}</div>
  </div>
</template>

<script>
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase';

export default {
  data() {
    return {
      message: '',
    };
  },
  methods: {
    async checkUserPermissions() {
      const db = getFirestore();
      const userId = auth.currentUser ? auth.currentUser.uid : null;

      if (userId) {
        const docRef = doc(db, 'tests', 'HeMpC5TDNhIxWfxq5O8t');

        try {
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            // this.message = "Document data: " + JSON.stringify(docSnap.data());
          } else {
            // this.message = "No such document!";
          }
        } catch (error) {
          console.error('Error getting document:', error);
          if (error.code === 'permission-denied') {
            this.message = 'User does not have permission to access this document.';
          } else {
            // this.message = 'An error occurred: ' + error.message;
          }
        }
      } else {
        this.message = 'User is not authenticated.';
      }
    },
  },
};
</script>
