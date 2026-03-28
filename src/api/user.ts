import { VercelRequest, VercelResponse } from '@vercel/node';
import connectDB from '../config/db';
import User from '../models/user.model';
import { authenticate } from '../middleware/auth.middleware';
import { sendError } from '../utils/response';

const handler = async (req: VercelRequest & { user?: any }, res: VercelResponse) => {
  await connectDB();

  if (req.method === 'GET') {
    const user = await User.findById(req.user?.id).select('-password');
    return res.status(200).json({ user });
  }

  return sendError(res, 'Method not allowed', 405);
};

// @ts-ignore
export default authenticate(handler);