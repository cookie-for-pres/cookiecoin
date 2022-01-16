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
    console.log(req.body);
    if (account) {
        if (type === 'balance-to-balance') {
            const balances = account.balances;
            const { to, from, amount } = data;
            if (amount <= 0) {
                return res.status(400).json({
                    message: 'amount must be greater than 0',
                    success: false
                });
            }
            if (balances[from] >= amount) {
                const newFromBalance = balances[from] - amount;
                const newToBalance = balances[to] + amount;
                const newBalances = {
                    [to]: newToBalance,
                    [from]: newFromBalance
                };
                yield Account_1.default.findOneAndUpdate({ _id: account._id }, { balances: newBalances });
                res.json({
                    message: 'successfully transferred',
                    success: true,
                    account: {
                        balances: newBalances,
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
            const { from, to, amount } = data;
            const toAccount = yield Account_1.default.findOne({ username: to });
            if (toAccount) {
                if (account.balances.bank >= amount) {
                    const newBalance = account.balances[from] - amount;
                    const newToBalance = toAccount.balances.bank + amount;
                    const newBalances = Object.assign(Object.assign({}, account.balances), { [from]: newBalance });
                    yield Account_1.default.findOneAndUpdate({ _id: account._id }, { 'balances': newBalances });
                    yield Account_1.default.findOneAndUpdate({ _id: toAccount._id }, { 'balances.bank': newToBalance });
                    res.json({
                        message: 'successfully transferred',
                        success: true,
                        account: {
                            balances: Object.assign({}, account.balances)
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
                res.json({
                    message: 'cant find to account',
                    success: false
                });
            }
        }
        else if (type === 'user:coin-to-user:coin') {
            const { from, to, amount } = data;
            const fromBoughtCoin = yield BoughtCoin_1.default.findOne({ owner: accountId, name: from });
            const toBoughtCoin = yield BoughtCoin_1.default.findOne({ wallet: to });
            if (fromBoughtCoin) {
                if (toBoughtCoin) {
                    const fromCoin = yield Coin_1.default.findOne({ name: fromBoughtCoin.name });
                    const toCoin = yield Coin_1.default.findOne({ name: toBoughtCoin.name });
                    if (fromCoin) {
                        if (toCoin) {
                            if (fromBoughtCoin.amount >= amount) {
                                const fromDiff = amount / fromCoin.price;
                                const toDiff = amount / toCoin.price;
                                const newFromAmount = fromBoughtCoin.amount - fromDiff;
                                const newToAmount = toBoughtCoin.amount + toDiff;
                                yield BoughtCoin_1.default.findOneAndUpdate({ _id: fromBoughtCoin._id }, { amount: newFromAmount });
                                yield BoughtCoin_1.default.findOneAndUpdate({ _id: toBoughtCoin._id }, { amount: newToAmount });
                                res.json({
                                    message: 'successfully transferred',
                                    success: true,
                                    account: {
                                        balances: account.balances,
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
                                message: 'cant find to coin',
                                success: false
                            });
                        }
                    }
                    else {
                        res.status(404).json({
                            message: 'cant find from coin',
                            success: false
                        });
                    }
                }
                else {
                    res.status(404).json({
                        message: 'cant find to bought coin',
                        success: false
                    });
                }
            }
            else {
                res.status(404).json({
                    message: 'cant find from bought coin',
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
