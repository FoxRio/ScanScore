<template>
  <div class="createNewTest">
    <p>
        Welcome to the Test Creator! Here you can easily create a new test that can be downloaded as a .docx file.
        Simply add questions, customize your test details, and generate a professional document with a click.
        You can also leverage the AI Assistant to help you refine and enhance your test content.
        The AI Assistant offers suggestions for improving the quality of your questions, making it easier to create effective and engaging tests.
      </p>
    <div class="documentForm">
      <FormComponent @updatedQuestions="updateParent" />
    </div>
    <h2>Questions:</h2>
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
    <AIAssistantComponent
      :testTitle="testFileData.title"
      :testDescription="testFileData.description"
    />

    <div class="generateDocumentButtonDiv">
      <div v-if="titleError" class="error-message">Title is required.</div>
      <button v-if="testHasQuestions" @click="saveToFirebase">Generate Document</button>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {
  Document, Paragraph, Packer, Table, TableRow, TableCell, Header, HeadingLevel, WidthType, ImageRun, TextRun, TextWrappingType, TextWrappingSide,
} from 'docx';

import { saveAs } from 'file-saver';
import { auth } from '../firebase';
import AIAssistantComponent from '../components/AIAssistantComponent.vue';
import FormComponent from '../components/FormComponent.vue';
import DisplayedQuestion from '../components/DisplayedQuestion.vue';
import QuestionEditComponent from '../components/QuestionEditComponent.vue';

const QRCode = require('qrcode');

export default {
  components: {
    AIAssistantComponent,
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
      editingIndex: null,
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
      this.testHasQuestions = this.testFileData.questions.length > 0;
    },
    editQuestion(index) {
      this.editingIndex = index;
    },
    updateQuestion(index, updatedQuestion) {
      this.testFileData.questions[index] = updatedQuestion;

      this.editingIndex = null;
    },
    cancelEdit() {
      this.editingIndex = null;
    },
    async saveToFirebase() {
      const userId = auth.currentUser ? auth.currentUser.uid : null;
      if (userId) {
        if (this.testFileData.title.trim() === '') {
          this.titleError = true;
          return;
        }
        this.titleError = false;
        this.testFileData.userId = userId;
        this.testFileData.createdAt = new Date();

        const db = getFirestore();
        await addDoc(collection(db, 'tests'), this.testFileData);
        this.$router.push('/my-tests');
      } else {
        console.error('User is not authenticated');
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
    async generateAnswersSheet() {
      let text = `${this.questionsArray.length}`;
      for (let i = 0; i < this.questionsArray.length; i += 1) {
        const question = this.questionsArray[i];
        // eslint-disable-next-line
        const answers = question.answers;
        let questionResult = '';

        Object.keys(answers).forEach((key) => {
          questionResult += answers[key].correct ? '1' : '0';
        });

        text += `Q${questionResult}`;
      }
      const base64ImageData = await QRCode.toDataURL(text);
      const QRblob = await fetch(base64ImageData).then((response) => response.blob());

      const doc = new Document({
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
            ],
          },
        ],
      });

      try {
        Packer.toBlob(doc).then((blob) => {
          saveAs(blob, 'panswers.docx');
        });
      } catch (error) {
        console.error('Error generating document:', error);
      }
    },
    generateDocument() {
      if (this.testFileData.title.trim() === '') {
        this.titleError = true;
        return;
      }
      this.titleError = false;
      console.log(this.questionsArray[0].answers);
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
          saveAs(blob, `${this.testFileData.title}.docx`);
          this.generateAnswersSheet();
        });
      } catch (error) {
        console.error('Error generating document:', error);
      }
      alert('Test created successfully!');
    },
  },
};
</script>

<style scoped>
.createNewTest {
  width: 70%;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #f5fff6;
  position: relative;
  padding-right: 340px; /* Space for AI Assistant module */
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

.description p {
  margin: 0px;
  color: #0638b8;
  font-size: 1.1rem;
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
