
import { GoogleGenAI, Type } from "@google/genai";
import { RefactorResult, SupportedLanguage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const REFACTOR_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    refactoredCode: {
      type: Type.STRING,
      description: "The improved and refactored version of the input code.",
    },
    reasons: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of specific reasons why the code was changed.",
    },
    concepts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "The name of the software engineering concept (e.g., DRY, KISS)." },
          description: { type: Type.STRING, description: "A beginner-friendly explanation of the concept." },
        },
        required: ["title", "description"],
      },
      description: "Key concepts introduced or applied during refactoring.",
    },
    summary: {
      type: Type.STRING,
      description: "A brief, encouraging summary of the improvements.",
    },
  },
  required: ["refactoredCode", "reasons", "concepts", "summary"],
};

export const refactorCode = async (code: string, language: SupportedLanguage): Promise<RefactorResult> => {
  try {
    const langContext = language === 'Auto-detect' ? 'the detected programming language' : language;
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Refactor the following code snippet written in ${langContext}. 
      Ensure the refactored version uses idiomatic best practices for ${langContext}.
      Focus on clean code principles and beginner friendliness. 
      Code: \`${code}\``,
      config: {
        systemInstruction: "You are an elite software mentor for junior developers. Your goal is to take a piece of code, refactor it to follow modern best practices, and provide a clear, educational breakdown of 'Why' and 'How'. Always respond in Korean. If the code is already perfect, explain why and maybe provide an alternative version.",
        responseMimeType: "application/json",
        responseSchema: REFACTOR_SCHEMA,
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      originalCode: code,
      ...result,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("코드 리팩토링 중 오류가 발생했습니다.");
  }
};
