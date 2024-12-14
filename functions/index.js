const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // Use require to load OpenAI module

const app = express();
app.use(cors());
app.use(express.json());

// Fetch the OpenAI API key from Firebase environment configuration
const apiKey = functions.config().openai.key;

// Initialize OpenAI instance
const openai = new OpenAI({
  apiKey,
});

app.post('/call-openai', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).send({ error: 'Prompt is required' });
    }

    // Use the new chat completion setup
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Ensure correct model
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }, // Pass user prompt here
      ],
    });

    return res.status(200).send(completion);
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

exports.api = functions.https.onRequest(app);
