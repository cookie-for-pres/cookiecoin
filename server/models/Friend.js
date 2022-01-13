"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const friendsSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    friend: { type: String, required: true },
    owner: { type: String, required: true },
    accepted: { type: Boolean, default: 'requested' }
}, { timestamps: true, versionKey: false });
exports.default = mongoose_1.default.model('friends', friendsSchema);
