const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const admin = require('firebase-admin');
const axios = require('axios');
// const os = require('os');

// Initialize Firebase Admin SDK if not already done
if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();
app.use(cors());
app.use(express.json());

// OpenAI endpoint
const apiKey = functions.config().openai.key;
const openai = new OpenAI({ apiKey });

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
      model: 'gpt-4',
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

app.post('/grade-test', async (req, res) => {
  const {
    correctAnswers, userId, fileUrl, fileName,
  } = req.body;

  if (!correctAnswers || !userId || !fileName || !fileUrl) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const pythonApiUrl = 'https://europe-west1-scanscore-6cbf7.cloudfunctions.net/process_image';

  try {
    const response = await axios.post(pythonApiUrl, {
      image_url: fileUrl,
      correct_answers: correctAnswers,
    });
    return res.status(200).send({
      message: 'Test graded successfully',
      response: {
        score: response.data[0],
        maxScore: response.data[1],
        percentageValue: response.data[2],
      },
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send({ error: 'Error processing the request', msg: err });
  }
});

exports.api = functions.https.onRequest(app);
