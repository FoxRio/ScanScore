<template>
  <div class="question-container">
    <label :for="id" class="question-label">Please enter Question {{ questionNumber }}:
      <textarea :id="id" :name="name" :value="questionText" class="question-textarea"></textarea>
    </label>
    <div class="answer-container">
      <div v-for="index in 4" :key="index">
        <label :for="'answer-' + index">Answer {{ index }}:
          <input type="text" :id="'answer-' + index" :name="'answer-' + index">
          <label :for="'correct-answer-' + index">Correct Answer
            <input type="checkbox" :id="'correct-answer-' + index" :name="'correct-answer-' + index"></label>

        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    name: String,
    questionNumber: Number,
    questionText: String,
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style scoped >
.question-container>label,
.answer-container {
  margin-bottom: 20px;
  color: black;
}

.question-label {
  font-weight: bold;
}

.question-textarea {
  width: 100%;
  height: 100px;
  padding: 8px;
  margin-top: 5px;
  resize: vertical;
}

.answer-container {
  margin-top: 10px;
}

input[type="text"] {
  width: 100%;
  margin-top: 5px;
  padding: 8px;
}

select {
  width: 100%;
  margin-top: 5px;
  padding: 8px;
}

/*
.newQuestionComponent {
  display: flex;
  justify - content: center;
  align - items: center;
  height: 30vh;
}

form {
  display: flex;
  flex: 1;
  flex - direction: column;
  align - items: center;
  max - width: 400px;
  height: 20vh;
}

label {
  margin - bottom: 8px;
  color: #333;
  height: 100 %;
}

textarea {
  flex: 1;
  min - width: 400px;
  height: 90 %;
  resize: vertical;
  overflow - y: auto;
  padding: 5px;
  box - sizing: border - box;
}********/
</style>
