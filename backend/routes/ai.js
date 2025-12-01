const express = require('express');
const router = express.Router();
const Upload = require('../models/Upload');
const auth = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/generate-insights/:id', auth, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    // Try the preferred model first, fall back to listing available models when necessary
    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
    } catch (e) {
      console.warn('Preferred model unavailable, attempting to list models:', e.message || e);
    }

    if (!model) {
      try {
        const available = await genAI.listModels();
        // Attempt to pick a model that supports generateContent and prefer known-good families
        const preferredOrder = [/gemini/i, /bison/i, /text/i, /chat/i];
        let selectedId = null;
        if (Array.isArray(available)) {
          // First try to find a model that supports generateContent and matches preference order
          for (const pref of preferredOrder) {
            for (const m of available) {
              const methods = m.supportedMethods || m.supported_methods || m.supported || [];
              const id = m.name || m.id || m.model || m.modelId;
              if (!id) continue;
              if (methods && methods.includes && methods.includes('generateContent') && pref.test(id)) {
                selectedId = id;
                break;
              }
            }
            if (selectedId) break;
          }

          // If none matched preference, pick the first model that supports generateContent
          if (!selectedId) {
            for (const m of available) {
              const methods = m.supportedMethods || m.supported_methods || m.supported || [];
              const id = m.name || m.id || m.model || m.modelId;
              if (id && methods && methods.includes && methods.includes('generateContent')) {
                selectedId = id;
                break;
              }
              if (!selectedId && id) selectedId = id; // fallback to first id
            }
          }
        }

        if (!selectedId) throw new Error('No usable generative model returned by ListModels');
        model = genAI.getGenerativeModel({ model: selectedId });
        console.info('Using fallback model:', selectedId);
      } catch (err) {
        console.error('Error selecting AI model:', err);
        return res.status(500).json({ message: 'AI model not available: ' + (err.message || err) });
      }
    }

    const prompt = `Analyze the following JSON data and provide a brief summary of the key insights:\n\n${JSON.stringify(upload.dataJson.slice(0, 50))}`; // Limit the data sent to the API

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    upload.aiInsights = text;
    await upload.save();

    res.json({ insights: text });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
