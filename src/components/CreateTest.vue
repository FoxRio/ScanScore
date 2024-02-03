<template>
  <div class="createNewTest">
    <div>
      <button @click="collapse" class="collapse">collapse</button>
    </div>
    <div class="description">
      <p>Here you can create a new Test that will be outputed as a .docx download</p>
    </div>
    <div>
      <div v-for="(question, index) in questions" :key="index">
        <NewQuestionComponent />
      </div>
      <button @click="addNewQuestionPromt">Add new question</button>
    </div>
    <div>
      <button v-if="testHasQuestions" @click="generateDocument">Generate Document</button>
    </div>

    <div>
      <!-- <form action="#" method="post">
        <label for="taskDescription">Please input the question / task</label>
        <input type="text" id="taskDescription" name="taskDescription">
      </form> -->

    </div>

  </div>
</template>

<script>
import {
  Document, Paragraph, Packer, TextRun,
}
  from 'docx';

import { saveAs } from 'file-saver';

import NewQuestionComponent from './NewQuestion.vue';

export default {
  components: {
    NewQuestionComponent,
  },
  data() {
    return {
      testHasQuestions: false,
      questions: [],
    };
  },
  methods: {
    collapse() {
      this.$emit('collapse');
    },
    addNewQuestionPromt() {
      // Add a new question component to the array when the button is clicked
      this.testHasQuestions = true;
      this.questions.push({});
    },
    async generateDocument() {
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun('Dear User,'),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun('\nBest regards,'),
                  new TextRun('\nThose who are now in your walls'),
                ],
              }),
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
