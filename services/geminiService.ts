
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateResponseDraft = async (
  projectContext: string,
  customerFeedback: string,
  role: string
): Promise<string> => {
  if (!ai) {
    return "API Key not found. Please configure the environment variable.";
  }

  try {
    const prompt = `
      我是一个电力设计院的项目经理。
      项目背景: ${projectContext}
      客户角色: ${role}
      客户反馈/要求: "${customerFeedback}"
      
      请帮我草拟一份简短、专业、得体的回复建议。
      回复应当：
      1. 感谢客户的反馈。
      2. 确认我们已经收到并正在处理。
      3. 说明我们接下来的行动计划。
      4. 语气要诚恳、专业（工程行业标准）。
      
      请直接输出回复内容，不要包含其他解释。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "无法生成回复。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 服务暂时不可用，请稍后重试。";
  }
};
