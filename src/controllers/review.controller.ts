import { Response } from 'express';
import Review from '../models/review.model';
import Item from '../models/item.model';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

const updateItemRating = async (itemId: string) => {
  const reviews = await Review.find({ itemId });
  if (!reviews.length) return;
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Item.findByIdAndUpdate(itemId, { rating: Math.round(avg * 10) / 10 });
};

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { rating, comment, itemId } = req.body;
    const review = await Review.create({ rating, comment, itemId, userId: req.user?.id });
    await updateItemRating(itemId);
    sendSuccess(res, 'Review created', review, 201);
  } catch { sendError(res, 'Failed to create review'); }
};

export const getReviewsByItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reviews = await Review.find({ itemId: req.params.itemId }).populate('userId', 'name avatar');
    sendSuccess(res, 'Reviews fetched', reviews);
  } catch { sendError(res, 'Failed to fetch reviews'); }
};

export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) { sendError(res, 'Review not found', 404); return; }
    if (review.userId.toString() !== req.user?.id && req.user?.role !== 'ADMIN') { sendError(res, 'Forbidden', 403); return; }
    const itemId = review.itemId.toString();
    await review.deleteOne();
    await updateItemRating(itemId);
    sendSuccess(res, 'Review deleted');
  } catch { sendError(res, 'Failed to delete review'); }
};
