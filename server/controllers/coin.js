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
exports.create = exports.sell = exports.buy = exports.find = exports.coins = void 0;
const uuid_1 = require("uuid");
const Coin_1 = __importDefault(require("../models/Coin"));
const Account_1 = __importDefault(require("../models/Account"));
const BoughtCoin_1 = __importDefault(require("../models/BoughtCoin"));
const ethereumjs_wallet_1 = __importDefault(require("ethereumjs-wallet"));
const roundToHundredth = (value) => {
    return Number(value.toFixed(2));
};
const coins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    const coins = yield Coin_1.default.find({});
    if (account) {
        res.json({
            message: 'successfully found coins',
            success: true,
            coins
        });
    }
    else {
        res.status(404).json({
            message: 'cant find account',
            success: false
        });
    }
});
exports.coins = coins;
const find = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, coinId } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    const coin = yield Coin_1.default.findOne({ _id: coinId }, { logs: { $slice: -25 } });
    let boughtCoin = yield BoughtCoin_1.default.findOne({ owner: accountId, name: coin.name });
    if (account) {
        if (coin) {
            if (boughtCoin) {
                res.json({
                    message: 'successfully found coin',
                    success: true,
                    coin,
                    boughtCoin
                });
            }
            else {
                res.json({
                    message: 'successfully found coin',
                    success: true,
                    coin,
                    boughtCoin: {
                        account: accountId,
                        coin: coinId,
                        amount: 0
                    }
                });
            }
        }
        else {
            res.status(404).json({
                message: 'cant find coin',
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
exports.find = find;
const buy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, coinId, amount, balance } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    const coin = yield Coin_1.default.findOne({ _id: coinId });
    if (account) {
        if (coin) {
            const owned = yield BoughtCoin_1.default.findOne({ owner: account._id, abbreviation: coin.abbreviation });
            if (owned) {
                if (balance === 'cash') {
                    if (amount <= 0) {
                        return res.status(400).json({
                            message: 'amount must be greater than 0',
                            success: false
                        });
                    }
                    let dif = (coin.price * amount) - account.balances.cash;
                    if (account.balances.cash >= (coin.price * amount) - (dif > 0 ? dif : 0)) {
                        account.balances.cash = roundToHundredth(account.balances.cash - (coin.price * amount) + (dif > 0 ? dif : 0));
                        owned.amount = owned.amount + amount;
                        yield account.save((err1) => __awaiter(void 0, void 0, void 0, function* () {
                            if (!err1) {
                                yield owned.save((err2) => {
                                    if (!err2) {
                                        res.json({
                                            message: 'successfully bought coin',
                                            success: true
                                        });
                                    }
                                    else {
                                        res.status(500).json({
                                            message: 'unknown error',
                                            success: false,
                                            error: err1
                                        });
                                    }
                                });
                            }
                            else {
                                res.status(500).json({
                                    message: 'unknown error',
                                    success: false,
                                    error: err1
                                });
                            }
                        }));
                    }
                    else {
                        res.status(409).json({
                            message: 'insignificant funds',
                            success: false
                        });
                    }
                }
                else {
                    let dif = (coin.price * amount) - account.balances.bank;
                    if (account.balances.bank >= coin.price * amount - (dif > 0 ? dif : 0)) {
                        account.balances.bank = roundToHundredth(account.balances.bank - (coin.price * amount) + (dif > 0 ? dif : 0));
                        owned.amount = owned.amount + amount;
                        yield account.save((err1) => __awaiter(void 0, void 0, void 0, function* () {
                            console.log(err1);
                            if (!err1) {
                                yield owned.save((err2) => {
                                    if (!err2) {
                                        console.log(err2);
                                        res.json({
                                            message: 'successfully bought coin',
                                            success: true
                                        });
                                    }
                                    else {
                                        res.status(500).json({
                                            message: 'unknown error',
                                            success: false,
                                            error: err1
                                        });
                                    }
                                });
                            }
                            else {
                                res.status(500).json({
                                    message: 'unknown error',
                                    success: false,
                                    error: err1
                                });
                            }
                        }));
                    }
                    else {
                        res.status(409).json({
                            message: 'insignificant funds',
                            success: false
                        });
                    }
                }
            }
            else {
                if (balance === 'cash') {
                    let dif = (coin.price * amount) - account.balances.cash;
                    if (account.balances.cash >= coin.price * amount - (dif > 0 ? dif : 0)) {
                        const boughtCoinId = (0, uuid_1.v4)();
                        account.balances.cash = roundToHundredth(account.balances.cash - (coin.price * amount) + (dif > 0 ? dif : 0));
                        account.coins.push(boughtCoinId);
                        const wallet = ethereumjs_wallet_1.default.generate();
                        const address = wallet.getAddressString();
                        const boughtCoin = new BoughtCoin_1.default({
                            _id: boughtCoinId,
                            name: coin.name,
                            abbreviation: coin.abbreviation,
                            owner: account._id,
                            amount: amount,
                            wallet: address
                        });
                        yield account.save((err1) => __awaiter(void 0, void 0, void 0, function* () {
                            if (!err1) {
                                yield boughtCoin.save((err2) => {
                                    if (!err2) {
                                        res.json({
                                            message: 'successfully bought coin',
                                            success: true
                                        });
                                    }
                                    else {
                                        res.status(500).json({
                                            message: 'unknown error',
                                            success: false,
                                            error: err1
                                        });
                                    }
                                });
                            }
                            else {
                                res.status(500).json({
                                    message: 'unknown error',
                                    success: false,
                                    error: err1
                                });
                            }
                        }));
                    }
                    else {
                        res.status(409).json({
                            message: 'insignificant funds',
                            success: false
                        });
                    }
                }
                else {
                    let dif = (coin.price * amount) - account.balances.bank;
                    if (account.balances.bank >= coin.price * amount - (dif > 0 ? dif : 0)) {
                        const boughtCoinId = (0, uuid_1.v4)();
                        account.balances.bank = roundToHundredth(account.balances.bank - (coin.price * amount) + (dif > 0 ? dif : 0));
                        account.coins.push(boughtCoinId);
                        const wallet = ethereumjs_wallet_1.default.generate();
                        const address = wallet.getAddressString();
                        const boughtCoin = new BoughtCoin_1.default({
                            _id: boughtCoinId,
                            name: coin.name,
                            abbreviation: coin.abbreviation,
                            owner: account._id,
                            amount: amount,
                            wallet: address
                        });
                        yield account.save((err1) => __awaiter(void 0, void 0, void 0, function* () {
                            if (!err1) {
                                yield boughtCoin.save((err2) => {
                                    if (!err2) {
                                        res.json({
                                            message: 'successfully bought coin',
                                            success: true
                                        });
                                    }
                                    else {
                                        res.status(500).json({
                                            message: 'unknown error',
                                            success: false,
                                            error: err1
                                        });
                                    }
                                });
                            }
                            else {
                                res.status(500).json({
                                    message: 'unknown error',
                                    success: false,
                                    error: err1
                                });
                            }
                        }));
                    }
                    else {
                        res.status(409).json({
                            message: 'insignificant funds',
                            success: false
                        });
                    }
                }
            }
        }
        else {
            res.status(404).json({
                message: 'cant find coin',
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
exports.buy = buy;
const sell = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, coinId, amount, balance } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    const coin = yield Coin_1.default.findOne({ _id: coinId });
    const boughtCoin = yield BoughtCoin_1.default.findOne({ owner: account._id, abbreviation: coin.abbreviation });
    if (account) {
        if (coin) {
            if (boughtCoin) {
                if (boughtCoin.amount >= amount) {
                    boughtCoin.amount = boughtCoin.amount - amount;
                    if (balance === 'cash') {
                        account.balances.cash = roundToHundredth(account.balances.cash + (coin.price * amount));
                    }
                    else {
                        account.balances.bank = roundToHundredth(account.balances.bank + (coin.price * amount));
                    }
                    yield boughtCoin.save((err1) => __awaiter(void 0, void 0, void 0, function* () {
                        if (!err1) {
                            yield account.save((err2) => __awaiter(void 0, void 0, void 0, function* () {
                                if (!err2) {
                                    res.json({
                                        message: 'successfully sold coin',
                                        success: true
                                    });
                                }
                                else {
                                    res.status(500).json({
                                        message: 'unknown error',
                                        success: false,
                                        error: err1
                                    });
                                }
                            }));
                        }
                        else {
                            res.status(500).json({
                                message: 'unknown error',
                                success: false,
                                error: err1
                            });
                        }
                    }));
                }
                else {
                    res.status(409).json({
                        message: 'insignificant amount',
                        success: false
                    });
                }
            }
            else {
                res.status(404).json({
                    message: 'cant find bought coin',
                    success: false
                });
            }
        }
        else {
            res.status(404).json({
                message: 'cant find coin',
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
exports.sell = sell;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.create = create;
