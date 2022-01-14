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
exports.real = exports.fake = exports.get = void 0;
const Coin_1 = __importDefault(require("../models/Coin"));
const BoughtCoin_1 = __importDefault(require("../models/BoughtCoin"));
const axios_1 = __importDefault(require("axios"));
const rndInt = (min, max) => {
    return parseFloat((Math.random() * (max - min + 1) + min).toFixed(2));
};
const get = () => __awaiter(void 0, void 0, void 0, function* () {
    let coins = yield Coin_1.default.find({});
    coins.map((coin) => coin);
    let boughtCoins = yield BoughtCoin_1.default.find({});
    boughtCoins.map((boughtCoin) => boughtCoin);
    return {
        coins,
        boughtCoins
    };
});
exports.get = get;
const fake = () => __awaiter(void 0, void 0, void 0, function* () {
    const cec = yield Coin_1.default.findOne({ abbreviation: 'CEC' });
    const bpm = yield Coin_1.default.findOne({ abbreviation: 'BPM' });
    const lvc = yield Coin_1.default.findOne({ abbreviation: 'ŁVC' });
    const s4y = yield Coin_1.default.findOne({ abbreviation: 'S4Y' });
    cec.price = cec.price + rndInt(-10, 10);
    bpm.price = bpm.price + rndInt(-10, 10);
    lvc.price = lvc.price + rndInt(-10, 10);
    s4y.price = s4y.price + rndInt(-10, 10);
    cec.logs.push({ price: cec.price, date: new Date().toISOString() });
    bpm.logs.push({ price: bpm.price, date: new Date().toISOString() });
    lvc.logs.push({ price: lvc.price, date: new Date().toISOString() });
    s4y.logs.push({ price: s4y.price, date: new Date().toISOString() });
    yield cec.save();
    yield bpm.save();
    yield lvc.save();
    yield s4y.save();
});
exports.fake = fake;
const real = () => __awaiter(void 0, void 0, void 0, function* () {
    const btc = yield Coin_1.default.findOne({ abbreviation: 'BTC' });
    const eth = yield Coin_1.default.findOne({ abbreviation: 'ETH' });
    const doge = yield Coin_1.default.findOne({ abbreviation: 'DOGE' });
    const url = 'https://coingecko.p.rapidapi.com/simple/price';
    const params = { 'ids': 'bitcoin,ethereum,dogecoin', 'vs_currencies': 'usd' };
    const headers = { 'x-rapidapi-host': 'coingecko.p.rapidapi.com', 'x-rapidapi-key': 'b94414038cmshb3205d6a0c31a45p12c9bejsn2a77d0ffa6a1' };
    // @ts-ignore
    const { data } = yield axios_1.default.get(url, { params, headers });
    const { bitcoin, ethereum, dogecoin } = data;
    btc.price = bitcoin.usd;
    eth.price = ethereum.usd;
    doge.price = dogecoin.usd;
    btc.logs.push({ price: btc.price, date: new Date().toISOString() });
    eth.logs.push({ price: eth.price, date: new Date().toISOString() });
    doge.logs.push({ price: doge.price, date: new Date().toISOString() });
    yield btc.save();
    yield eth.save();
    yield doge.save();
});
exports.real = real;
