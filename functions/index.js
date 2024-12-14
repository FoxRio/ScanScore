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
    const { title } = req.body || 'Test';
    const { description } = req.body || 'no description';

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    const contnt = `You are a helpful assistant for a teacher. Your goal is to provide suggestions for a test named ${title}.
    The user provided this description about the test: ${description}.
    The user asked for suggestions on how to improve the test. Provide suggestions for the test.
    If you are asked to provide questions then also provide multiple choice answers`;
    // Use the new chat completion setup
    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Ensure correct model
      messages: [
        { role: 'system', content: contnt },
        { role: 'user', content: prompt }, // Pass user prompt here
      ],
    });
    return res.status(200).send({ text: completion.choices }); // JSON response
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return res.status(500).json({ error: 'Internal Server Error' }); // JSON error response
  }
});

exports.api = functions.https.onRequest(app);
