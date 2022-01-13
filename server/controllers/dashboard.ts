import Account from '../models/Account';
import BoughtCoin from '../models/BoughtCoin';
import Friend from '../models/Friend';
import Coin from '../models/Coin';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const account = await Account.findOne({ _id: accountId });

  if (account) {
    const boughtCoins = await BoughtCoin.find({ owner: account._id }).limit(3);
    const coins = await Coin.find({});
    const friends1 = await Friend.find({ owner: account._id });
    const friends2 = await Friend.find({ friend: account._id });

    res.json({
      message: 'dashboard data found',
      success: true,
      coins,
      account: {
        balances: account.balances,
        friends: [...friends1, ...friends2],
        boughtCoins
      }
    });
  } else {
    res.status(404).json({
      message: 'cant find account',
      success: false
    });
  }
}