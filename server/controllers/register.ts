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
      const boughtCoinId = v4();

      const account = new Account({
        _id: accountId,
        username,
        email,
        password,
        coins: [boughtCoinId]
      });

      const dogecoin = await Coin.findOne({ '_id': process.env.DOGE_ID });

      const boughtCoin = new BoughtCoin({
        _id: boughtCoinId,
        name: dogecoin.name,
        abbreviation: dogecoin.abbreviation,
        amount: 5,
        owner: accountId
      });

      await account.save(async (err1: any) => {
        if (!err1) {
          await boughtCoin.save((err2: any) => {
            if (!err2) {
              res.json({
                message: 'successfully registered account',
                success: true
              });
            } else {
              res.status(500).json({
                message: 'unknown error',
                success: false,
                error: err2.message
              });
            }
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