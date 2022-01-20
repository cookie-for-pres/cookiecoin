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
const Account_1 = __importDefault(require("../models/Account"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    const accounts = yield Account_1.default.find({});
    let leaderboard = [];
    accounts.forEach((acc) => __awaiter(void 0, void 0, void 0, function* () {
        leaderboard.push({
            username: acc.username,
            balance: acc.balances.cash + acc.balances.bank,
        });
    }));
    leaderboard = leaderboard.sort((a, b) => b.balance - a.balance);
    leaderboard = leaderboard.slice(0, 5);
    res.json({
        message: 'successfully found leaderboard',
        success: true,
        leaderboard
    });
});
