
import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateManagementReport(tasks: Task[]) {
  const taskSummary = tasks.map(t => `${t.title} (${t.status}, ${t.progress}%)`).join(", ");
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Hãy đóng vai Senior Project Manager. Dưới đây là danh sách công việc của công ty T-Lux Floor: ${taskSummary}. Hãy phân tích ngắn gọn tình hình hiện tại (3-4 câu) và đề xuất 3 hành động ưu tiên để đảm bảo tiến độ thi công và kinh doanh. Trả về kết quả bằng tiếng Việt.`,
  });

  return response.text;
}
