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
const db_1 = __importDefault(require("../config/db"));
const item_model_1 = __importDefault(require("../models/item.model"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const response_1 = require("../utils/response");
const handler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    if (req.method === 'GET') {
        const { search, category, priceMin, priceMax, rating, sort, page = 1, limit = 10 } = req.query;
        const query = {};
        if (search)
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        if (category)
            query.category = category;
        if (priceMin || priceMax)
            query.price = Object.assign(Object.assign({}, (priceMin && { $gte: Number(priceMin) })), (priceMax && { $lte: Number(priceMax) }));
        if (rating)
            query.rating = { $gte: Number(rating) };
        const skip = (Number(page) - 1) * Number(limit);
        const total = yield item_model_1.default.countDocuments(query);
        const items = yield item_model_1.default.find(query).sort(sort ? { [sort.replace('-', '')]: sort.startsWith('-') ? -1 : 1 } : {}).skip(skip).limit(Number(limit));
        return (0, response_1.sendSuccess)(res, 'Items fetched', { data: items, meta: { page: Number(page), limit: Number(limit), total } });
    }
    return (0, response_1.sendError)(res, 'Method not allowed', 405);
});
// @ts-ignore
exports.default = (0, auth_middleware_1.authenticate)(handler);
