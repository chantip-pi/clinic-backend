const { getPrimaryModel, getFallbackModel } = require('./gemini.model');

async function runDiagnosis(symptoms) {
  const request = {
    contents: [
      {
        role: 'user',
        parts: [{ text: symptoms }]
      }
    ]
  };

  // Try primary model first
  try {
    const model = getPrimaryModel();
    const result = await model.generateContent(request);
    return result.response.text();
  } catch (err) {
    const message = String(err?.message || '');
    const is503 =
      message.includes('503') ||
      message.includes('Service Unavailable') ||
      message.toLowerCase().includes('overloaded');

    // If it's not a 503 / overload issue, rethrow
    if (!is503) {
      throw err;
    }

    // Fallback to a different model when the primary is overloaded
    const fallbackModel = getFallbackModel();
    const result = await fallbackModel.generateContent(request);
    return result.response.text();
  }
}

module.exports = { runDiagnosis };
