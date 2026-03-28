"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeminiModel = void 0;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const getGeminiModel = () => {
    return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
};
exports.getGeminiModel = getGeminiModel;
exports.default = genAI;
