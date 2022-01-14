"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const boughtCoinSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    abbreviation: { type: String, required: true },
    owner: { type: String, required: true },
    amount: { type: Number, required: true },
    wallet: { type: String, required: true }
}, { timestamps: true, versionKey: false });
exports.default = mongoose_1.default.model('bought-coins', boughtCoinSchema);
