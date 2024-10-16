<template>
  <div class="createNewTest">
    <div>
      <button @click="collapse" class="collapse">collapse</button>
    </div>
    <div class="description">
      <p>Here you can create a new Test that will be outputed as a .docx download</p>
    </div>
    <div class="documentForm">
      <FormComponent @updatedQuestions="updateParent" />
    </div>
    <!-- <button @click="addNewQuestionPromt">Add new question</button> -->
  </div>
  <div class="genereateDocumentButtonDiv">
    <button v-if="testHasQuestions" @click="generateDocument">Generate Document</button>
  </div>
  <div>
    <button @click ="getQuestions">Get questions</button>
  </div>
  <div>
  </div>
</template>

<script>
import {
  Document, Paragraph, Packer, Table, TableRow, TableCell, Header, HeadingLevel, WidthType, ImageRun, TextRun,
} from 'docx';

import { saveAs } from 'file-saver';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import FormComponent from '../components/FormComponent.vue';

const QRCode = require('qrcode');

export default {
  components: {
    FormComponent,
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
    };
  },
  methods: {
    updateParent(variable, questions, testMeta) {
      this.testHasQuestions = variable;
      this.testFileData.title = testMeta.title;
      this.testFileData.description = testMeta.description;
      this.testFileData.questions = questions;
      this.questionsArray = questions;
    },
    collapse() {
      this.$emit('collapse');
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
    async saveToFirebase() {
      const db = getFirestore();
      try {
        const docRef = await addDoc(collection(db, 'tests'), this.testFileData);
        console.log('Document written with ID: ', docRef.id);
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    },
    generateDocument() {
      console.log(this.testFileData);
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
          saveAs(blob, 'pipebomb.docx');
          this.generateAnswersSheet();
        });
      } catch (error) {
        console.error('Error generating document:', error);
      }
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

.collapse {
  position: absolute;
  top: 10px;
  right: 10px;
}

.createNewTest>div {
  margin-bottom: 15px;
}

.createNewTest p {
  color: #333;
}

.collapse,
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

.collapse,
.createNewTest button:hover {
  background-color: #2980b9;
}
</style>
