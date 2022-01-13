"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const accountSchema = new mongoose_1.default.Schema({
    _id: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, default: 'member' },
    banned: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    coins: [],
    cases: [],
    friends: [],
    blocked: [],
    transactions: [],
    balances: {
        cash: { type: Number, default: 100.00 },
        bank: { type: Number, default: 100.00 },
        interest: { type: Number, default: 1.00 }
    }
}, { timestamps: true, versionKey: false });
accountSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = bcryptjs_1.default.hashSync(this.password, 12);
    next();
});
accountSchema.methods.comparePassword = function (plaintext, callback) {
    return callback(null, bcryptjs_1.default.compareSync(plaintext, this.password));
};
exports.default = mongoose_1.default.model('accounts', accountSchema);
