import { Response } from 'express';
import Item from '../models/item.model';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

export const createItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await Item.create({ ...req.body, createdBy: req.user?.id });
    sendSuccess(res, 'Item created', item, 201);
  } catch { sendError(res, 'Failed to create item'); }
};

export const getItems = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, category, priceMin, priceMax, rating, sort, page = '1', limit = '10' } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;
    if (priceMin || priceMax) {
      const priceFilter: Record<string, number> = {};
      if (priceMin) priceFilter.$gte = Number(priceMin);
      if (priceMax) priceFilter.$lte = Number(priceMax);
      filter.price = priceFilter;
    }
    if (rating) filter.rating = { $gte: Number(rating) };
    const sortObj: Record<string, 1 | -1> = {};
    if (sort) {
      const key = sort.startsWith('-') ? sort.slice(1) : sort;
      sortObj[key] = sort.startsWith('-') ? -1 : 1;
    } else { sortObj.createdAt = -1; }
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const [data, total] = await Promise.all([
      Item.find(filter).sort(sortObj).skip(skip).limit(limitNum).populate('createdBy', 'name email'),
      Item.countDocuments(filter),
    ]);
    res.json({ success: true, message: 'Items fetched', data, meta: { page: pageNum, limit: limitNum, total } });
  } catch { sendError(res, 'Failed to fetch items'); }
};

export const getItemById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await Item.findById(req.params.id).populate('createdBy', 'name email');
    if (!item) { sendError(res, 'Item not found', 404); return; }
    sendSuccess(res, 'Item fetched', item);
  } catch { sendError(res, 'Failed to fetch item'); }
};

export const updateItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) { sendError(res, 'Item not found', 404); return; }
    sendSuccess(res, 'Item updated', item);
  } catch { sendError(res, 'Failed to update item'); }
};

export const deleteItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) { sendError(res, 'Item not found', 404); return; }
    sendSuccess(res, 'Item deleted');
  } catch { sendError(res, 'Failed to delete item'); }
};
