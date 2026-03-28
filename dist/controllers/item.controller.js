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
exports.deleteItem = exports.updateItem = exports.getItemById = exports.getItems = exports.createItem = void 0;
const item_model_1 = __importDefault(require("../models/item.model"));
const response_1 = require("../utils/response");
const createItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const item = yield item_model_1.default.create(Object.assign(Object.assign({}, req.body), { createdBy: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }));
        (0, response_1.sendSuccess)(res, 'Item created', item, 201);
    }
    catch (_b) {
        (0, response_1.sendError)(res, 'Failed to create item');
    }
});
exports.createItem = createItem;
const getItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, category, priceMin, priceMax, rating, sort, page = '1', limit = '10' } = req.query;
        const filter = {};
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ];
        }
        if (category)
            filter.category = category;
        if (priceMin || priceMax) {
            const priceFilter = {};
            if (priceMin)
                priceFilter.$gte = Number(priceMin);
            if (priceMax)
                priceFilter.$lte = Number(priceMax);
            filter.price = priceFilter;
        }
        if (rating)
            filter.rating = { $gte: Number(rating) };
        const sortObj = {};
        if (sort) {
            const key = sort.startsWith('-') ? sort.slice(1) : sort;
            sortObj[key] = sort.startsWith('-') ? -1 : 1;
        }
        else {
            sortObj.createdAt = -1;
        }
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const [data, total] = yield Promise.all([
            item_model_1.default.find(filter).sort(sortObj).skip(skip).limit(limitNum).populate('createdBy', 'name email'),
            item_model_1.default.countDocuments(filter),
        ]);
        res.json({ success: true, message: 'Items fetched', data, meta: { page: pageNum, limit: limitNum, total } });
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Failed to fetch items');
    }
});
exports.getItems = getItems;
const getItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield item_model_1.default.findById(req.params.id).populate('createdBy', 'name email');
        if (!item) {
            (0, response_1.sendError)(res, 'Item not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, 'Item fetched', item);
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Failed to fetch item');
    }
});
exports.getItemById = getItemById;
const updateItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield item_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!item) {
            (0, response_1.sendError)(res, 'Item not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, 'Item updated', item);
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Failed to update item');
    }
});
exports.updateItem = updateItem;
const deleteItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield item_model_1.default.findByIdAndDelete(req.params.id);
        if (!item) {
            (0, response_1.sendError)(res, 'Item not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, 'Item deleted');
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Failed to delete item');
    }
});
exports.deleteItem = deleteItem;
