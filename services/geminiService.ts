import { GoogleGenAI, Type } from "@google/genai";
import { User, InsightType, InsightResponse } from "../types";

const apiKey = process.env.API_KEY || ''; // Ensure this env var is set
const ai = new GoogleGenAI({ apiKey });

export const geminiService = {
  generateInsight: async (user: User, type: InsightType): Promise<InsightResponse> => {
    try {
      const model = 'gemini-2.5-flash';
      
      const prompt = `
        Generate a short, single-sentence personalized ${type.toLowerCase()} message for a user named ${user.name}.
        Their interests are: ${user.interests.join(', ')}.
        Be concise, inspiring, and professional.
      `;

      // Request structured JSON output
      const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: { type: Type.STRING },
              author: { type: Type.STRING, description: "If it is a quote, provide the author, otherwise leave empty or put 'AI Assistant'" }
            },
            required: ["message"]
          }
        }
      });

      const text = response.text;
      if (!text) {
        throw new Error("No response from AI");
      }

      return JSON.parse(text) as InsightResponse;

    } catch (error) {
      console.error("Gemini API Error:", error);
      // Fallback in case of API error or quota limit
      return {
        message: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
      };
    }
  }
};