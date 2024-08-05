/* server.js */

const cors = require('cors');
const next = require('next');
const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const Sentiment = require('sentiment');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const app = next({ dev });
const handler = app.getRequestHandler();
const sentiment = new Sentiment();

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true
});

const validRoomCodes = new Set();
const chatHistory = {}; // Store chat messages by room

app.prepare()
  .then(() => {
    const server = express();

    // Middleware
    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    // Endpoint to create a new room
    server.post('/create-room', (req, res, next) => {
      try {
        const { room } = req.body;
        if (!room) {
          return res.status(400).send('Room name is required');
        }
        validRoomCodes.add(room);
        chatHistory[room] = [];
        res.status(200).send({ status: 'success', room });
      } catch (error) {
        res.status(500).send('Internal Server Error');
      }
    });

    // Endpoint to handle incoming messages
    server.post('/message', (req, res, next) => {
      try {
        const { user = null, message = '', room = '', timestamp = +new Date() } = req.body;

        if (!validRoomCodes.has(room)) {
          return res.status(400).send('Invalid room code');
        }

        const sentimentScore = sentiment.analyze(message).score;

        const chat = { user, message, room, timestamp, sentiment: sentimentScore };

        chatHistory[room].push(chat); // Add message to chat history
        pusher.trigger(`chat-room-${room}`, 'new-message', { chat }); // Trigger Pusher event

        res.status(200).send('Message sent');
      } catch (error) {
        res.status(500).send('Internal Server Error');
      }
    });

    // Endpoint to get chat history
    server.post('/messages', (req, res, next) => {
      try {
        const { room = '' } = req.body;

        if (!validRoomCodes.has(room)) {
          return res.status(400).send('Invalid room code');
        }

        res.json({ messages: chatHistory[room] || [], status: 'success' });
      } catch (error) {
        res.status(500).send('Internal Server Error');
      }
    });

    // Default handler for all other routes
    server.get('*', (req, res) => {
      return handler(req, res);
    });

    // Start the server
    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
