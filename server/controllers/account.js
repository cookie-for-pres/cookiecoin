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
exports.balances = void 0;
const Account_1 = __importDefault(require("../models/Account"));
const balances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    if (account) {
        res.json({
            message: 'successfully found balances',
            success: true,
            balances: account.balances
        });
    }
    else {
        res.status(404).json({
            message: 'cant find account',
            success: false
        });
    }
});
exports.balances = balances;
