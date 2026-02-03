import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  // Use the API key from the environment variable
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Falta la clave API. Por favor verifica tu configuración de entorno.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Sends the image and color prompt to Gemini to repaint the walls.
 * @param base64Image The raw base64 string of the image (without data:image/... prefix).
 * @param mimeType The mime type of the image (e.g., image/png).
 * @param colorDescription A descriptive string of the color for the prompt.
 */
export const repaintWalls = async (
  base64Image: string,
  mimeType: string,
  colorDescription: string
): Promise<string> => {
  const ai = getAiClient();
  
  // Prompt engineering to ensure only walls change and realism is maintained.
  // We strictly structure the prompt to handle both English and Spanish descriptions cleanly.
  const prompt = `Repaint the walls of this room. 
  The new wall appearance should be: "${colorDescription}".
  Maintain all original furniture, lighting shadows, flooring, ceiling, and architectural details exactly as they are. 
  The result must be high quality, photorealistic, and look like a professional interior design photo. 
  Do not change the color of the ceiling or the floor. Only the vertical walls.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: prompt
          }
        ]
      }
    });

    // Iterate through parts to find the image part
    if (response.candidates && response.candidates.length > 0) {
      const content = response.candidates[0].content;
      if (content && content.parts) {
        for (const part of content.parts) {
          if (part.inlineData && part.inlineData.data) {
             return part.inlineData.data;
          }
        }
      }
    }
    
    throw new Error("El modelo no generó ninguna imagen.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Error al generar la imagen.");
  }
};