const { GoogleGenerativeAI } = require('@google/generative-ai');
const { DIAGNOSIS_SYSTEM_PROMPT } = require('./diagnosis.prompt');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function createDiagnosisModel() {
  
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash", 
    systemInstruction: DIAGNOSIS_SYSTEM_PROMPT
  });
}

module.exports = { createDiagnosisModel };
