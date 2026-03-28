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
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewSummary = exports.generateDescription = exports.chat = void 0;
const gemini_1 = require("../config/gemini");
const response_1 = require("../utils/response");
const chat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        if (!message) {
            (0, response_1.sendError)(res, 'Message is required', 400);
            return;
        }
        const model = (0, gemini_1.getGeminiModel)();
        const result = yield model.generateContent(`You are a helpful assistant for EventHub platform. Help users with events, travel, food, and recommendations.\n\nUser: ${message}`);
        (0, response_1.sendSuccess)(res, 'AI response', { reply: result.response.text() });
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'AI chat failed');
    }
});
exports.chat = chat;
const generateDescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, category } = req.body;
        if (!title) {
            (0, response_1.sendError)(res, 'Title is required', 400);
            return;
        }
        const model = (0, gemini_1.getGeminiModel)();
        const result = yield model.generateContent(`Write a compelling 2-3 sentence description for a listing titled "${title}"${category ? ` in the ${category} category` : ''}. Make it engaging and informative.`);
        (0, response_1.sendSuccess)(res, 'Description generated', { description: result.response.text() });
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Description generation failed');
    }
});
exports.generateDescription = generateDescription;
const reviewSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reviews } = req.body;
        if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
            (0, response_1.sendError)(res, 'Reviews array is required', 400);
            return;
        }
        const text = reviews.map((r) => `Rating: ${r.rating}/5 - ${r.comment}`).join('\n');
        const model = (0, gemini_1.getGeminiModel)();
        const result = yield model.generateContent(`Summarize the following user reviews into 2-3 sentences highlighting key positives and negatives:\n\n${text}`);
        (0, response_1.sendSuccess)(res, 'Summary generated', { summary: result.response.text() });
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Review summary failed');
    }
});
exports.reviewSummary = reviewSummary;
