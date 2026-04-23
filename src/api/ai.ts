import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai'; // প্যাকেজ ইমপোর্ট
//import connectDB from '../../config/db';
import { sendSuccess, sendError } from '../utils/response';
import connectDB from '../config/db';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;
      
      if (!prompt) {
        return sendError(res, 'Prompt is required', 400);
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return sendSuccess(res, 'AI generated successfully', { reply: text });
      
    } catch (err: any) {
      console.error("Gemini Error:", err);
      return sendError(res, 'AI service error', 500);
    }
  }

  return sendError(res, 'Method not allowed', 405);
}