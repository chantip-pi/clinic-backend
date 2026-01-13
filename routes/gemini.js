const express = require('express');
const { runDiagnosis } = require('../gemini/server');

const router = express.Router();

router.post('/diagnosis', async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || typeof symptoms !== 'string') {
      return res.status(400).json({ error: 'symptoms (string) is required' });
    }
    const text = await runDiagnosis(symptoms);
    res.json({ result: text });
  } catch (err) {
    next(err);
  }
});

module.exports = router;


