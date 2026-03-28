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
exports.deleteReview = exports.getReviewsByItem = exports.createReview = void 0;
const review_model_1 = __importDefault(require("../models/review.model"));
const item_model_1 = __importDefault(require("../models/item.model"));
const response_1 = require("../utils/response");
const updateItemRating = (itemId) => __awaiter(void 0, void 0, void 0, function* () {
    const reviews = yield review_model_1.default.find({ itemId });
    if (!reviews.length)
        return;
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    yield item_model_1.default.findByIdAndUpdate(itemId, { rating: Math.round(avg * 10) / 10 });
});
const createReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { rating, comment, itemId } = req.body;
        const review = yield review_model_1.default.create({ rating, comment, itemId, userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
        yield updateItemRating(itemId);
        (0, response_1.sendSuccess)(res, 'Review created', review, 201);
    }
    catch (_b) {
        (0, response_1.sendError)(res, 'Failed to create review');
    }
});
exports.createReview = createReview;
const getReviewsByItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield review_model_1.default.find({ itemId: req.params.itemId }).populate('userId', 'name avatar');
        (0, response_1.sendSuccess)(res, 'Reviews fetched', reviews);
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Failed to fetch reviews');
    }
});
exports.getReviewsByItem = getReviewsByItem;
const deleteReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const review = yield review_model_1.default.findById(req.params.id);
        if (!review) {
            (0, response_1.sendError)(res, 'Review not found', 404);
            return;
        }
        if (review.userId.toString() !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'ADMIN') {
            (0, response_1.sendError)(res, 'Forbidden', 403);
            return;
        }
        const itemId = review.itemId.toString();
        yield review.deleteOne();
        yield updateItemRating(itemId);
        (0, response_1.sendSuccess)(res, 'Review deleted');
    }
    catch (_c) {
        (0, response_1.sendError)(res, 'Failed to delete review');
    }
});
exports.deleteReview = deleteReview;
