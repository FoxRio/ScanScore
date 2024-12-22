<template>
  <div class="settings">
    <h1>Account Settings</h1>
    <div class="profile-settings">
      <h2>Change Display Name</h2>
      <label for="displayName">
        <input id="displayName" type="text" v-model="newDisplayName" placeholder="Enter new display name" />
      </label>
      <button @click="updateDisplayName">Update Display Name</button>
    </div>
    <div class="password-change">
      <h2>Change Password</h2>
      <div class="input-container">
        <label for="currentPassword" class="input-label">Current Password
        <input id="currentPassword" type="password" v-model="currentPassword" placeholder="Enter current password" class="input-field" /></label>
      </div>
      <div class="input-container">
        <label for="newPassword" class="input-label">New Password
        <input id="newPassword" type="password" v-model="newPassword" placeholder="Enter new password" class="input-field" /></label>
      </div>
      <button @click="changePassword">Change Password</button>
    </div>
    <div class="delete-account">
      <h2>Delete Account</h2>
      <p>This will delete your account and all the tests you've created. This action is irreversible.</p>
      <button @click="showDeletePopup">Delete My Account</button>
    </div>
    <PopupComponent
      v-if="isPopupVisible"
      :isVisible="isPopupVisible"
      @close="closePopup"
      @confirm="deleteAccount"
    />
  </div>
</template>

<script>
import {
  getAuth, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider,

} from 'firebase/auth';
import {
  getFirestore, collection, query, where, getDocs, deleteDoc, doc,
} from 'firebase/firestore';
import PopupComponent from '../components/ConfirmAuthentification.vue';

export default {
  components: {
    PopupComponent,
  },
  data() {
    return {
      newDisplayName: '',
      currentPassword: '',
      newPassword: '',
      isPopupVisible: false,
    };
  },
  mounted() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user && user.displayName) {
      this.newDisplayName = user.displayName; // Prefill the input field
    }
  },
  methods: {
    showDeletePopup() {
      this.isPopupVisible = true;
    },

    closePopup() {
      this.isPopupVisible = false;
    },
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
          await updatePassword(user, this.newPassword);
          alert('Password updated successfully!');
        } catch (error) {
          console.error('Error changing password:', error);
          alert('Failed to change password.');
        }
      }
    },
    // Delete Account and all tests that the user has created
    async deleteAccount(password) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        try {
          const credential = EmailAuthProvider.credential(user.email, password);
          await reauthenticateWithCredential(user, credential);
          const db = getFirestore();
          const userId = user.uid;
          const testsQuery = query(collection(db, 'tests'), where('userId', '==', userId));
          const querySnapshot = await getDocs(testsQuery);
          querySnapshot.forEach(async (docx) => {
            await deleteDoc(doc(db, 'tests', docx.id));
          });
          await user.delete();
          alert('Account deleted successfully.');
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
  background-color: #f5fff6;
  padding: 20px;
  border-radius: 8px;
}
.password-change, .profile-settings, .delete-account {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f5fff6;
  margin-top: 20px;
}

h1 {
  text-align: center;
  color: #0638b8;
}

h2 {
  color: #0638b8;
}

.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input-label {
  font-size: 1rem;
  margin-bottom: 5px;
  font-weight: bold;
  color: #0638b8;
}

.input-field {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  background-color: #ffffff;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #d44e00;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
}

button:hover {
  background-color: #b43e00;
}

button:focus {
  outline: none;
}

.delete-account p {
  font-size: 0.9em;
  color: #0638b8;
}
</style>
