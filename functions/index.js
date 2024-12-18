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
    const {
      prompt,
      title = 'Test',
      description = 'no description',
      conversationHistory = [],
    } = req.body;
    // const MAX_TOKENS = 3000;
    // const trimmedHistory = conversationHistory.join(' ').split(' ').slice(-MAX_TOKENS).join(' ');

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Create a dynamic system prompt
    const systemPrompt = `You are a helpful assistant for a teacher. Your goal is to provide suggestions for a test named ${title}.
    The user provided this description about the test: ${description}.
    If you are asked to provide questions, ONLY provide the number of questions and answer multiple choice answers.
    If you are unsure about the number of questions, default to one. Adjust the difficulty level based on the test's context. 
    The conversation history is as follows: {${conversationHistory.join(' ')}}.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4', // Ensure correct model
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
    });

    const text = completion.choices[0]?.message?.content || 'No suggestions returned from AI';
    return res.status(200).send({ text });
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return res.status(500).json({ error: `Internal Server Error, ${error}` });
  }
});
exports.api = functions.https.onRequest(app);
