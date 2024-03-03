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
  </div>
  <div>
  </div>
</template>

<script>
import {
  Document, Paragraph, Packer, Table, TableRow, TableCell, Header, HeadingLevel,
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
      this.testHasQuestions = variable;
      this.questionsArray = questions;
    },
    collapse() {
      this.$emit('collapse');
    },
    generateDocument() {
      const buildParagraph = () => {
        const paragraphArray = [];
        for (let i = 0; i < this.questionsArray.length; i++) {
          paragraphArray.push(new Paragraph({ text: this.questionsArray[i].questionText }));
        }
        return paragraphArray;
      };
      let doc = new Document({
        sections: [
          {
            headers: {
              default: new Header({
                children: [new Paragraph('Page heading')],
              }),
            },
            children: [
              new Paragraph({ text: 'My Essay', heading: HeadingLevel.HEADING_2 }),
              ...buildParagraph(), // paragraphs are not coming through
            ],
          },
        ],
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
