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
    const coins = yield Coin_1.default.find({});
    coins.map((coin) => coin);
    const boughtCoins = yield BoughtCoin_1.default.find({});
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
    const s4y = yield Coin_1.default.findOne({ abbreviation: '420' });
    const boof = yield Coin_1.default.findOne({ abbreviation: 'BOOF' });
    const shr = yield Coin_1.default.findOne({ abbreviation: 'SHR' });
    cec.price = cec.price + rndInt(-15, 10);
    bpm.price = bpm.price + rndInt(-15, 10);
    lvc.price = lvc.price + rndInt(-15, 10);
    s4y.price = s4y.price + rndInt(-15, 10);
    boof.price = boof.price + rndInt(-15, 10);
    shr.price = shr.price + rndInt(-15, 10);
    if (cec.logs.length > 50) {
        cec.logs = [];
    }
    if (bpm.logs.length > 50) {
        bpm.logs = [];
    }
    if (lvc.logs.length > 50) {
        lvc.logs = [];
    }
    if (s4y.logs.length > 50) {
        s4y.logs = [];
    }
    if (boof.logs.length > 50) {
        boof.logs = [];
    }
    if (shr.logs.length > 50) {
        shr.logs = [];
    }
    cec.logs.push({ price: cec.price, date: new Date().toISOString() });
    bpm.logs.push({ price: bpm.price, date: new Date().toISOString() });
    lvc.logs.push({ price: lvc.price, date: new Date().toISOString() });
    s4y.logs.push({ price: s4y.price, date: new Date().toISOString() });
    boof.logs.push({ price: boof.price, date: new Date().toISOString() });
    shr.logs.push({ price: shr.price, date: new Date().toISOString() });
    yield cec.save();
    yield bpm.save();
    yield lvc.save();
    yield s4y.save();
    yield boof.save();
    yield shr.save();
});
exports.fake = fake;
const real = () => __awaiter(void 0, void 0, void 0, function* () {
    const btc = yield Coin_1.default.findOne({ abbreviation: 'BTC' });
    const eth = yield Coin_1.default.findOne({ abbreviation: 'ETH' });
    const ltc = yield Coin_1.default.findOne({ abbreviation: 'LTC' });
    const url = 'https://coingecko.p.rapidapi.com/simple/price';
    const params = { 'ids': 'bitcoin,ethereum,litecoin', 'vs_currencies': 'usd' };
    const headers = { 'x-rapidapi-host': 'coingecko.p.rapidapi.com', 'x-rapidapi-key': 'b94414038cmshb3205d6a0c31a45p12c9bejsn2a77d0ffa6a1' };
    // @ts-ignore
    const { data } = yield axios_1.default.get(url, { params, headers });
    const { bitcoin, ethereum, litecoin } = data;
    btc.price = bitcoin.usd;
    eth.price = ethereum.usd;
    ltc.price = litecoin.usd;
    if (btc.logs.length > 50) {
        btc.logs = [];
    }
    if (eth.logs.length > 50) {
        eth.logs = [];
    }
    if (ltc.logs.length > 50) {
        ltc.logs = [];
    }
    btc.logs.push({ price: btc.price, date: new Date().toISOString() });
    eth.logs.push({ price: eth.price, date: new Date().toISOString() });
    ltc.logs.push({ price: ltc.price, date: new Date().toISOString() });
    yield btc.save();
    yield eth.save();
    yield ltc.save();
});
exports.real = real;
