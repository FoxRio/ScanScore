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
      <div class="form-group">
        <label for="file" class="btn btn-primary btn-lg mb-3">Select Test Image
        <input
          ref="file"
          type="file"
          id="file"
          class="form-control-file"
          @change="handleFileUpload"
          style="display: none;"/>
        </label>
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

      <!-- Progress Section -->
      <div v-if="uploading" class="mt-3">
        <p>Upload Progress: {{ uploadProgress }}%</p>
        <div class="progress" style="height: 20px;">
          <div class="progress-bar" role="progressbar" :style="{ width: uploadProgress + '%' }" aria-valuenow="uploadProgress" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    </div>

    <!-- Grading Section -->
    <div class="grading-section text-center mb-5">
      <h3 class="mb-4">Grade Test</h3>
      <div v-if="hasFiles">
        <label for="answerKey">Enter Answer Key (e.g., 1,0,0,1,...):
          <input type="text" id="answerKey" v-model="answerKey" />
        </label>
        <div v-for="file in userFiles" :key="file.name" class="mb-3">
          <p>{{ file.name }}</p>
          <button
            class="btn btn-success btn-lg"
            @click="gradeTest(file)"
          >
            Grade Test
          </button>
        </div>
      </div>
      <p v-else>No files uploaded yet. Please upload a test image.</p>
    </div>

    <!-- Results Section -->
    <div v-if="results" class="results-section mt-5">
      <h2 class="text-center text-success">Results</h2>
      <p>Score: {{ results.response.score }} / {{ results.response.maxScore }}</p>
      <p>Percentage: {{ results.response.percentageValue }}%</p>
    </div>
  </div>
</template>

<script>
import {
  ref, uploadBytesResumable, getDownloadURL, listAll,
} from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { storage } from '@/firebase';
import axios from 'axios';

export default {
  name: 'GradeTestsView',
  data() {
    return {
      uploadedImage: null,
      uploadProgress: 0,
      uploading: false,
      results: null,
      hasFiles: null,
    };
  },
  async mounted() {
    this.fetchUserFiles();
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedImage = file;
      }
    },
    async fetchUserFiles() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const userFolderRef = ref(storage, `userUploads/${userId}/uploaded`);
        try {
          const res = await listAll(userFolderRef);
          const files = await Promise.all(
            res.items.map(async (itemRef) => {
              const fileUrl = await getDownloadURL(itemRef);
              return {
                name: itemRef.name,
                url: fileUrl,
              };
            }),
          );
          this.userFiles = files;
          if (files.length > 0) {
            this.hasFiles = true;
          }
        } catch (error) {
          console.error('Error fetching files:', error);
        }
      }
    },

    async uploadFileToFirebase() {
      if (!this.uploadedImage) {
        alert('No file selected for upload!');
        return;
      }

      const file = this.uploadedImage;
      const userId = getAuth().currentUser.uid;
      const timestamp = new Date().getTime();
      const folderName = `${file.name.replace(/\.[^/.]+$/, '')}_${timestamp}`;
      const storageRef = ref(storage, `userUploads/${userId}/${folderName}/${file.name}`);

      const uploadTask = uploadBytesResumable(storageRef, file);
      this.uploading = true;

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            this.userFiles.push({ name: file.name, url: downloadURL, folder: folderName });
            this.uploading = false;
            this.uploadProgress = 0;
            this.uploadedImage = null;
          });
        },
      );
    },
    async gradeTest(file) {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user.uid;
      const answerKeyInput = document.getElementById('answerKey').value;
      const answers = answerKeyInput.split(',').map((value) => parseInt(value.trim(), 10));
      if (answers.length === 0 || answers.some((val) => val !== 0 && val !== 1)) {
        alert('Answer key must be a comma-separated list of 1s and 0s.');
        return;
      }
      try {
        const response = await axios.post('https://us-central1-scanscore-6cbf7.cloudfunctions.net/api/grade-test', {
          correctAnswers: answers,
          userId,
          fileName: file.name,
          fileUrl: file.url,
        });
        this.results = response.data;
      } catch (error) {
        console.error('Error grading the test:', error);
      }
    },
  },
};
</script>

<style scoped>
.grade-tests-view {
  padding: 40px 15px;
  background-color: #f5fff6;
}

.header h1 {
  color: #d44e00;
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
  background-color: #eaf4eb;
  border: 1px solid #d1dad2;
  border-radius: 5px;
}
</style>
