<template>
  <div class="createNewTest">
    <div>
      <button @click="collapse" class="collapse">collapse</button>
    </div>
    <div class="description">
      <p>Here you can create a new Test that will be outputed as a .docx download</p>
    </div>
    <div class="documentForm">
      <FormComponent @updatedQuestions="updateParent"/>
    </div>
    <!-- <button @click="addNewQuestionPromt">Add new question</button> -->
  </div>
  <div class="genereateDocumentButtonDiv">
    <button v-if="testHasQuestions" @click="generateDocument">Generate Document</button>
    <button @click="loghasQ">HASQUESTIONS?></button>
  </div>
  <div>
  </div>
</template>

<script>
import {
  Document, Paragraph, Packer,
}
  from 'docx';

import { saveAs } from 'file-saver';

// import NewQuestionComponent from './NewQuestion.vue';
import FormComponent from './FormComponent.vue';

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
      console.log('--------emit successy----------');
      this.testHasQuestions = variable;
      this.questionsArray = questions;
      console.log(this.testHasQuestions);
      console.log('--------QUESTIONS ARRAY EMITED----------');
      console.log(this.questionsArray[0]);
    },
    collapse() {
      this.$emit('collapse');
    },
    loghasQ() {
      console.log(this.testHasQuestions);
    },
    async generateDocument() {
      console.log('generate docx');
      // eslint-disable-next-line
      let doc = new Document();
      console.log('generate docx');
      this.questionsArray.forEach((question, index) => {
        console.log(question, index);
        // Create a paragraph for the question text
        const questionParagraph = new Paragraph({
          children: [{ text: `Question ${index + 1}: ${question.questionText}` }],
        });

        // Add the question paragraph to the document
        doc.addParagraph(questionParagraph);

        // Iterate over the answers for the current question
        Object.values(question.answers).forEach((answer, answerIndex) => {
          // Create a paragraph for each answer
          const answerParagraph = new Paragraph({
            children: [{ text: `Answer ${answerIndex + 1}: ${answer.text}` }],
            // Example: Highlight the correct answer in green
            style: {
              color: answer.correct ? 'green' : 'black',
            },
          });
          doc.addParagraph(answerParagraph);
        });
      });

      try {
        Packer.toBlob(doc).then((blob) => {
          // saveAs from FileSaver will download the file
          saveAs(blob, 'pipebomb.docx');
        });
      } catch (error) {
        console.error('Error generating document:', error);
      }
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
