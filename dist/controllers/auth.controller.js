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
exports.getMe = exports.refreshToken = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const response_1 = require("../utils/response");
const generateTokens = (id, role) => {
    const accessToken = jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const refreshToken = jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        const existing = yield user_model_1.default.findOne({ email });
        if (existing) {
            (0, response_1.sendError)(res, 'Email already registered', 400);
            return;
        }
        const user = yield user_model_1.default.create({ name, email, password, role: role === 'ADMIN' ? 'ADMIN' : 'USER' });
        const tokens = generateTokens(user._id.toString(), user.role);
        (0, response_1.sendSuccess)(res, 'Registration successful', Object.assign({ user: { id: user._id, name: user.name, email: user.email, role: user.role } }, tokens), 201);
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Registration failed');
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({ email });
        if (!user || !(yield user.comparePassword(password))) {
            (0, response_1.sendError)(res, 'Invalid email or password', 401);
            return;
        }
        const tokens = generateTokens(user._id.toString(), user.role);
        (0, response_1.sendSuccess)(res, 'Login successful', Object.assign({ user: { id: user._id, name: user.name, email: user.email, role: user.role } }, tokens));
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Login failed');
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken: token } = req.body;
        if (!token) {
            (0, response_1.sendError)(res, 'Refresh token required', 400);
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const tokens = generateTokens(decoded.id, decoded.role);
        (0, response_1.sendSuccess)(res, 'Token refreshed', tokens);
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Invalid refresh token', 401);
    }
});
exports.refreshToken = refreshToken;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_model_1.default.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id).select('-password');
        if (!user) {
            (0, response_1.sendError)(res, 'User not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, 'Profile fetched', user);
    }
    catch (_b) {
        (0, response_1.sendError)(res, 'Failed to fetch profile');
    }
});
exports.getMe = getMe;
