<template>
  <div class="edit-question-container">
    <form @submit.prevent="save">
      <label for="questionText">Question:
      <input
        type="text"
        id="questionText"
        v-model="editedQuestion.questionText"
        required
      /></label>

      <div class="answer-container">
        <div v-for="(answer, index) in editedQuestion.answers" :key="index">
          <label :for="'answer' + index">Answer:
          <input
            type="text"
            :id="'answer' + index"
            v-model="editedQuestion.answers[index].text"
            required
          /></label>
          <label :for="'correctanswer' + index">This is the correct answer
            <input
              type="checkbox" :id="'correctanswer' + index"
              v-model="editedQuestion.answers[index].correct"
            />
          </label>
        </div>
      </div>

      <button type="submit">Save</button>
      <button type="button" @click="$emit('cancelEdit')">Cancel</button>
      <button type="button" @click="printData">Print</button>
    </form>
  </div>
</template>

<script>
export default {
  props: ['questionData'],
  data() {
    return {
      editedQuestion: { ...this.questionData },
    };
  },
  methods: {
    save() {
      this.$emit('updateQuestion', this.editedQuestion);
    },
    printData() {
      console.log(this.editedQuestion);
    },
  },
};
</script>

<style scoped>
.edit-question-container {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.question-container {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f5fff6; /* Background color */
}

.question-container p {
  font-weight: bold;
  margin-bottom: 10px;
  color: #0638b8; /* Text color */
}

.correct-answer {
  background-color: lightgreen;
}

.delete-button {
  padding: 8px 16px;
  background-color: #d44e00; /* Primary color */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c83d00; /* Darker shade for hover */
}

.edit-button {
  padding: 8px 16px;
  background-color: #007bff; /* Edit button color */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-button:hover {
  background-color: #0056b3;
}

.save-button {
  padding: 8px 16px;
  background-color: #28a745; /* Green for Save */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.save-button:hover {
  background-color: #218838;
}

.cancel-button {
  padding: 8px 16px;
  background-color: #ffc107; /* Yellow for Cancel */
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: p
}
</style>
