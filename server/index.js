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
const response_time_1 = __importDefault(require("response-time"));
const socket_io_1 = __importDefault(require("socket.io"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
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
const portfolio_1 = __importDefault(require("./routes/portfolio"));
const coins_1 = require("./services/coins");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
let rawOrigins = fs_1.default.readFileSync('origins.json');
let origins = JSON.parse(rawOrigins.toString());
origins = origins.map((origin) => origin.url);
// @ts-ignore
const io = (0, socket_io_1.default)(server, {
    cors: true,
    origin: origins
});
app.use((0, response_time_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
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
app.use(api, portfolio_1.default);
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, coins_1.real)();
}), 5 * 60 * 1000);
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, coins_1.fake)();
}), 2.5 * 60 * 1000);
io.on('connection', (socket) => {
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        socket.emit('coin-update', yield (0, coins_1.get)());
    }), 2.5 * 60 * 1000);
});
server.listen(config_1.default.port, () => {
    console.log(`Listening on http://127.0.0.1:${config_1.default.port}/`);
    // @ts-ignore
    mongoose_1.default.connect(config_1.default.mongoUri, () => {
        console.log('MongoDB connected');
    });
});
