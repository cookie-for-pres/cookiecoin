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
const Coin_1 = __importDefault(require("../models/Coin"));
const BoughtCoin_1 = __importDefault(require("../models/BoughtCoin"));
const Account_1 = __importDefault(require("../models/Account"));
const uuid_1 = require("uuid");
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const check1 = yield Account_1.default.findOne({ username });
    const check2 = yield Account_1.default.findOne({ email });
    if (username && email && password) {
        if (!check1 && !check2) {
            const accountId = (0, uuid_1.v4)();
            const boughtCoinId = (0, uuid_1.v4)();
            const account = new Account_1.default({
                _id: accountId,
                username,
                email,
                password,
                coins: [boughtCoinId]
            });
            const dogecoin = yield Coin_1.default.findOne({ '_id': process.env.DOGE_ID });
            const boughtCoin = new BoughtCoin_1.default({
                _id: boughtCoinId,
                name: dogecoin.name,
                abbreviation: dogecoin.abbreviation,
                amount: 5,
                owner: accountId
            });
            yield account.save((err1) => __awaiter(void 0, void 0, void 0, function* () {
                if (!err1) {
                    yield boughtCoin.save((err2) => {
                        if (!err2) {
                            res.json({
                                message: 'successfully registered account',
                                success: true
                            });
                        }
                        else {
                            res.status(500).json({
                                message: 'unknown error',
                                success: false,
                                error: err2.message
                            });
                        }
                    });
                }
                else {
                    res.status(500).json({
                        message: 'unknown error',
                        success: false,
                        error: err1.message
                    });
                }
            }));
        }
        else {
            res.status(409).json({
                message: 'username or email is already taken',
                success: false
            });
        }
    }
    else {
        res.status(409).json({
            message: 'username, email, and password are required fields',
            success: false
        });
    }
});
