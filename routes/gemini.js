const express = require('express');
const { execute } = require('../gemini/suggestion.service');
const { getIllnesses } = require('../models/illness');
const { getMeridians, getUniqueMeridianNames } = require('../models/meridian');

const auth = require("../middleware/auth");
const router = express.Router();

router.post('/suggest', auth, async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    if (!symptoms || typeof symptoms !== 'string') {
      return res.status(400).json({ error: 'symptoms (string) is required' });
    }
    
    // Fetch database context
    const illnesses = await getIllnesses();
    const meridians = await getMeridians();
    const meridianNames = await getUniqueMeridianNames();
    
    const text = await execute(symptoms, { illnesses, meridians, meridianNames });
    res.json({ result: text });
  } catch (err) {
    next(err);
  }
});


module.exports = router;


