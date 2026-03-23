import { Response } from 'express';
import User from '../models/user.model';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

export const getAllUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    sendSuccess(res, 'Users fetched', users);
  } catch { sendError(res, 'Failed to fetch users'); }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) { sendError(res, 'User not found', 404); return; }
    sendSuccess(res, 'User fetched', user);
  } catch { sendError(res, 'Failed to fetch user'); }
};

export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).select('-password');
    if (!user) { sendError(res, 'User not found', 404); return; }
    sendSuccess(res, 'User updated', user);
  } catch { sendError(res, 'Failed to update user'); }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) { sendError(res, 'User not found', 404); return; }
    sendSuccess(res, 'User deleted');
  } catch { sendError(res, 'Failed to delete user'); }
};

export const updateUserRole = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId, role } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
    if (!user) { sendError(res, 'User not found', 404); return; }
    sendSuccess(res, 'Role updated', user);
  } catch { sendError(res, 'Failed to update role'); }
};
