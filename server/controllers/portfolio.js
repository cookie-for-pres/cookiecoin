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
exports.transfer = exports.portfolio = void 0;
const Account_1 = __importDefault(require("../models/Account"));
const BoughtCoin_1 = __importDefault(require("../models/BoughtCoin"));
const Coin_1 = __importDefault(require("../models/Coin"));
const portfolio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    const boughtCoins = yield BoughtCoin_1.default.find({ owner: accountId });
    const coins = yield Coin_1.default.find({});
    if (account) {
        const portfolio = boughtCoins.map((boughtCoin) => {
            const coin = coins.find((coin) => coin.name === boughtCoin.name);
            return {
                _id: coin._id,
                name: coin.name,
                abbreviation: coin.abbreviation,
                price: coin.price,
                amount: boughtCoin.amount,
                total: boughtCoin.amount * coin.price,
                wallet: boughtCoin.wallet,
                imageUrl: coin.imageUrl
            };
        });
        res.json({
            message: 'successfully found portfolio',
            success: true,
            portfolio,
            account: {
                balances: account.balances,
            }
        });
    }
    else {
        res.status(404).json({
            message: 'cant find account'
        });
    }
});
exports.portfolio = portfolio;
const transfer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { accountId, type, data } = req.body;
    const account = yield Account_1.default.findOne({ _id: accountId });
    if (account) {
        if (type === 'coin-to-coin') {
            const { to, from, amount } = data;
            const to_bought_coin = yield BoughtCoin_1.default.findOne({ name: to });
            const from_bought_coin = yield BoughtCoin_1.default.findOne({ name: from });
            const to_coin = yield Coin_1.default.findOne({ name: to });
            const from_coin = yield Coin_1.default.findOne({ name: from });
            if (to_coin && from_coin) {
                if (to_bought_coin && from_bought_coin) {
                    if (to_bought_coin.amount >= amount) {
                        const to_new_amount = to_bought_coin.amount - amount;
                        const from_new_amount = from_bought_coin.amount + amount;
                        yield BoughtCoin_1.default.findOneAndUpdate({ name: to }, { amount: to_new_amount });
                        yield BoughtCoin_1.default.findOneAndUpdate({ name: from }, { amount: from_new_amount });
                        res.json({
                            message: 'successfully transferred',
                            success: true,
                            account: {
                                balances: account.balances,
                            }
                        });
                    }
                    else {
                        res.status(404).json({
                            message: 'not enough coins',
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
        else if (type === 'balance-to-balance') {
            const balances = account.balances;
            const { to, from, amount } = data;
            if (balances[to] >= amount) {
                const new_to_balance = balances[to] - amount;
                const new_from_balance = balances[from] + amount;
                const new_balances = Object.assign(Object.assign({}, balances), { [to]: new_to_balance, [from]: new_from_balance });
                yield Account_1.default.findOneAndUpdate({ _id: accountId }, { balances: new_balances });
                res.json({
                    message: 'successfully transferred',
                    success: true,
                    account: {
                        balances: new_balances,
                    }
                });
            }
            else {
                res.status(400).json({
                    message: 'insufficient funds',
                    success: false
                });
            }
        }
        else if (type === 'user:account-to-user:account') {
            const { to, amount } = data;
            const to_account = yield Account_1.default.findOne({ username: to });
            if (account.balances.bank >= amount) {
                const new_balance = account.balances.bank - amount;
                const new_to_balance = to_account.balances.bank + amount;
                yield Account_1.default.findOneAndUpdate({ _id: accountId }, { 'balances.bank': new_balance });
                yield Account_1.default.findOneAndUpdate({ _id: to_account._id }, { 'balances.bank': new_to_balance });
                res.json({
                    message: 'successfully transferred',
                    success: true,
                    account: {
                        balances: {
                            bank: new_balance,
                        }
                    }
                });
            }
            else {
                res.status(400).json({
                    message: 'insufficient funds',
                    success: false
                });
            }
        }
        else {
            res.status(404).json({
                message: 'cant find type',
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
exports.transfer = transfer;
// export const giveAllBoughtCoinAWallet = async (req: Request, res: Response) => {
//   const boughtCoins = await BoughtCoin.find({});
//   boughtCoins.forEach(async (boughtCoin) => {
//     const wallet = Wallet.generate();
//     const address = wallet.getAddressString();
//     await BoughtCoin.findOneAndUpdate({ _id: boughtCoin._id }, { '$set': { wallet: address } }, {multi:true}, );
//   });
//   res.json({
//     message: 'successfully gave all bought coins a wallet',
//     success: true,
//   });
// }
