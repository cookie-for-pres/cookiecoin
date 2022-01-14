import Account from '../models/Account';
import BoughtCoin from '../models/BoughtCoin';
import Friend from '../models/Friend';
import Coin from '../models/Coin';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const account = await Account.findOne({ _id: accountId });

  if (account) {
    const boughtCoins = await BoughtCoin.find({ owner: account._id, amount: { '$gt': 0 } })
      .limit(3)
      .sort({ amount: -1 });
  
    const coins = await Coin.find({});
    const friends1 = await Friend.find({ owner: account._id });
    const friends2 = await Friend.find({ friend: account._id });

    let newBoughtCoins: any[] = [];
    let newCoins: any[] = [];

    boughtCoins.forEach((boughtCoin: any) => {
      const coin1 = {
        _id: boughtCoin._id,
        name: boughtCoin.name,
        abbreviation: boughtCoin.abbreviation,
        amount: boughtCoin.amount
      }

      newBoughtCoins.push(coin1);
    });

    coins.forEach((coin: any) => {
      const coin2 = {
        _id: coin._id,
        name: coin.name,
        abbreviation: coin.abbreviation,
        price: coin.price,
        imageUrl: coin.imageUrl
      }

      newCoins.push(coin2);
    });

    res.json({
      message: 'dashboard data found',
      success: true,
      coins: newCoins,
      account: {
        balances: account.balances,
        friends: [...friends1, ...friends2],
        boughtCoins: newBoughtCoins
      }
    });
  } else {
    res.status(404).json({
      message: 'cant find account',
      success: false
    });
  }
}