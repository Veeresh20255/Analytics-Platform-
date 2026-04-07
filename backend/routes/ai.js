const express = require('express');
const router = express.Router();
const Upload = require('../models/Upload');
const { auth } = require('../middleware/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ AI Insights Route
router.post('/generate-insights/:id', auth, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ message: 'Upload not found' });

    // ✅ SECURITY: Only owner or admin
    if (upload.user?.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: You cannot access this upload' });
    }

    // ✅ CHECK DATA
    if (!upload.dataJson || !upload.dataJson.length) {
      return res.status(400).json({ message: 'Upload has no data to generate insights' });
    }

    // ------------------ 📊 BASIC ANALYTICS ------------------
    const values = upload.dataJson
      .map(row => Number(Object.values(row)[1]))
      .filter(n => !isNaN(n));

    const avg = values.length
      ? values.reduce((a, b) => a + b, 0) / values.length
      : 0;

    const anomalies = values.filter(v => v > avg * 2 || v < avg * 0.5);

    // ------------------ 🤖 AI PROMPT ------------------
    const prompt = `
Analyze this dataset and provide:

1. Key trends
2. Any anomalies or outliers
3. Summary insights
4. Business recommendations

Dataset sample:
${JSON.stringify(upload.dataJson.slice(0, 50))}

Basic stats:
- Average: ${avg}
- Total records: ${values.length}
- Possible anomalies count: ${anomalies.length}
`;

    // ------------------ 🤖 AI MODEL ------------------
    let model;

    try {
      model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
    } catch {
      const available = await genAI.listModels();
      let selectedId = null;

      for (const m of available) {
        const methods = m.supportedMethods || [];
        const id = m.name || m.id;
        if (methods.includes('generateContent')) {
          selectedId = id;
          break;
        }
      }

      if (!selectedId) throw new Error('No usable generative model available');

      model = genAI.getGenerativeModel({ model: selectedId });
    }

    // ------------------ 🤖 GENERATE ------------------
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // ------------------ 💾 SAVE ------------------
    upload.aiInsights = text;
    await upload.save();

    // ------------------ 📤 RESPONSE ------------------
    res.json({
      insights: text,
      stats: {
        average: avg,
        total: values.length,
        anomalies: anomalies.length
      }
    });

  } catch (err) {
    console.error('AI generation error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;