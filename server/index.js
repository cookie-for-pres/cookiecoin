"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_time_1 = __importDefault(require("response-time"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./config/config"));
const shutdown_1 = __importDefault(require("./middleware/shutdown"));
const login_1 = __importDefault(require("./routes/login"));
const register_1 = __importDefault(require("./routes/register"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const auth_1 = __importDefault(require("./routes/auth"));
const friend_1 = __importDefault(require("./routes/friend"));
const game_1 = __importDefault(require("./routes/game"));
const coin_1 = __importDefault(require("./routes/coin"));
const account_1 = __importDefault(require("./routes/account"));
const coinflip_1 = __importDefault(require("./routes/coinflip"));
const app = (0, express_1.default)();
app.use((0, response_time_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: ['http://127.0.0.1:3000', 'http://localhost:3000'], credentials: true }));
app.use(shutdown_1.default);
app.disable('x-powered-by');
const api = '/api';
app.use(api, login_1.default);
app.use(api, register_1.default);
app.use(api, dashboard_1.default);
app.use(api, auth_1.default);
app.use(api, friend_1.default);
app.use(api, game_1.default);
app.use(api, coin_1.default);
app.use(api, account_1.default);
app.use(api, coinflip_1.default);
app.listen(config_1.default.port, () => {
    console.log(`Listening on http://127.0.0.1:${config_1.default.port}/`);
    // @ts-ignore
    mongoose_1.default.connect(config_1.default.mongoUri, () => {
        console.log('MongoDB connected');
    });
});
