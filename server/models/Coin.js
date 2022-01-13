"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const coinSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    abbreviation: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true },
    logs: []
}, { timestamps: true, versionKey: false });
exports.default = mongoose_1.default.model('coins', coinSchema);
