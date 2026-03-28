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
exports.deleteBooking = exports.updateBooking = exports.getBookings = exports.createBooking = void 0;
const booking_model_1 = __importDefault(require("../models/booking.model"));
const response_1 = require("../utils/response");
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const booking = yield booking_model_1.default.create(Object.assign(Object.assign({}, req.body), { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }));
        (0, response_1.sendSuccess)(res, 'Booking created', booking, 201);
    }
    catch (_b) {
        (0, response_1.sendError)(res, 'Failed to create booking');
    }
});
exports.createBooking = createBooking;
const getBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const filter = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'ADMIN' ? {} : { userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id };
        const bookings = yield booking_model_1.default.find(filter).populate('userId', 'name email').populate('itemId', 'title price image').sort({ createdAt: -1 });
        (0, response_1.sendSuccess)(res, 'Bookings fetched', bookings);
    }
    catch (_c) {
        (0, response_1.sendError)(res, 'Failed to fetch bookings');
    }
});
exports.getBookings = getBookings;
const updateBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield booking_model_1.default.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!booking) {
            (0, response_1.sendError)(res, 'Booking not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, 'Booking updated', booking);
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Failed to update booking');
    }
});
exports.updateBooking = updateBooking;
const deleteBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const booking = yield booking_model_1.default.findByIdAndDelete(req.params.id);
        if (!booking) {
            (0, response_1.sendError)(res, 'Booking not found', 404);
            return;
        }
        (0, response_1.sendSuccess)(res, 'Booking deleted', booking);
    }
    catch (_a) {
        (0, response_1.sendError)(res, 'Failed to delete booking');
    }
});
exports.deleteBooking = deleteBooking;
