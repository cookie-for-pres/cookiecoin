import Account from '../models/Account';
import GameLog from '../models/GameLog';
import { v4 } from 'uuid';

export default async (req: any, res: any) => {
  const { accountId, account: balance, side, bet } = req.body;
  const account = await Account.findById(accountId);

  if (account) {  
    if ((side !== 'heads' && side !== 'tails') || !side || !bet || !accountId || !account) {
      return res.status(400).send({
        message: 'side, bet, accountId, and account are required fields'
      });
    }

    if (account.balances.cash >= bet || account.balances.bank >= bet) {
      if (bet > 0) {
        const botChoice = ['heads', 'tails'][Math.floor(Math.random() * 2)];

        if (balance === 'cash') {
          account.balances.cash = account.balances.cash - bet;
          await account.save();
        } else {
          account.balances.bank = account.balances.bank - bet;
          await account.save();
        }

        if (side === botChoice) {
          if (balance === 'cash') {
            account.balances.cash = account.balances.cash + bet;
            await account.save();
          } else {
            account.balances.bank = account.balances.bank + bet;
            await account.save();
          }
        }
    
        const gameLog = new GameLog({
          _id: v4(),
          playerId: accountId,
          game: 'coinflip',
          status: botChoice === side ? 'win' : 'lose',
          data: {
            bet,
            side,
            botChoice,
          }
        });
    
        await gameLog.save((err: any) => {
          if (!err) {
            res.status(200).json({
              message: 'successfully played coinflip',
              success: true,
              data: gameLog
            });
          } else {
            res.status(500).json({
              message: 'unknown error',
              success: false,
              error: err.message
            });
          }
        });
      } else {
        res.status(400).json({
          message: 'Bet must be greater than 0',
          success: false,
        });
      }
    } else {
      res.status(400).json({
        message: 'insufficient funds',
        success: false,
      });
    }
  } else {
    res.status(404).json({
      message: 'cant find account',
      success: false,
    });
  }
}