<template>
  <div class="grade-tests-view container">
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
      <div v-for="folder in userFiles" :key="folder?.folderName" class="folder-container">
        <h4>{{ folder?.folderMetadata?.folderName.split('_')[0] }}</h4>
        <div v-if="!folder.folderMetadata.answerKey && !folder.folderMetadata.gradedImage" class="mb-3">
          <div class="btn-group mt-3">
            <button @click="getAnswerKey(folder)" class="btn btn-warning mx-2">Get Answer Key</button>
            <button @click="gradeTest(folder)" class="btn btn-success mx-2">Grade Test</button>
          </div>
        </div>
        <div v-if="!folder?.folderMetadata.gradedImage && folder.folderMetadata.answerKey" class="mb-3">
          <div class="btn-group mt-3">
            <button @click="gradeTest(folder)" class="btn btn-success mx-2">Grade Test</button>
          </div>
        </div>
        <div v-if="folder?.folderMetadata.gradedImage && !folder.folderMetadata.answerKey" class="mb-3">
          <div class="btn-group mt-3">
            <button @click="getAnswerKey(folder)" class="btn btn-warning mx-2">Get Answer Key</button>
          </div>
        </div>
        <div v-for="file in folder.files" :key="file.name" class="file-info mb-3">
          <h5><a :href="file.url" target="_blank">{{ file.name }}</a></h5>
          <p v-if="file.metadata && file.metadata.customMetadata">
            <span v-if="file.metadata.customMetadata.answerKey">
              <strong>Answer Key:</strong> {{ file.metadata.customMetadata.answerKey }}
            </span>
            <span v-if="file.metadata.customMetadata.qrCodeData">
              <strong>Qr code data:</strong> {{ file.metadata.customMetadata.qrCodeData }}
            </span>
            <span v-if="file.metadata.customMetadata.gradedImage">
              <strong>Score:</strong> {{ file.metadata.customMetadata.score }} / {{ file.metadata.customMetadata.maxScore }}
              <br />
              <strong>Percentage:</strong> {{ file.metadata.customMetadata.percentage }}%
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import {
  ref, uploadBytesResumable, getDownloadURL, listAll, getMetadata, updateMetadata,
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
      userFiles: [],
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
        console.log('Fetching files for user:', userId);

        const userFolderRef = ref(storage, `userUploads/${userId}`);
        try {
          const res = await listAll(userFolderRef);
          const subfolderFiles = await Promise.all(
            res.prefixes.map(async (folderRef) => {
              const folderName = folderRef.name.split('/').slice(-2, -1)[0];
              const folderFiles = await listAll(folderRef);

              const fileDetails = await Promise.all(
                folderFiles.items.map(async (itemRef) => {
                  const metadata = await getMetadata(itemRef);
                  const fileUrl = await getDownloadURL(itemRef);
                  const fileInfo = {
                    name: itemRef.name,
                    url: fileUrl,
                    metadata,
                    folder: folderName,
                  };

                  return fileInfo;
                }),
              );
              const folderMetadata = {
                userUpload: false,
                answerKey: false,
                gradedImage: false,
                folderName: folderRef.name,
              };

              await Promise.all(
                folderFiles.items.map(async (itemRef) => {
                  try {
                    const metadata = await getMetadata(itemRef);
                    if (metadata.customMetadata?.type === 'userUpload') {
                      folderMetadata.userUpload = true;
                    }
                    if (metadata.customMetadata?.type === 'answerKey') {
                      folderMetadata.answerKey = true;
                    }
                    if (metadata.customMetadata?.type === 'gradedImage') {
                      folderMetadata.gradedImage = true;
                    }
                  } catch (error) {
                    console.error('Error fetching metadata:', error);
                  }
                }),
              );

              return { folderName, files: fileDetails, folderMetadata };
            }),
          );

          this.userFiles = subfolderFiles; // Structure: [{ folderName: 'folder1', files: [...], folderMetadata: {...} }, { ... }]
          this.hasFiles = this.userFiles.length > 0;
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

      const customMetadata = {
        customMetadata: {
          type: 'userUpload',
        },
      };
      this.uploading = true;
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const fileRef = ref(storage, `userUploads/${userId}/${folderName}/${file.name}`);
            await updateMetadata(fileRef, customMetadata);
            const metadata = await getMetadata(fileRef);
            this.userFiles.push({
              name: file.name,
              url: downloadURL,
              metadata,
              folder: folderName,
            });
            await this.fetchUserFiles();
            this.uploading = false;
            this.uploadProgress = 0;
            this.uploadedImage = null;
          } catch (error) {
            console.error('Error updating metadata:', error);
            this.uploading = false;
            this.uploadProgress = 0;
          }
        },
      );
    },
    async getAnswerKey(folder) {
      console.log(folder);
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user.uid;
      const userUploadFile = folder.files.find((file) => file.metadata?.customMetadata?.type === 'userUpload');
      console.log(userUploadFile.url);
      if (userUploadFile) {
        console.log('Found user upload file:', userUploadFile.name);
        console.log('Folder name:', folder.folderMetadata.folderName);
        console.log('File URL:', userUploadFile.url);
        try {
          const response = await axios.post('https://us-central1-scanscore-6cbf7.cloudfunctions.net/api/get-answerkey', {
            userId,
            fileName: userUploadFile.name,
            fileUrl: userUploadFile.url,
            folderName: folder.folderMetadata.folderName,
          });
          console.log(response.data);
          this.fetchUserFiles();
        } catch (error) {
          alert('Error getting answer key:', error);
        }
      } else {
        console.log('No user upload file found.');
      }
    },
    parseQrCodeData(qrCodeData) {
      const parts = qrCodeData.split('Q').slice(1); // Discard the first element
      const answers = parts.join('').split('').map((char) => parseInt(char, 10));
      console.log('answerrs: ', answers);
      return answers;
    },
    async gradeTest(folder) {
      console.log('Passed folder: ', folder);
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user.uid;
      const userUploadFile = folder.files.find((file) => file.metadata?.customMetadata?.type === 'userUpload');
      const answerKeyFile = folder.files.find((file) => file.metadata?.customMetadata?.type === 'answerKey');
      if (answerKeyFile === undefined) {
        alert('No answer key found for this test.');
        return;
      }
      const { qrCodeData } = answerKeyFile.metadata.customMetadata;
      const answers = this.parseQrCodeData(qrCodeData);
      console.log(answers, answers.length);
      if (answers.length === 0 || answers.some((val) => val !== 0 && val !== 1)) {
        alert('Answer key must be a comma-separated list of 1s and 0s.');
        return;
      }
      try {
        const response = await axios.post('https://us-central1-scanscore-6cbf7.cloudfunctions.net/api/grade-test', {
          correctAnswers: answers,
          userId,
          fileName: userUploadFile.name,
          fileUrl: userUploadFile.url,
          folderName: folder.folderMetadata.folderName,
        });
        this.results = response.data;
        console.log('Results:', this.results);
        this.fetchUserFiles();
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

.folder-container {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #c8d0c9;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.folder-container h4 {
  color: #0638b8;
  margin-bottom: 15px;
}

.button-container {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

button {
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 5px;
}

button.btn-warning {
  background-color: #d44e00;
  border-color: #d44e00;
  color: white;
}

button.btn-success {
  background-color: #5bc0de;
  border-color: #5bc0de;
  color: white;
}

button.btn-warning:hover {
  background-color: #be4600;
  border-color: #be4600;
}

button.btn-success:hover {
  background-color: #46b6b2;
  border-color: #46b6b2;
}

.file-info {
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #e1eae2;
  border-radius: 8px;
  background-color: #eef8ef;
}

.file-info h5 {
  color: #0638b8;
}

.file-info a {
  color: #0638b8;
  text-decoration: none;
}

.file-info a:hover {
  text-decoration: underline;
}

.file-info p {
  font-size: 14px;
  color: #042b8c;
}

.file-info span {
  display: block;
  margin-top: 10px;
}

.file-info strong {
  color: #d44e00;
}
</style>
