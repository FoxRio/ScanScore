<template>
  <div class="ai-assistant">
    <div class="chat-history">
      <div v-for="(exchange, index) in chatHistory" :key="index" class="chat-exchange">
        <div class="user-message">
          <p><strong>User:</strong> {{ exchange.userQuestion }}</p>
        </div>
        <div class="ai-response" v-if="exchange.aiAnswer">
          <p><strong>AI:</strong> {{ exchange.aiAnswer }}</p>
        </div>
      </div>
    </div>
    <label for="userPrompt">Ask our AI assistant for suggestions:
      <textarea v-model="userPrompt" placeholder="Ask for suggestions..." rows="4"></textarea></label>
    <button @click="sendPrompt">Ask AI</button>
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      userPrompt: '',
      chatHistory: [],
      loading: false,
      error: null,
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
      this.chatHistory.push({ userQuestion: this.userPrompt, aiAnswer: null });
      if (this.chatHistory.length > 10) {
        this.chatHistory.shift(); // Remove the oldest chat exchange if there are more than 10 to save tokens
      }
      const testTitle = this.$parent.testFileData.title || 'The user hasn\'t named their test yet, help them as you can with your broad knowledge';
      const testDescription = this.$parent.testFileData.description || 'The user hasn\'t described their test yet, help them as you can with your broad knowledge';
      try {
        console.log('Sending prompt to AI:', this.userPrompt, testTitle, testDescription, this.chatHistory);
        const response = await axios.post('https://us-central1-scanscore-6cbf7.cloudfunctions.net/api/call-openai', {
          prompt: this.userPrompt,
          title: this.$parent.testFileData.title,
          description: this.$parent.testFileData.description,
          conversationHistory: this.chatHistory,
        });
        this.chatHistory[this.chatHistory.length - 1].aiAnswer = response.data.text;
      } catch (error) {
        this.error = `Error fetching AI response: ${error.message}`;
      } finally {
        this.loading = false;
      }
      this.userPrompt = '';
    },
  },
};
</script>

<style scoped>
.ai-assistant {
  position: fixed;
  bottom: 40px;
  right: 20px;
  width: 400PX;
  padding: 20px;
  background-color: #f0f0f0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  z-index: 9999;
  max-height: 80vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.chat-history {
  margin-bottom: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.chat-exchange {
  margin-bottom: 15px;
}

.user-message,
.ai-response {
  padding: 8px;
  border-radius: 5px;
}

.user-message {
  background-color: #d1f7ff;
  margin-right: 10px;
}

.ai-response {
  background-color: #e1ffe1;
  margin-left: 10px;
}

textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
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
