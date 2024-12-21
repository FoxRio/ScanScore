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

// async function checkDownloadToken(bucketName, filePath) {
//   const bucket = admin.storage().bucket(bucketName);
//   const file = bucket.file(filePath);

//   try {
//     const [metadata] = await file.getMetadata();
//     const downloadTokens = metadata.metadata?.firebaseStorageDownloadTokens;

//     if (downloadTokens) {
//       console.log('Download token exists:', downloadTokens);
//     } else {
//       console.log('No download token available for the file.');
//     }

//     return downloadTokens || null;
//   } catch (error) {
//     console.error('Error fetching metadata:', error);
//     return null;
//   }
// }

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

app.post('/grade-test', async (req, res) => {
  const {
    correctAnswers, userId, fileName,
  } = req.body;

  if (!correctAnswers || !userId || !fileName) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }
  const imageToGradePath = `userUploads/${userId}/uploaded/${fileName}`;
  const pythonApiUrl = 'https://europe-west1-scanscore-6cbf7.cloudfunctions.net/process_image';

  try {
    const bucket = admin.storage().bucket();
    const file = bucket.file(imageToGradePath);

    const [metadata] = await file.getMetadata();
    console.log('File Metadata:', JSON.stringify(metadata, null, 2));
    const downloadTokens = metadata.metadata?.firebaseStorageDownloadTokens;
    if (!downloadTokens) {
      return res.status(500).json({ error: 'No download token available for the file.' });
    }
    const downloadUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(imageToGradePath)}?alt=media&token=${downloadTokens}`;

    const response = await axios.post(pythonApiUrl, {
      image_url: downloadUrl,
      correct_answers: correctAnswers,
    });
    console.log('Response:', response.data);
    return res.status(200).send({
      message: 'Test graded successfully',
      response: response.data,
    });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send({ error: 'Error processing the request', msg: err });
  }
});

exports.api = functions.https.onRequest(app);
