import { VercelRequest, VercelResponse } from '@vercel/node';
import connectDB from '../config/db';
import Item from '../models/item.model';
import { authenticate } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/response';

const handler = async (req: VercelRequest & { user?: any }, res: VercelResponse) => {
  await connectDB();

  if (req.method === 'GET') {
    const { search, category, priceMin, priceMax, rating, sort, page = 1, limit = 10 } = req.query as any;

    const query: any = {};
    if (search) query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } }
    ];
    if (category) query.category = category;
    if (priceMin || priceMax) query.price = { ...(priceMin && { $gte: Number(priceMin) }), ...(priceMax && { $lte: Number(priceMax) }) };
    if (rating) query.rating = { $gte: Number(rating) };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Item.countDocuments(query);
    const items = await Item.find(query).sort(sort ? { [sort.replace('-', '')]: sort.startsWith('-') ? -1 : 1 } : {}).skip(skip).limit(Number(limit));

    return sendSuccess(res, 'Items fetched', { data: items, meta: { page: Number(page), limit: Number(limit), total } });
  }

  return sendError(res, 'Method not allowed', 405);
};

// @ts-ignore
export default authenticate(handler);