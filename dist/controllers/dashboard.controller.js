"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChartData = exports.getStats = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const item_model_1 = __importDefault(require("../models/item.model"));
const booking_model_1 = __importDefault(require("../models/booking.model"));
const response_1 = require("../utils/response");
const getStats = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [totalUsers, totalItems, agg] = yield Promise.all([
            user_model_1.default.countDocuments(),
            item_model_1.default.countDocuments(),
            booking_model_1.default.aggregate([{ $group: { _id: null, totalOrders: { $sum: 1 }, totalRevenue: { $sum: { $multiply: ['$price', '$quantity'] } } } }]),
        ]);
        const { totalOrders = 0, totalRevenue = 0 } = agg[0] || {};
        (0, response_1.sendSuccess)(res, 'Stats fetched', { totalUsers, totalItems, totalOrders, totalRevenue });
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Failed to fetch stats');
    }
});
exports.getStats = getStats;
const getChartData = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const [monthly, statusAgg] = yield Promise.all([
            booking_model_1.default.aggregate([
                { $match: { createdAt: { $gte: sixMonthsAgo } } },
                { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, bookings: { $sum: 1 }, revenue: { $sum: { $multiply: ['$price', '$quantity'] } } } },
                { $sort: { '_id.year': 1, '_id.month': 1 } },
            ]),
            booking_model_1.default.aggregate([{ $group: { _id: '$status', value: { $sum: 1 } } }]),
        ]);
        const barLineData = monthly.map((d) => ({ month: months[d._id.month - 1], bookings: d.bookings, revenue: d.revenue }));
        const pieData = statusAgg.map((d) => ({ name: d._id, value: d.value }));
        (0, response_1.sendSuccess)(res, 'Chart data fetched', { barLineData, pieData });
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Failed to fetch chart data');
    }
});
exports.getChartData = getChartData;
