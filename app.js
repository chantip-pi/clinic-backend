require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { logger, errorHandler } = require('./middleware');
const { generalLimiter } = require('./middleware/rateLimiter');
const routes = require('./routes');

const FRONTEND_URL = process.env.USE_LOCALHOST === 'true' ? process.env.LOCAL_FRONTEND_URL : process.env.PROD_FRONTEND_URL;

const app = express();

app.use(
  cors({
   origin: FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-access-token']
  })
);

app.use(express.json());
app.use(logger);
app.use('/api', generalLimiter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', routes);
app.use('/images', express.static('images'));
app.use(errorHandler);

module.exports = app;


