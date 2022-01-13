import Coin from '../models/Coin';
import BoughtCoin from '../models/BoughtCoin';
import config from '../config/config';
import axios from 'axios';

const rndInt = (min: number, max: number) => {
  return parseFloat((Math.random() * (max - min + 1) + min).toFixed(2));
}

export const get = async () => {
  let coins = await Coin.find({});
  coins.map((coin: any) => coin);
  
  let boughtCoins = await BoughtCoin.find({});
  boughtCoins.map((boughtCoin: any) => boughtCoin);

  return {
    coins,
    boughtCoins
  }
}

export const fake = async () => {
  const cec = await Coin.findOne({ abbreviation: 'CEC' });
  const bpm = await Coin.findOne({ abbreviation: 'BPM' });
  const lvc = await Coin.findOne({ abbreviation: 'ŁVC' });
  
  cec.price = cec.price + rndInt(-10, 10);
  bpm.price = bpm.price + rndInt(-10, 10);
  lvc.price = lvc.price + rndInt(-10, 10);

  cec.logs.push({ price: cec.price, date: new Date().toISOString() });
  bpm.logs.push({ price: bpm.price, date: new Date().toISOString() });
  lvc.logs.push({ price: lvc.price, date: new Date().toISOString() });

  await cec.save();
  await bpm.save();
  await lvc.save();
}

export const real = async () => {
  const btc = await Coin.findOne({ abbreviation: 'BTC' });
  const eth = await Coin.findOne({ abbreviation: 'ETH' });
  const doge = await Coin.findOne({ abbreviation: 'DOGE' });

  const url = 'https://coingecko.p.rapidapi.com/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd';
  const headers = { 'x-rapidapi-host': 'coingecko.p.rapidapi.com', 'x-rapidapi-key': 'b94414038cmshb3205d6a0c31a45p12c9bejsn2a77d0ffa6a1' }

  // @ts-ignore
  const { data } = await axios.get(url, { headers });
  const { bitcoin, ethereum, dogecoin } = data;

  btc.price = bitcoin.usd;
  eth.price = ethereum.usd;
  doge.price = dogecoin.usd;

  await btc.save();
  await eth.save();
  await doge.save();
}