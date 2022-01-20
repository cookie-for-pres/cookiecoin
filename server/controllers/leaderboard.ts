import Account from '../models/Account';
import BoughtCoin from '../models/BoughtCoin';
import Coin from '../models/Coin';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const account = await Account.findOne({ _id: accountId });

  const accounts = await Account.find({});
    let leaderboard: any[] = [];

    accounts.forEach(async (acc: any) => {
      leaderboard.push({
        username: acc.username,
        balance: acc.balances.cash + acc.balances.bank,
      });
    });

    leaderboard = leaderboard.sort((a, b) => b.balance - a.balance);
    leaderboard = leaderboard.slice(0, 5);

    res.json({ 
      message: 'successfully found leaderboard',
      success: true,
      leaderboard 
    });
}