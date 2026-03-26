
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
async function execute(symptoms, dbContext = null, imageData = null) {
  // Validate image file size (7MB limit)
  if (imageData && imageData.buffer) {
    const MAX_FILE_SIZE = 7 * 1024 * 1024; // 7MB
    if (imageData.buffer.length > MAX_FILE_SIZE) {
      throw new Error('Image file size exceeds 7MB limit');
    }
  }

  // Build context string from database
  let contextString = '';
  if (dbContext) {
    const { illnesses, meridianNames } = dbContext;
    
    contextString += '\n\n=== DATABASE CONTEXT ===\n';
    
    // Add illness information
    if (illnesses && illnesses.length > 0) {
      contextString += '\nAVAILABLE ILLNESSES:\n';
      illnesses.forEach(illness => {
        contextString += `- ID: ${illness.illnessId}, Name: ${illness.illnessName}, Description: ${illness.description}, Category: ${illness.category}\n`;
      });
    }
    
    // Add meridian information
    if (meridianNames && meridianNames.length > 0) {
      contextString += '\nAVAILABLE MERIDIANS:\n';
      meridianNames.forEach(name => {
        contextString += `- ${name}\n`;
      });
    }
    
    contextString += '\n=== END DATABASE CONTEXT ===\n';
  }

  // Build parts array for Gemini request
  const parts = [];
  
  // Add text part with symptoms and context
  parts.push({
    text: `${SYSTEM_PROMPT}${contextString}\nUSER SYMPTOMS: ${symptoms}`
  });
  
  // Add image part if provided
  if (imageData && imageData.buffer && imageData.mimetype) {
    parts.push({
      inlineData: {
        mimeType: imageData.mimetype,
        data: imageData.buffer.toString('base64')
      }
    });
  }

  // Build Gemini request
  const request = {
    contents: [
      {
        role: 'user',
        parts: parts
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

