<template>
  <div>
    <h1>Saved Tests</h1>
    <div v-for="test in tests" :key="test.id">
      <h2>{{ test.title }}</h2>
      <button @click="editTest(test.id)">Edit</button>
      <button @click="generateDocument(test.id)">Generate print copy</button>
      <button @click="generateAnswersSheet(test.id)">Generate print copy (answersheet)</button>
      <button @click="deleteTest(test.id)">Delete</button>
    </div>
  </div>
</template>

<script>
import {
  Document, Paragraph, Packer, Table, TableRow, TableCell, Header, HeadingLevel, WidthType, ImageRun, TextRun, TextWrappingType, TextWrappingSide,
} from 'docx';

import { saveAs } from 'file-saver';
import {
  getFirestore, collection, query, where, getDocs, deleteDoc, doc,
} from 'firebase/firestore';
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
    console.log('User ID:', userId);

    if (userId) {
      // Query to get only the tests created by the authenticated user
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
      // Redirect to edit page or load test for editing
      this.$router.push({ name: 'EditTest', params: { id } });
    },
    goToHome() {
      this.$router.push('/');
    },
    async deleteTest(id) {
      console.log('Deleting test:', id);
      const db = getFirestore();
      // eslint-disable-next-line no-restricted-globals
      if (confirm('Are you sure you want to delete this test?')) {
        await deleteDoc(doc(db, 'tests', id));
        console.log('Test deleted successfully');
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
    async generateAnswersSheet(id) {
      const testToProcess = this.tests.find((test) => test.id === id);
      const questionsArray = testToProcess.questions;
      let text = `${questionsArray.length}`;
      for (let i = 0; i < questionsArray.length; i += 1) {
        const question = questionsArray[i];
        console.log('Question:', question);
        console.log('Question text:', question.questionText);
        const { answers } = question;
        console.log('Answers:', answers);
        let questionResult = '';

        Object.keys(answers).forEach((key) => {
          console.log(answers[key]);
          questionResult += answers[key].correct ? '1' : '0';
        });

        text += `Q${questionResult}`;
      }
      const base64ImageData = await QRCode.toDataURL(text);
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
              new Paragraph({
                children: [
                  new ImageRun({
                    data: QRblob,
                    transformation: {
                      width: 50,
                      height: 50,
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
              new Paragraph({ text: 'Please fill in the correct answers in the answer sheet', heading: HeadingLevel.HEADING_2 }),
              // ...buildParagraph(), // paragraphs are not coming through
            ],
          },
        ],
      });

      try {
        Packer.toBlob(createdDoc).then((blob) => {
          // saveAs from FileSaver will download the file
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
      console.log('TEST', testFileData);
      console.log('Questions:', questionsArray);
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
                new TableCell({ children: [new Paragraph({ text: questionsArray[i].answers.answer1 })] }),
                new TableCell({ children: [new Paragraph({ text: questionsArray[i].answers.answer2 })] }),
                new TableCell({ children: [new Paragraph({ text: questionsArray[i].answers.answer3 })] }),
                new TableCell({ children: [new Paragraph({ text: questionsArray[i].answers.answer4 })] }),
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
          console.log('Blob:', blob);
          saveAs(blob, 'pipebomb.docx');
        });
      } catch (error) {
        console.error('Error generating document:', error);
      }
      console.log('Document generated');
      alert('Test created successfully!');
      this.$router.push('/my-tests');
    },
  },
};
</script>
