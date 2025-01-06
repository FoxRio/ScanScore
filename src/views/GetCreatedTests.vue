<template>
  <div class="container mt-5">
    <h1 class="text-primary mb-4" style="color: #0638b8;">Saved Tests</h1>
    <p v-if="displayName" style="color: #0638b8;">Hello, {{ displayName }}! Here are your saved tests.</p>
    <div v-for="test in tests" :key="test.id" class="mb-4 p-3 border rounded" style="background-color: #eaf4eb;">
      <h2 style="color: #d44e00;">{{ test.title }}</h2>
      <div class="btn-group mt-3">
        <button class="btn btn-warning mx-2" @click="editTest(test.id)"
          style="background-color: #d9601a; color: #fff; border: none;">Edit</button>
        <button class="btn btn-info mx-2" @click="generateDocument(test.id)"
          style="background-color: #1c4bc0; color: #fff; border: none;">Generate print copy</button>
        <button class="btn btn-info mx-2" @click="generateAnswersSheet(test.id)"
          style="background-color: #1c4bc0; color: #fff; border: none;">Generate print copy (answersheet)</button>
        <button class="btn btn-danger mx-2" @click="deleteTest(test.id)"
          style="background-color: #f44336; color: #fff; border: none;">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
import checkboxImagePath from '@/assets/checkboxes1.png';
import {
  Document, Paragraph, Packer, Table, TableRow, TableCell, Header, HeadingLevel, WidthType, ImageRun, TextRun, TextWrappingType, TextWrappingSide,
} from 'docx';

import { saveAs } from 'file-saver';
import {
  getFirestore, collection, query, where, getDocs, deleteDoc, doc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { auth } from '../firebase';

const QRCode = require('qrcode');

export default {
  data() {
    return {
      tests: [],
    };
  },
  async mounted() {
    const db = getFirestore();
    const userId = auth.currentUser ? auth.currentUser.uid : null;

    if (userId) {
      const user = getAuth().currentUser;
      if (user) {
        this.displayName = user.displayName;
      }
      const testsQuery = query(collection(db, 'tests'), where('userId', '==', userId));
      const querySnapshot = await getDocs(testsQuery);
      this.tests = querySnapshot.docs.map((docx) => ({ id: docx.id, ...docx.data() }));
    } else {
      console.error('User is not authenticated');
      this.goToHome();
    }
  },
  methods: {
    editTest(id) {
      this.$router.push({ name: 'EditTest', params: { id } });
    },
    goToHome() {
      this.$router.push('/');
    },
    async deleteTest(id) {
      const db = getFirestore();
      // eslint-disable-next-line no-restricted-globals
      if (confirm('Are you sure you want to delete this test?')) {
        await deleteDoc(doc(db, 'tests', id));
        this.tests = this.tests.filter((test) => test.id !== id);
      }
    },
    goToLanding() {
      this.$router.push('/about');
    },
    dataURItoBlob(dataURI) {
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      return blob;
    },
    createQrCode(testToProcess) {
      const questionsArray = testToProcess.questions;
      let text = `${questionsArray.length}`;
      for (let i = 0; i < questionsArray.length; i += 1) {
        const question = questionsArray[i];
        const { answers } = question;
        let questionResult = '';

        Object.keys(answers).forEach((key) => {
          questionResult += answers[key].correct ? '1' : '0';
        });

        text += `Q${questionResult}`;
      }
      return text;
    },
    async generateAnswersSheet(id) {
      const testToProcess = this.tests.find((test) => test.id === id);
      const questionsArray = testToProcess.questions;
      const docChildren = [];
      const checkboxImage = checkboxImagePath;

      for (let i = 0; i < questionsArray.length; i += 1) {
        const question = questionsArray[i];
        const { questionText, answers } = question;

        const answersArray = Object.values(answers);

        const questionParagraph = new Paragraph({
          text: `Q${i + 1}: ${questionText}`,
          heading: HeadingLevel.HEADING_2,
        });

        docChildren.push(questionParagraph);

        const checkboxRow = new Table({
          rows: [
            new TableRow({
              children: answersArray.slice(0, 4).map(() => {
                const checkboxImageRun = new ImageRun({
                  data: checkboxImage,
                  transformation: {
                    width: 50,
                    height: 50,
                  },
                });

                return new TableCell({
                  children: [
                    // The checkbox image
                    new Paragraph({
                      children: [checkboxImageRun],
                      alignment: 'center',
                    }),

                  ],
                  borders: {
                    top: { value: 0 },
                    bottom: { value: 0 },
                    left: { value: 0 },
                    right: { value: 0 },
                  },
                  width: { size: 25, type: WidthType.PERCENTAGE },
                  height: { value: 200, type: 'pt' },
                });
              }),
            }),
          ],
          width: { size: 100, type: WidthType.PERCENTAGE }, // Table takes up 100% of the page width
          borders: {
            top: { value: 0 },
            bottom: { value: 0 },
            left: { value: 0 },
            right: { value: 0 },
          },
        });
        docChildren.push(new Paragraph(''));
        docChildren.push(checkboxRow);
        docChildren.push(new Paragraph(''));
      }

      const qrText = await this.createQrCode(testToProcess);
      const base64ImageData = await QRCode.toDataURL(qrText);
      const QRblob = await fetch(base64ImageData).then((response) => response.blob());

      const createdDoc = new Document({
        sections: [
          {
            headers: {
              default: new Header({
                children: [
                  new Paragraph('Prasmju pārbaude'),
                  new Paragraph({ text: 'Name:                            \n Surname:                            \n Class:      ' }),
                ],
              }),
            },
            children: [
              // Add the QR code
              new Paragraph({
                children: [
                  new ImageRun({
                    data: QRblob,
                    transformation: {
                      width: 100,
                      height: 100,
                    },
                    floating: {
                      horizontalPosition: {
                        offset: 0,
                      },
                      verticalPosition: {
                        offset: 0,
                      },
                      wrap: {
                        type: TextWrappingType.SQUARE,
                        side: TextWrappingSide.BOTH_SIDES,
                      },
                    },
                  }),
                ],
              }),
              // Add the questions and checkboxes
              ...docChildren,
            ],
          },
        ],
      });

      try {
        Packer.toBlob(createdDoc).then((blob) => {
          const answerSheetName = `answersheet_${testToProcess.title}.docx`;
          saveAs(blob, answerSheetName);
        });
      } catch (error) {
        console.error('Error generating document:', error);
      }
    },
    generateDocument(id) {
      const testFileData = this.tests.find((test) => test.id === id);
      const questionsArray = testFileData.questions;
      const buildRows = () => {
        const rowArray = [];
        for (let i = 0; i < questionsArray.length; i += 1) {
          rowArray.push(
            new TableRow({
              children: [new TableCell({
                children: [new Paragraph({ text: questionsArray[i].questionText })],
                columnSpan: 4,
                cantSplit: true,
              })],
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: questionsArray[i].answers.A.text })] }),
                new TableCell({ children: [new Paragraph({ text: questionsArray[i].answers.B.text })] }),
                new TableCell({ children: [new Paragraph({ text: questionsArray[i].answers.C.text })] }),
                new TableCell({ children: [new Paragraph({ text: questionsArray[i].answers.D.text })] }),
              ],
              width: {
                size: 25,
                type: WidthType.PERCENTAGE,
              },
              cantSplit: true,
            }),
          );
        }
        return rowArray;
      };

      const docx = new Document({
        sections: [
          {
            headers: {
              default: new Header({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun('Prasmju pārbaude: '),
                      new TextRun(testFileData.title),
                    ],
                  }),
                  new Paragraph({ text: 'Name:                            \n Surname:                            \n Class:      ' }),
                  new Paragraph({ text: testFileData.description }),
                ],
              }),
            },
            children: [
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                rows: [
                  ...buildRows(),
                ],
              }),
              new Paragraph({ text: 'Please fill in the correct answers in the answer sheet', heading: HeadingLevel.HEADING_2 }),
            ],
          },
        ],
      });

      try {
        Packer.toBlob(docx).then((blob) => {
          saveAs(blob, `${testFileData.title}.docx`);
        });
      } catch (error) {
        console.error('Error generating document:', error);
      }
      alert('Test created successfully!');
      this.$router.push('/my-tests');
    },
  },
};
</script>

<style scoped>
.container {
  padding-top: 10px;
}

h2 {
  color: #d44e00;
}

.btn-group .btn {
  background-color: #f5fff6;
  color: #0638b8;
}

.btn:hover {
  opacity: 0.9;
}

button.btn {
  border-radius: 5px;
}

button.btn-danger {
  background-color: #f44336;
}

button.btn-warning {
  background-color: #d9601a;
}

button.btn-info {
  background-color: #1c4bc0;
}
</style>
