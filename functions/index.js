const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const admin = require('firebase-admin');
const axios = require('axios');
const {
  log,
} = require('firebase-functions/logger');

// const os = require('os');

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
    correctAnswers, userId, fileUrl, folderName,
  } = req.body;

  if (!correctAnswers || !userId || !folderName || !fileUrl) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const pythonApiUrl = 'https://europe-west1-scanscore-6cbf7.cloudfunctions.net/process_image';

  try {
    const response = await axios.post(pythonApiUrl, {
      image_url: fileUrl,
      correct_answers: correctAnswers,
      user_id: userId,
      folder_name: folderName,
    });
    return res.status(200).send({
      message: 'Test graded successfully',
      response: {
        gradedImageUrl: response.data[0],
        score: response.data[1],
        maxScore: response.data[2],
        percentageValue: response.data[3],
      },
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send({ error: 'Error processing the request', msg: err });
  }
});

app.post('/get-answerkey', async (req, res) => {
  const {
    userId, folderName, fileName, fileUrl,
  } = req.body;

  const pythonApiUrl = 'https://europe-west1-scanscore-6cbf7.cloudfunctions.net/read_qrcode';
  if (!userId || !folderName || !fileName || !fileUrl) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  try {
    const response = await axios.post(pythonApiUrl, {
      user_id: userId,
      file_name: fileName,
      image_url: fileUrl,
      folder_name: folderName,
    });
    log('Response:', response.data);
    return res.status(200).send({ message: 'Answer key extracted successfully', response: response.data });
  } catch (err) {
    console.error('Error:', err);
    log('Error:', err.data);
    return res.status(500).send({ error: 'Error processing the request', msg: err });
  }
});

exports.api = functions.https.onRequest(app);
