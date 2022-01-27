import Account from '../models/Account';
import { Request, Response } from 'express';

export const balances = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const account = await Account.findOne({ _id: accountId });

  if (account) {
    res.json({
      message: 'successfully found balances',
      success: true,
      balances: account.balances
    });
  } else {
    res.status(404).json({ 
      message: 'cant find account',
      success: false
    });
  }
}