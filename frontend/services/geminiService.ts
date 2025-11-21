import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Summarizes a medical record description using Gemini.
 * In a real app, this would analyze the full text/PDF content.
 */
export const summarizeMedicalRecord = async (recordDescription: string): Promise<string> => {
  try {
    // Defensive check if key is missing in demo environment
    if (!process.env.API_KEY) {
      return "AI Summary unavailable (Missing API Key). Simulating: This record indicates a stable condition with minor recommendations for lifestyle changes.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize the following medical record description into a simple, non-technical sentence for a patient: "${recordDescription}"`,
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating AI summary.";
  }
};