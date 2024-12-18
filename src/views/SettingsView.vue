<template>
  <div class="settings">
    <h1>Account Settings</h1>

    <div class="profile-settings">
      <h2>Change Display Name</h2>
      <label for="displayName">
      <input id=displayName type="text" v-model="newDisplayName" placeholder="Enter new display name" /></label>
      <button @click="updateDisplayName">Update Display Name</button>
    </div>

    <div class="password-change">
      <h2>Change Password</h2>
      <label for="currentPassowrd">
      <input id=currentPassowrd type="password" v-model="currentPassword" placeholder="Enter current password" /></label>
      <input type="password" v-model="newPassword" placeholder="Enter new password" />
      <button @click="changePassword">Change Password</button>
    </div>

    <div class="delete-account">
      <h2>Delete Account</h2>
      <p>This will delete your account and all the tests you've created. This action is irreversible.</p>
      <button @click="deleteAccount">Delete My Account</button>
    </div>
  </div>
</template>

<script>
import {
  getFirestore, collection, query, where, getDocs, deleteDoc, doc,
} from 'firebase/firestore'; // Adjust the import path based on your project structure
import {
  getAuth, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider,

} from 'firebase/auth';

export default {
  data() {
    return {
      newDisplayName: '',
      currentPassword: '',
      newPassword: '',
    };
  },
  methods: {
    // Update Display Name
    async updateDisplayName() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        try {
          await updateProfile(user, { displayName: this.newDisplayName });
          alert('Display name updated successfully!');
        } catch (error) {
          console.error('Error updating display name:', error);
          alert('Failed to update display name.');
        }
      }
    },

    // Change Password
    async changePassword() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        try {
          updatePassword(user, this.newPassword);
          await user.updatePassword(this.newPassword);
          alert('Password updated successfully!');
        } catch (error) {
          // const credential = await promptForCredentials();
          // reauthenticateWithCredential(user, credential);
          console.error('Error changing password:', error);
          alert('Failed to change password.');
        }
      }
    },
    // async promptForCredentials() {
    //   const password = this.currentPassword;
    //   return credential;
    // },

    async deleteAccount() {
      const db = getFirestore();
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user ? user.uid : null;

      if (userId) {
        try {
          const credential = EmailAuthProvider.credential(
            user.email,
            this.currentPassword,
          );

          await reauthenticateWithCredential(user, credential);

          // Delete all tests created by this user
          const testsQuery = query(collection(db, 'tests'), where('userId', '==', userId));
          const querySnapshot = await getDocs(testsQuery);

          if (!querySnapshot.empty) {
            querySnapshot.forEach(async (docx) => {
              await deleteDoc(doc(db, 'tests', docx.id));
            });
            console.log('Deleted all user tests');
          }
          await user.delete();
          this.$router.push('/goodbye');
        } catch (error) {
          console.error('Error deleting account:', error);
          if (error.code === 'auth/requires-recent-login') {
            alert('You need to log in again to delete your account.');
          } else {
            alert('Failed to delete account.');
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.settings {
  width: 80%;
  margin: auto;
  background-color: #f5fff6; /* Background color */
  padding: 20px;
  border-radius: 8px;
}

h1 {
  text-align: center;
  color: #0638b8; /* Text color */
}

h2 {
  color: #0638b8; /* Text color */
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

button {
  background-color: #d44e00; /* Primary color */
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
}

button:hover {
  background-color: #b43e00; /* Slightly darker primary color for hover */
}

button:focus {
  outline: none;
}

.delete-account p {
  font-size: 0.9em;
  color: #0638b8; /* Text color */
}
</style>
