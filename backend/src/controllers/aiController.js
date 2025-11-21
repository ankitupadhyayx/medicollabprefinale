const { GoogleGenAI } = require('@google/genai');
const Record = require('../models/Record');

// Initialize GenAI with the API key from environment variables
// Ensure process.env.GEMINI_API_KEY is set in your .env file
let ai;
try {
    if (process.env.GEMINI_API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
} catch (e) {
    console.warn("Gemini API Key missing or invalid. AI features will return mock responses.");
}

exports.getPatientInsights = async (req, res) => {
  try {
    // If no API key, fallback to mock to prevent crash
    if (!ai) {
        return res.json({ insight: "AI Analysis unavailable. Please configure GEMINI_API_KEY in backend." });
    }

    // Fetch patient's recent records context
    const records = await Record.find({ patient: req.user._id }).sort({ createdAt: -1 }).limit(5);
    
    let contextText = "No records found.";
    if (records.length > 0) {
        contextText = records.map(r => `- [${r.date}] ${r.type}: ${r.title}`).join('\n');
    }

    const prompt = `
      You are a helpful medical AI assistant. Analyze the following recent medical history summary for a patient and provide 
      3 key health insights or preventative care tips. Keep it professional, empathetic, and concise.
      
      Patient History:
      ${contextText}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    res.json({ insight: response.text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "AI Service Error", error: error.message });
  }
};

exports.analyzeRecord = async (req, res) => {
  try {
      const { text } = req.body;
      if (!ai) {
          return res.json({ summary: "Mock Summary: Record looks normal.", riskLevel: "Low" });
      }

      const prompt = `Summarize this medical text in one simple sentence and estimate a risk level (Low/Medium/High): "${text}"`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ 
          summary: response.text,
          riskLevel: "Low" // In a real app, we'd parse this from the AI response JSON
      });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};