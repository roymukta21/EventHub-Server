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
exports.default = handler;
const db_1 = __importDefault(require("../config/db"));
const response_1 = require("../utils/response");
function handler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, db_1.default)();
        if (req.method === 'POST') {
            try {
                const { prompt } = req.body;
                // TODO: Call Google Gemini API with your API Key
                const aiResponse = { text: `AI response for: ${prompt}` };
                return (0, response_1.sendSuccess)(res, 'AI generated successfully', aiResponse);
            }
            catch (err) {
                return (0, response_1.sendError)(res, 'AI service error', 500);
            }
        }
        return (0, response_1.sendError)(res, 'Method not allowed', 405);
    });
}
