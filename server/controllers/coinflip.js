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
    const { accountId, account: balance, side, bet } = req.body;
    const account = yield Account_1.default.findById(accountId);
    if (account) {
        if ((side !== 'heads' && side !== 'tails') || bet < 0 || !accountId || !account) {
            return res.status(400).send({
                message: 'side, bet, accountId, and account are required fields'
            });
        }
        if (account.balances[balance] >= bet) {
            if (bet > 0) {
                const botChoice = ['heads', 'tails'][Math.floor(Math.random() * 2)];
                if (balance === 'cash') {
                    account.balances.cash = account.balances.cash - bet;
                    yield account.save();
                }
                else {
                    account.balances.bank = account.balances.bank - bet;
                    yield account.save();
                }
                if (side === botChoice) {
                    if (balance === 'cash') {
                        account.balances.cash = account.balances.cash + (bet * 2);
                        yield account.save();
                    }
                    else {
                        account.balances.bank = account.balances.bank + (bet * 2);
                        yield account.save();
                    }
                }
                else {
                    if (balance === 'cash') {
                        account.balances.cash = account.balances.cash - bet;
                        yield account.save();
                    }
                    else {
                        account.balances.bank = account.balances.bank - bet;
                        yield account.save();
                    }
                }
                const gameLog = new GameLog_1.default({
                    _id: (0, uuid_1.v4)(),
                    playerId: accountId,
                    game: 'coinflip',
                    status: botChoice === side ? 'win' : 'lose',
                    data: {
                        bet,
                        side,
                        botChoice,
                    }
                });
                yield gameLog.save((err) => {
                    if (!err) {
                        res.status(200).json({
                            message: 'successfully played coinflip',
                            success: true,
                            data: gameLog,
                            balances: {
                                cash: account.balances.cash,
                                bank: account.balances.bank,
                            },
                        });
                    }
                    else {
                        res.status(500).json({
                            message: 'unknown error',
                            success: false,
                            error: err.message
                        });
                    }
                });
            }
            else {
                res.status(400).json({
                    message: 'Bet must be greater than 0',
                    success: false,
                });
            }
        }
        else {
            res.status(400).json({
                message: 'insufficient funds',
                success: false,
            });
        }
    }
    else {
        res.status(404).json({
            message: 'cant find account',
            success: false,
        });
    }
});
