require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { logger, errorHandler } = require('./middleware');
const routes = require('./routes');

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json());
app.use(logger);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', routes);
app.use(errorHandler);

module.exports = app;


