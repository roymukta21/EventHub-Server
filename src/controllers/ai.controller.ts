import { Request, Response } from 'express';
import { getGeminiModel } from '../config/gemini';
import { sendSuccess, sendError } from '../utils/response';

export const chat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message } = req.body;
    if (!message) { sendError(res, 'Message is required', 400); return; }
    const model = getGeminiModel();
    const result = await model.generateContent(`You are a helpful assistant for EventHub platform. Help users with events, travel, food, and recommendations.\n\nUser: ${message}`);
    sendSuccess(res, 'AI response', { reply: result.response.text() });
  } catch { sendError(res, 'AI chat failed'); }
};

export const generateDescription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category } = req.body;
    if (!title) { sendError(res, 'Title is required', 400); return; }
    const model = getGeminiModel();
    const result = await model.generateContent(`Write a compelling 2-3 sentence description for a listing titled "${title}"${category ? ` in the ${category} category` : ''}. Make it engaging and informative.`);
    sendSuccess(res, 'Description generated', { description: result.response.text() });
  } catch { sendError(res, 'Description generation failed'); }
};

export const reviewSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reviews } = req.body;
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) { sendError(res, 'Reviews array is required', 400); return; }
    const text = reviews.map((r: { rating: number; comment: string }) => `Rating: ${r.rating}/5 - ${r.comment}`).join('\n');
    const model = getGeminiModel();
    const result = await model.generateContent(`Summarize the following user reviews into 2-3 sentences highlighting key positives and negatives:\n\n${text}`);
    sendSuccess(res, 'Summary generated', { summary: result.response.text() });
  } catch { sendError(res, 'Review summary failed'); }
};
