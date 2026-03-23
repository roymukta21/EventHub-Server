import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { sendSuccess, sendError } from '../utils/response';
import { AuthRequest } from '../types';

const generateTokens = (id: string, role: string) => {
  const accessToken = jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
  const refreshToken = jwt.sign({ id, role }, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) { sendError(res, 'Email already registered', 400); return; }
    const user = await User.create({ name, email, password, role: role === 'ADMIN' ? 'ADMIN' : 'USER' });
    const tokens = generateTokens(user._id.toString(), user.role);
    sendSuccess(res, 'Registration successful', { user: { id: user._id, name: user.name, email: user.email, role: user.role }, ...tokens }, 201);
  } catch { sendError(res, 'Registration failed'); }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) { sendError(res, 'Invalid email or password', 401); return; }
    const tokens = generateTokens(user._id.toString(), user.role);
    sendSuccess(res, 'Login successful', { user: { id: user._id, name: user.name, email: user.email, role: user.role }, ...tokens });
  } catch { sendError(res, 'Login failed'); }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) { sendError(res, 'Refresh token required', 400); return; }
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as { id: string; role: 'USER' | 'ADMIN' };
    const tokens = generateTokens(decoded.id, decoded.role);
    sendSuccess(res, 'Token refreshed', tokens);
  } catch { sendError(res, 'Invalid refresh token', 401); }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) { sendError(res, 'User not found', 404); return; }
    sendSuccess(res, 'Profile fetched', user);
  } catch { sendError(res, 'Failed to fetch profile'); }
};
