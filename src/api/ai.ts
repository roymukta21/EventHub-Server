import { VercelRequest, VercelResponse } from '@vercel/node';
import connectDB from '../config/db';
import { sendSuccess, sendError } from '../utils/response';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await connectDB();

  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;
      // TODO: Call Google Gemini API with your API Key
      const aiResponse = { text: `AI response for: ${prompt}` };
      return sendSuccess(res, 'AI generated successfully', aiResponse);
    } catch (err) {
      return sendError(res, 'AI service error', 500);
    }
  }

  return sendError(res, 'Method not allowed', 405);
}