const express = require('express');
const { execute } = require('../gemini/suggestion.service');

const router = express.Router();

router.post('/suggest', async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || typeof symptoms !== 'string') {
      return res.status(400).json({ error: 'symptoms (string) is required' });
    }
    const text = await execute(symptoms);
    res.json({ result: text });
  } catch (err) {
    next(err);
  }
});


module.exports = router;


