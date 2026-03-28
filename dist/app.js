"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const item_routes_1 = __importDefault(require("./routes/item.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/items', item_routes_1.default);
app.use('/api/reviews', review_routes_1.default);
app.use('/api/bookings', booking_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/ai', ai_routes_1.default);
app.get('/', (_req, res) => {
    res.send('EventHub Server is running 🚀');
});
app.get('/health', (_req, res) => {
    res.json({ success: true, message: 'Server is healthy ✅' });
});
exports.default = app;
