import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FlowerData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  timestamp: number;
}

export async function generateFlower(): Promise<FlowerData> {
  const model = "gemini-2.5-flash-image";
  
  // First, generate a unique name and description
  const textResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Generate a name and a poetic 1-sentence description for a unique, fictional, beautiful AI-generated flower. It should sound exotic and dreamlike.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object" as any,
        properties: {
          name: { type: "string" as any },
          description: { type: "string" as any }
        },
        required: ["name", "description"]
      }
    }
  });

  const { name, description } = JSON.parse(textResponse.text);

  // Now, generate the image in 9:16 aspect ratio
  // gemini-2.5-flash-image supports 9:16 and does not require a user-selected API key
  const imageResponse = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          text: `A high-resolution, detailed, cinematic portrait of a fictional flower named "${name}". ${description}. Photorealistic, vibrant colors, macro photography, soft depth of field, morning dew, ethereal lighting, obsidian background. 9:16 aspect ratio.`
        }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "9:16"
      }
    }
  });

  let imageUrl = "";
  for (const part of imageResponse.candidates[0].content.parts) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
      break;
    }
  }

  if (!imageUrl) {
    throw new Error("Failed to generate flower image");
  }

  return {
    id: crypto.randomUUID(),
    name,
    description,
    imageUrl,
    timestamp: Date.now()
  };
}
