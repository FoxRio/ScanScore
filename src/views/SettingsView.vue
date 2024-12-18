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
      <label for="currentPassword">
        <input id="currentPassword" type="password" v-model="currentPassword" placeholder="Enter current password" />
      </label>
      <input type="password" v-model="newPassword" placeholder="Enter new password" />
      <button @click="changePassword">Change Password</button>
    </div>

    <div class="delete-account">
      <h2>Delete Account</h2>
      <p>This will delete your account and all the tests you've created. This action is irreversible.</p>
      <button @click="showDeletePopup">Delete My Account</button>
    </div>

    <!-- Include the popup component -->
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
      isPopupVisible: false, // Controls popup visibility
    };
  },
  methods: {
    // Show the delete account confirmation popup
    showDeletePopup() {
      this.isPopupVisible = true;
    },

    // Close the popup
    closePopup() {
      this.isPopupVisible = false;
    },

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
          await updatePassword(user, this.newPassword);
          alert('Password updated successfully!');
        } catch (error) {
          console.error('Error changing password:', error);
          alert('Failed to change password.');
        }
      }
    },

    // Delete Account
    async deleteAccount(password) {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        try {
          const credential = EmailAuthProvider.credential(user.email, password);
          await reauthenticateWithCredential(user, credential);

          const db = getFirestore();
          const userId = user.uid;

          // Delete all tests created by this user
          const testsQuery = query(collection(db, 'tests'), where('userId', '==', userId));
          const querySnapshot = await getDocs(testsQuery);
          querySnapshot.forEach(async (docx) => {
            await deleteDoc(doc(db, 'tests', docx.id));
          });

          // Delete user account
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
/* Your existing styles */
</style>
