const { createDiagnosisModel } = require('./gemini.model');

async function runDiagnosis(symptoms) {
  const model = createDiagnosisModel();

  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: symptoms }]
      }
    ]
  });

  return result.response.text();
}

module.exports = { runDiagnosis };
