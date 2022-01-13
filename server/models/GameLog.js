"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const gameLogSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    playerId: { type: String, required: true },
    game: { type: String, required: true },
    status: { type: String, default: 'playing' },
    data: {}
}, { timestamps: true, versionKey: false });
exports.default = mongoose_1.default.model('game-logs', gameLogSchema);
