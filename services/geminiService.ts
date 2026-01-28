
import { GoogleGenAI, Type } from "@google/genai";
import { Product, Language } from "../types";

/**
 * Обогащает данные о товаре, используя поиск Google через Gemini
 */
export const enrichProductWithAI = async (brand: string, model: string): Promise<Partial<Product> & { sources?: any[] }> => {
  // Check if user has selected an API key as required for gemini-3-pro-image-preview
  if (typeof window !== 'undefined' && (window as any).aistudio) {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
      // Proceed assuming success as per guidelines to avoid race condition
    }
  }

  // Create a new GoogleGenAI instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const genAIModel = 'gemini-3-pro-image-preview';
  
  const prompt = `
    Найдите подробную информацию об этом товаре: Бренд: "${brand}", Модель: "${model}".
    Используйте поиск на сайте: https://vivaelectronics.am/
    
    Извлеките следующие данные (ОТВЕТ ТОЛЬКО НА РУССКОМ):
    1. Текущая цена в AMD (число).
    2. Полное описательное название товара.
    3. Технические характеристики (массив строк).
    4. Прямая ссылка на изображение товара.
    5. Краткое описание на русском языке.

    Верните данные строго в формате JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: genAIModel,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    const responseText = response.text || '{}';
    let result = {};
    
    // Using regex as response.text from grounded search might contain markdown around the JSON
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);
    } catch (e) {
      console.warn("Could not parse JSON from grounded response:", e);
    }
    
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { ...result, sources };
  } catch (error: any) {
    // If the request fails with an error message containing "Requested entity was not found.", reset the key selection state
    if (error?.message?.includes("Requested entity was not found.") && typeof window !== 'undefined' && (window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
    }
    console.error("AI Enrichment failed:", error);
    return {};
  }
};

export const chatWithAssistant = async (history: {role: string, text: string}[], message: string, lang: Language = 'ru'): Promise<string> => {
    // Create a new GoogleGenAI instance right before making an API call
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
            systemInstruction: `Вы Нова, ИИ-ассистент для покупок в магазине 'Gisi Market'. Вы помогаете покупателям находить товары и отвечаете на вопросы.
            ОТВЕЧАЙТЕ СТРОГО НА РУССКОМ ЯЗЫКЕ.`
        }
    });

    const response = await chat.sendMessage({ message });
    return response.text || "Ошибка связи.";
};
