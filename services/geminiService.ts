import { GoogleGenAI, Type } from "@google/genai";
import { ListingData, ItemCategory, ImageResolution } from "../types";

// Create a function to get a fresh client instance to avoid stale config issues
// MUST read process.env.API_KEY dynamically inside the function to catch updates from key selection
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Analyze the image using Gemini 2.5 Flash to get listing details.
 * (Switched from gemini-3-pro-preview to ensure permission access)
 */
export const analyzeItemImage = async (base64Image: string): Promise<ListingData> => {
  const ai = getClient();
  
  const prompt = `
    You are an expert reseller for platforms like Wallapop and Vinted. 
    Analyze this image. 
    1. Identify if it is an 'OBJECT' (furniture, electronics, decor) or 'CLOTHING' (apparel, shoes, accessories).
    2. Write a catchy, SEO-friendly Title.
    3. Write a persuasive Description highlighting condition and style.
    4. Suggest a Price Range in Euros (e.g. "15€ - 25€").
    5. Generate 5 relevant Hashtags.
    6. Suggest 2 marketplaces (e.g., Wallapop, Vinted, Depop).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ['OBJECT', 'CLOTHING', 'UNKNOWN'] },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priceRange: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedMarketplaces: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['category', 'title', 'description', 'priceRange', 'hashtags']
      }
    }
  });

  const jsonText = response.text;
  if (!jsonText) throw new Error("Failed to analyze image");
  
  const data = JSON.parse(jsonText);
  return data as ListingData;
};

/**
 * Edit an existing image using Gemini 2.5 Flash Image based on user prompt.
 * e.g. "Remove background", "Add a retro filter".
 */
export const editImage = async (base64Image: string, prompt: string): Promise<string> => {
  const ai = getClient();
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: prompt }
      ]
    }
  });

  // Find the image part in the response
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image returned from editing model");
};

/**
 * MOCK: Generate a high-quality new image.
 * This is currently MOCKED for Demo purposes as per user request to avoid API limitations.
 */
export const generateHighResImage = async (
  base64Image: string,
  prompt: string, 
  resolution: ImageResolution
): Promise<string> => {
  console.log("--- DEMO MODE: MOCKING PRO GENERATION ---");
  console.log("Prompt:", prompt);
  console.log("Resolution:", resolution);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // In a real app with a paid key, we would use:
  /*
  const ai = getClient();
  const parts: any[] = [{ text: prompt }];
  if (base64Image) {
    parts.unshift({
      inlineData: { mimeType: 'image/jpeg', data: base64Image }
    });
  }
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: { parts: parts },
    config: { imageConfig: { imageSize: resolution, aspectRatio: "3:4" } }
  });
  // ... return response ...
  */

  // For DEMO: Return the original image (or you could return a specific placeholder if desired)
  // Ensure we return a data URL
  if (!base64Image.startsWith('data:image')) {
    return `data:image/jpeg;base64,${base64Image}`;
  }
  return base64Image;
};