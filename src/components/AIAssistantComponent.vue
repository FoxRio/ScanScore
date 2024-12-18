<template>
  <div class="ai-assistant">
    <label for="user-prompt">Ask for suggestions:
      <textarea v-model="userPrompt" placeholder="Ask for suggestions..." rows="4"></textarea>
    </label>
    <button @click="sendPrompt">Ask AI</button>

    <div v-if="aiResponse.length > 0">
      <h3>AI Suggestions:</h3>
      <ul>
        <li v-for="(response, index) in aiResponse" :key="index">{{ response }}</li>
      </ul>
    </div>

    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userPrompt: '', // The input from the user
      aiResponse: [], // The array of AI responses
      loading: false, // To track the loading state
      error: null, // To track any errors
    };
  },
  methods: {
    async sendPrompt() {
      if (!this.userPrompt.trim()) {
        this.error = 'Prompt cannot be empty';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        console.log('Sending prompt to AI:', this.userPrompt, this.$parent.testFileData.title, this.$parent.testFileData.description);
        const response = await axios.post('https://us-central1-scanscore-6cbf7.cloudfunctions.net/api/call-openai', {
          prompt: this.userPrompt,
          title: this.$parent.testFileData.title,
          description: this.$parent.testFileData.description,
        });

        // Assuming the AI response is an array or string that can be added to the list
        this.aiResponse.push(response.data.text); // Append the new response to the list
      } catch (error) {
        this.error = `Error fetching AI response: ${error.message}`;
        console.error('Error fetching AI response:', error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.ai-assistant {
  position: fixed;
  top: 20px;  /* Adjust top position for desired vertical alignment */
  right: 20px;
  width: 300px;
  padding: 20px;
  background-color: #f0f0f0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: 9999; /* Ensure it's above other content */
}

textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.error {
  color: red;
}

h3 {
  margin-top: 20px;
}
</style>
