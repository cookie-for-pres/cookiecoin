import Account from '../models/Account';
import GameLog from '../models/GameLog';
import { v4 } from 'uuid';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  const { accountId, bet, account: accountBalance, status } = req.body;
  const account = await Account.findOne({ _id: accountId });

  console.log(req.body);
  

  if (account) {
    if (account.balances[accountBalance] >= bet) {
      const gameLog = new GameLog({
        _id: v4(),
        playerId: account._id,
        game: 'blackjack',
        status,
        data: {
          bet,
          account: accountBalance
        }
      });
  
      await gameLog.save();

      if (status === 'win') {
        account.balances[accountBalance] = account.balances[accountBalance] + bet;
        await account.save(); 
      } else if (status === 'lose') {
        account.balances[accountBalance] = account.balances[accountBalance] - bet;
        await account.save();
      }

      res.json({
        message: 'successfully played blackjack',
        success: true,
        balances: account.balances
      });
    } else {
      res.status(400).send({
        message: 'insufficient funds',
        success: false
      });
    }
  } else {
    res.status(404).json({
      message: 'cant find account',
      success: false
    });
  }
}
