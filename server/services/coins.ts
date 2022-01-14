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
  const s4y = await Coin.findOne({ abbreviation: '420' });
  const boof = await Coin.findOne({ abbreviation: 'BOOF' });
  const shr = await Coin.findOne({ abbreviation: 'SHR' });
  
  cec.price = cec.price + rndInt(-10, 10);
  bpm.price = bpm.price + rndInt(-10, 10);
  lvc.price = lvc.price + rndInt(-10, 10);
  s4y.price = s4y.price + rndInt(-10, 10);
  boof.price = boof.price + rndInt(-10, 10);
  shr.price = shr.price + rndInt(-10, 10);

  if (cec.logs.length > 150) { cec.logs = []; }
  if (bpm.logs.length > 150) { bpm.logs = []; }
  if (lvc.logs.length > 150) { lvc.logs = []; }
  if (s4y.logs.length > 150) { s4y.logs = []; }
  if (boof.logs.length > 150) { boof.logs = []; }
  if (shr.logs.length > 150) { shr.logs = []; }
  
  cec.logs.push({ price: cec.price, date: new Date().toISOString() });
  bpm.logs.push({ price: bpm.price, date: new Date().toISOString() });
  lvc.logs.push({ price: lvc.price, date: new Date().toISOString() });
  s4y.logs.push({ price: s4y.price, date: new Date().toISOString() });
  boof.logs.push({ price: boof.price, date: new Date().toISOString() });
  shr.logs.push({ price: shr.price, date: new Date().toISOString() });

  await cec.save();
  await bpm.save();
  await lvc.save();
  await boof.save();
  await shr.save();
}

export const real = async () => {
  const btc = await Coin.findOne({ abbreviation: 'BTC' });
  const eth = await Coin.findOne({ abbreviation: 'ETH' });
  const ltc = await Coin.findOne({ abbreviation: 'LTC' });

  const url = 'https://coingecko.p.rapidapi.com/simple/price';
  const params = { 'ids': 'bitcoin,ethereum,litecoin', 'vs_currencies': 'usd' }
  const headers = { 'x-rapidapi-host': 'coingecko.p.rapidapi.com', 'x-rapidapi-key': 'b94414038cmshb3205d6a0c31a45p12c9bejsn2a77d0ffa6a1' }

  // @ts-ignore
  const { data } = await axios.get(url, { params, headers });
  const { bitcoin, ethereum, litecoin } = data;

  btc.price = bitcoin.usd;
  eth.price = ethereum.usd;
  ltc.price = litecoin.usd;

  if (btc.logs.length > 150) { btc.logs = []; }
  if (eth.logs.length > 150) { eth.logs = []; }
  if (ltc.logs.length > 150) { ltc.logs = []; }

  btc.logs.push({ price: btc.price, date: new Date().toISOString() });
  eth.logs.push({ price: eth.price, date: new Date().toISOString() });
  ltc.logs.push({ price: ltc.price, date: new Date().toISOString() });

  await btc.save();
  await eth.save();
  await ltc.save();
}