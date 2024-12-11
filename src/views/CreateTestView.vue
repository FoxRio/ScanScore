<template>
  <div class="createNewTest">
    <div class="description">
      <p>Here you can create a new Test that will be outputted as a .docx download</p>
    </div>
    <div class="documentForm">
      <FormComponent @updatedQuestions="updateParent" />
    </div>

    <h2>Questions</h2>
    <div v-for="(question, index) in testFileData.questions" :key="index">
      <div v-if="editingIndex !== index">
        <DisplayedQuestion
          :questionData="question"
          @deleteEvent="deleteQuestion(index)"
          @editEvent="editQuestion(index)"
        />
      </div>
      <div v-else>
        <QuestionEditComponent
          :questionData="question"
          @updateQuestion="updateQuestion(index, $event)"
          @cancelEdit="cancelEdit"
        />
      </div>
    </div>

    <div class="generateDocumentButtonDiv">
      <div v-if="titleError" class="error-message">Title is required.</div>
      <button v-if="testHasQuestions" @click="generateDocument">Generate Document</button>
    </div>
    <div>
      <button @click="getQuestions">Get questions</button>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {
  Document, Paragraph, Packer, Table, TableRow, TableCell, Header, HeadingLevel, WidthType, ImageRun, TextRun,
} from 'docx';

import { saveAs } from 'file-saver';
import { auth } from '../firebase';
import FormComponent from '../components/FormComponent.vue';
import DisplayedQuestion from '../components/DisplayedQuestion.vue';
import QuestionEditComponent from '../components/QuestionEditComponent.vue'; // Import your edit question component

const QRCode = require('qrcode');

export default {
  components: {
    FormComponent,
    DisplayedQuestion,
    QuestionEditComponent,
  },
  data() {
    return {
      testHasQuestions: false,
      testFileData: {
        title: '',
        description: '',
        questions: [],
      },
      questionsArray: [],
      editingIndex: null, // Track the index of the question being edited
      titleError: false,
    };
  },
  methods: {
    updateParent(variable, questions, testMeta) {
      this.testHasQuestions = variable || false;
      this.testFileData.title = testMeta?.title || '';
      this.testFileData.description = testMeta?.description || '';
      this.testFileData.questions = questions || [];
      this.questionsArray = questions || [];
    },
    deleteQuestion(index) {
      this.testFileData.questions.splice(index, 1);
      this.testHasQuestions = this.testFileData.questions.length > 0; // Update state if there are questions
    },
    editQuestion(index) {
      this.editingIndex = index; // Set the index of the question to edit
    },
    updateQuestion(index, updatedQuestion) {
      // Update the specific question in the array directly
      this.testFileData.questions[index] = updatedQuestion;

      // Reset editing index after the update
      this.editingIndex = null;
    },
    cancelEdit() {
      this.editingIndex = null; // Reset editing index on cancel
    },
    async saveToFirebase() {
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      console.log('User ID:', userId);

      if (userId) {
        this.testFileData.userId = userId;
        this.testFileData.createdAt = new Date();

        const db = getFirestore();
        const docRef = await addDoc(collection(db, 'tests'), this.testFileData);
        console.log('Document written with ID: ', docRef.id);
      } else {
        console.error('User is not authenticated');
      }
    },
    goToLanding() {
      this.$router.push('/about');
    },
    generateAnswersSheet() {
      let text = '';
      for (let i = 0; i < this.questionsArray.length; i += 1) {
        const question = this.questionsArray[i];
        const answers = { question };
        let questionResult = '';

        Object.keys(answers).forEach((key) => {
          questionResult += answers[key].correct ? '1' : '0';
        });

        text += `Q${questionResult}`;
      }

      let blobx;
      QRCode.toDataURL(text, { errorCorrectionLevel: 'H' })
        .then(async (url) => {
          const res = await fetch(url);
          return res.blob();
        })
        .then((generatedBlob) => {
          blobx = generatedBlob;

          const docx = new Document({
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
                        type: 'png',
                        data: [blobx],
                        transformation: {
                          width: 200,
                          height: 200,
                        },
                      }),
                    ],
                  }),
                  new Paragraph({ text: 'Please fill in the correct answers in the answer sheet', heading: HeadingLevel.HEADING_2 }),
                ],
              },
            ],
          });

          try {
            Packer.toBlob(docx).then((blob) => {
              saveAs(blob, 'panswers.docx');
            });
          } catch (error) {
            console.error('Error generating document:', error);
          }
        });
    },
    generateDocument() {
      console.log(this.testFileData);
      if (this.testFileData.title.trim() === '') {
        this.titleError = true; // Show error message
        return;
      }
      this.titleError = false;

      this.saveToFirebase();
      const buildRows = () => {
        const rowArray = [];
        for (let i = 0; i < this.questionsArray.length; i += 1) {
          rowArray.push(
            new TableRow({
              children: [new TableCell({
                children: [new Paragraph({ text: this.questionsArray[i].questionText })],
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
                new TableCell({ children: [new Paragraph({ text: this.questionsArray[i].answers.answer1 })] }),
                new TableCell({ children: [new Paragraph({ text: this.questionsArray[i].answers.answer2 })] }),
                new TableCell({ children: [new Paragraph({ text: this.questionsArray[i].answers.answer3 })] }),
                new TableCell({ children: [new Paragraph({ text: this.questionsArray[i].answers.answer4 })] }),
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
                      new TextRun(this.testFileData.title),
                    ],
                  }),
                  new Paragraph({ text: 'Name:                            \n Surname:                            \n Class:      ' }),
                  new Paragraph({ text: this.testFileData.description }),
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
          this.generateAnswersSheet();
        });
      } catch (error) {
        console.error('Error generating document:', error);
      }
      console.log('Document generated');
      alert('Test created successfully!');
      this.$router.push('/my-tests');
    },
    getQuestions() {
      console.log('Questions:');
      for (let i = 0; i < this.questionsArray.length; i += 1) {
        console.log(this.questionsArray[i].questionText);
        console.log(this.questionsArray[i].answers.answer1);
        console.log(this.questionsArray[i].answers.answer2);
        console.log(this.questionsArray[i].answers.answer3);
        console.log(this.questionsArray[i].answers.answer4);
        console.log(this.questionsArray[i].answers.correctAnswer);
      }
      return this.questionsArray;
    },
  },
};
</script>

<style>
.createNewTest {
  width: 70%;
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: relative;
}

.createNewTest>div {
  margin-bottom: 15px;
}

.createNewTest p {
  color: #333;
}

.createNewTest button {
  background-color: #3498db;
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.description {
  margin: 0px;
}

.createNewTest button:hover {
  background-color: #2980b9;
}

.error-message {
  color: red;
  font-size: 1rem;
  margin-top: 5px;
}
</style>
