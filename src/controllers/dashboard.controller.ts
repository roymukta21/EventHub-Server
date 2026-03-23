import { Response } from 'express';
import User from '../models/user.model';
import Item from '../models/item.model';
import Booking from '../models/booking.model';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

export const getStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalUsers, totalItems, agg] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Booking.aggregate([{ $group: { _id: null, totalOrders: { $sum: 1 }, totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } } } }]),
    ]);
    const { totalOrders = 0, totalRevenue = 0 } = agg[0] || {};
    sendSuccess(res, 'Stats fetched', { totalUsers, totalItems, totalOrders, totalRevenue });
  } catch { sendError(res, 'Failed to fetch stats'); }
};

export const getChartData = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const [monthly, statusAgg] = await Promise.all([
      Booking.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, bookings: { $sum: 1 }, revenue: { $sum: { $multiply: ['$price', '$quantity'] } } } },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      Booking.aggregate([{ $group: { _id: '$status', value: { $sum: 1 } } }]),
    ]);
    const barLineData = monthly.map((d) => ({ month: months[d._id.month - 1], bookings: d.bookings, revenue: d.revenue }));
    const pieData = statusAgg.map((d) => ({ name: d._id, value: d.value }));
    sendSuccess(res, 'Chart data fetched', { barLineData, pieData });
  } catch { sendError(res, 'Failed to fetch chart data'); }
};
