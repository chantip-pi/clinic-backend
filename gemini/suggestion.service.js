
// suggestion.service.js
const { getPrimaryModel, getFallbackModel } = require('./gemini.model');
const { SYSTEM_PROMPT } = require('./script.prompt');


/**
 * Remove everything starting from "\n\ndata:"
 * so API returns only the narrative result text
 */
function extractResultText(output) {
  if (!output) return "";

  // Split at "data:" section (case-insensitive, flexible spacing)
  const cleaned = output.split(/\n\s*\n\s*data:/i)[0];

  return cleaned.trim();
}


/**
 * Extract JSON array of acupoints from model output
 */
function extractAcupoints(output) {
  let acupoints = [];

  try {
    const match = output.match(/\[([\s\S]*?)\]/); // crude JSON array match
    if (match) {
      acupoints = JSON.parse(match[0]);
    }
  } catch (e) {
    console.error("Failed to parse acupoints JSON:", e);
  }

  return acupoints;
}


/**
 * Detect Gemini overload
 */
function isError(err) {
  const message = String(err?.message || '').toLowerCase();
  return message.includes('Error') || message.includes('overloaded') || message.includes('quota');
}


/**
 * Main execution function
 */
async function execute(symptoms) {
  // 2️⃣ Build Gemini request
  const request = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${SYSTEM_PROMPT}\nUSER SYMPTOMS: ${symptoms}`

          }
        ]
      }
    ]
  };

  /**
   * =========================
   * PRIMARY MODEL EXECUTION
   * =========================
   */
  try {
    const model = getPrimaryModel();
    const result = await model.generateContent(request);
    const output = await result.response.text();

    // Extract structured + cleaned data
    const acupoints = extractAcupoints(output);
    const resultText = extractResultText(output);

    return {
      text: resultText,
      acupoints
    };

  } catch (err) {

    // If not overload error → throw
    if (!isError(err)) throw err;

    /**
     * =========================
     * FALLBACK MODEL EXECUTION
     * =========================
     */
    const fallbackModel = getFallbackModel();
    const result = await fallbackModel.generateContent(request);
    const output = await result.response.text();

    const acupoints = extractAcupoints(output);
    const resultText = extractResultText(output);

    return {
      text: resultText,
      acupoints
    };
  }
}


module.exports = { execute };

