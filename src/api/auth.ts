import { VercelRequest, VercelResponse } from '@vercel/node';
import connectDB from '../config/db';
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendError } from '../utils/response';

export const login = async (req: VercelRequest, res: VercelResponse) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return sendError(res, 'User not found', 404);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendError(res, 'Invalid credentials', 401);

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  } catch (err) {
    return sendError(res, 'Login failed', 500);
  }
};