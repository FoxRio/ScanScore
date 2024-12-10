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
  </div>
</template>

<script>
import {
  Document, Paragraph, Packer, Table, TableRow, TableCell, Header, HeadingLevel, WidthType, ImageRun, TextWrappingType, TextWrappingSide,
}
  from 'docx';

import { saveAs } from 'file-saver';

// import NewQuestionComponent from './NewQuestion.vue';
import FormComponent from './FormComponent.vue';

const QRCode = require('qrcode');

export default {
  components: {
    FormComponent,
  },
  data() {
    return {
      testHasQuestions: false,
      questionsArray: [],
    };
  },
  methods: {
    updateParent(variable, questions) {
      this.testHasQuestions = variable;
      this.questionsArray = questions;
    },
    collapse() {
      this.$emit('collapse');
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
          console.log(answers[key]);
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
              // ...buildParagraph(), // paragraphs are not coming through
            ],
          },
        ],
      });

      try {
        Packer.toBlob(doc).then((blob) => {
          // saveAs from FileSaver will download the file
          saveAs(blob, 'panswers.docx');
        });
      } catch (error) {
        console.error('Error generating document:', error);
      }
    },
    generateDocument() {
      const buildRows = () => {
        const rowArray = [];
        for (let i = 0; i < this.questionsArray.length; i += 1) {
          rowArray.push(
            new TableRow({
              children: [new TableCell({
                children: [new Paragraph({ text: this.questionsArray[i].questionText })],
                columnSpan: 4,
                cantSplit: true,
              }),
              ],
              width: {
                size: 100,
                type: WidthType.PERCENTAGE, // Set the table width to be a percentage of the page width
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
              // ...buildParagraph(), // paragraphs are not coming through
            ],
          },
        ],
      });

      try {
        Packer.toBlob(doc).then(() => {
          // saveAs from FileSaver will download the file
          // saveAs(blob, 'pipebomb.docx');
          this.generateAnswersSheet();
        });
      } catch (error) {
        console.error('Error generating document:', error);
      }
      confirmCreation();
    },
    confirmCreation() {
      alert('Document created');
      this.$router.push('/my-tests');
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
