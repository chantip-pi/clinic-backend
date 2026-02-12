const { GoogleGenerativeAI } = require('@google/generative-ai');
const { SYSTEM_PROMPT } = require('./script.prompt');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Model IDs
const PRIMARY_MODEL_ID = 'gemini-2.5-flash';
const FALLBACK_MODEL_ID = 'gemini-2.5-flash-lite';

// Cache model instances to avoid recreating them on every call
let primaryModel = null;
let fallbackModel = null;

function getPrimaryModel() {
  if (!primaryModel) {
    primaryModel = genAI.getGenerativeModel({
      model: PRIMARY_MODEL_ID,
    //  systemInstruction: SYSTEM_PROMPT,
    });
  }
  return primaryModel;
}

function getFallbackModel() {
  if (!fallbackModel) {
    fallbackModel = genAI.getGenerativeModel({
      model: FALLBACK_MODEL_ID,
    //  systemInstruction: SYSTEM_PROMPT,
    });
  }
  return fallbackModel;
}

module.exports = { getPrimaryModel, getFallbackModel };
