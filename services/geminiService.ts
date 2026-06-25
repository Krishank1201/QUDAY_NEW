import { GoogleGenAI } from "@google/genai";

// Use the API key directly from process.env as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const askQuantumAssistant = async (prompt: string) => {
  try {
    // Fix: Using 'gemini-3.1-pro-preview' as this assistant handles complex STEM and technical reasoning tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: `You are the QuDay Quantum Assistant. QuDay is a German company based in Jena (founded 2025) specializing in quantum technology.
        Our key products are:
        - RAMQ (BBM92 protocol, ultra-secure communication).
        - HD Entangled Photon Pair Sources (high fidelity >97%, compact).
        - Polarization Analyzing Module (PAM).
        - QuDay Software Suite.
        
        Answer questions professionally, technically accurate but accessible. Focus on secure communications and quantum entanglement.`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting to my quantum core right now. Please try again in a moment.";
  }
};