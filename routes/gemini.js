const express = require('express');
const { execute } = require('../gemini/suggestion.service');
const { getIllnesses } = require('../models/illness');
const { getMeridians, getUniqueMeridianNames } = require('../models/meridian');

const auth = require("../middleware/auth");
const { geminiValidation } = require('../middleware/validation');
const { aiLimiter } = require('../middleware/rateLimiter');
const router = express.Router();

router.post('/suggest', aiLimiter, auth, geminiValidation.suggest, async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    
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


