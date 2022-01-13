"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const transactionSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    slug: { type: String, required: true },
    type: { type: String, required: true },
    data: { type: Object, required: true }
}, { timestamps: true, versionKey: false });
exports.default = mongoose_1.default.model('transactions', transactionSchema);
