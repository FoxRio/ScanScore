<template>
  <div class="grade-tests-view container">
    <!-- Header Section -->
    <div class="header text-center mb-5">
      <h1 class="text-danger">Grade Tests</h1>
      <p>
        Upload a filled-in test answer sheet, and let our system grade it for you!
        Using advanced computer vision techniques, we analyze the uploaded image
        to detect answers and compare them against the answer key. It's much faster
        and more accurate than manual grading!
      </p>
    </div>

    <!-- Upload Section -->
    <div class="upload-section text-center mb-5">
      <h3 class="mb-4">Upload Test Image</h3>

      <!-- File Input visible to the user -->
      <div class="form-group">
        <label for="file" class="btn btn-primary btn-lg mb-3">Select Test Image
        <input
          ref="file"
          type="file"
          id="file"
          class="form-control-file"
          @change="handleFileUpload"
          style="display: none;"
        /></label>
      </div>

      <p v-if="uploadedImage" class="mt-3 text-success">
        <strong>File selected:</strong> {{ uploadedImage.name }}
      </p>
      <div v-if="uploadedImage">
        <button
          class="btn btn-info btn-lg"
          @click="uploadFileToFirebase"
        >
          Upload to Firebase
        </button>
      </div>
    </div>

    <!-- Grading Section -->
    <div class="grading-section text-center mb-5">
      <h3 class="mb-4">Grade Test</h3>
      <button
        class="btn btn-success btn-lg"
        :disabled="!uploadedImage"
        @click="gradeTest"
      >
        Grade Test
      </button>
    </div>

    <!-- Results Section -->
    <div v-if="results" class="results-section mt-5">
      <h2 class="text-center text-success">Results</h2>
      <!-- Placeholder for results -->
      <p>{{ results }}</p>
    </div>
  </div>
</template>
<script>
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Firebase Storage
import { getAuth } from 'firebase/auth'; // Firebase Auth
import { storage } from '@/firebase'; // Assuming you have Firebase configured

export default {
  name: 'GradeTestsView',
  data() {
    return {
      uploadedImage: null, // Store the uploaded image
      results: null, // Store grading results
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedImage = file; // Store the file for processing
        console.log('File uploaded:', file.name);
      }
    },

    async uploadFileToFirebase() {
      if (!this.uploadedImage) {
        alert('No file selected for upload!');
        return;
      }

      const file = this.uploadedImage;
      const userId = getAuth().currentUser.uid; // Get the user ID from Firebase Auth

      // Create reference for the user's 'userUploads/userId/uploaded'
      const storageRef = ref(storage, `userUploads/${userId}/uploaded/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor the upload task for progress or errors
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // You can monitor progress if needed, e.g., by displaying a progress bar
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          // Get the download URL after successful upload
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at:', downloadURL);
            // Optionally, save this URL to Firestore or elsewhere
            alert('File uploaded successfully!');
            this.uploadedImage = null; // Reset the uploaded image
          });
        },
      );
    },

    gradeTest() {
      if (!this.uploadedImage) {
        alert('Please upload a test image first!');
        return;
      }

      // Placeholder for grading logic
      console.log('Ready to implement grading logic here.');
    },
  },
};
</script>

<style scoped>
.grade-tests-view {
  padding: 40px 15px;
  background-color: #f5fff6; /* themeLighter */
}

.header h1 {
  color: #d44e00; /* themePrimary */
}

.header p {
  font-size: 1rem;
  margin-top: 10px;
}

.upload-section {
  margin-top: 30px;
}

.results-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #eaf4eb; /* neutralLighter */
  border: 1px solid #d1dad2; /* neutralQuaternaryAlt */
  border-radius: 5px;
}
</style>
