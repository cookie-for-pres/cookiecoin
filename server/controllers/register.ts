import Coin from '../models/Coin';
import BoughtCoin from '../models/BoughtCoin';
import Account from '../models/Account';
import { v4 } from 'uuid';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  const { username, email, password } = req.body;  
  const check1 = await Account.findOne({ username });
  const check2 = await Account.findOne({ email });

  if (username && email && password) {
    if (!check1 && !check2) {
      const accountId = v4();

      const account = new Account({
        _id: accountId,
        username,
        email,
        password,
        coins: []
      });

      await account.save(async (err1: any) => {
        if (!err1) {
          res.json({
            message: 'successfully registered account',
            success: true
          });
        } else {
          res.status(500).json({
            message: 'unknown error',
            success: false,
            error: err1.message
          });
        }
      });
    } else {
      res.status(409).json({
        message: 'username or email is already taken',
        success: false
      });
    }
  } else {
    res.status(409).json({
      message: 'username, email, and password are required fields',
      success: false
    });
  }
}