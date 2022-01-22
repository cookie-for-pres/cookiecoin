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
const GameLog_1 = __importDefault(require("../models/GameLog"));
const uuid_1 = require("uuid");
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, bet, account: accountBalance, status } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    if (account) {
        if (account.balances[accountBalance] >= bet) {
            const gameLog = new GameLog_1.default({
                _id: (0, uuid_1.v4)(),
                playerId: account._id,
                game: 'blackjack',
                status,
                data: {
                    bet,
                    account: accountBalance
                }
            });
            yield gameLog.save();
            if (status === 'won') {
                account.balances[accountBalance] += bet;
            }
            else if (status === 'lose') {
                account.balances[accountBalance] -= bet;
            }
            yield account.save();
            res.json({
                message: 'successfully played blackjack',
                success: true,
                balances: account.balances
            });
        }
        else {
            res.status(400).send({
                message: 'insufficient funds',
                success: false
            });
        }
    }
    else {
        res.status(404).json({
            message: 'cant find account',
            success: false
        });
    }
});
