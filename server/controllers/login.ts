import Account from '../models/Account';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const account = await Account.findOne({ username });

  if (username && password) {
    if (account) {
      if (!account.banned) {
        account.comparePassword(password, async (err: any, match: any)  => {
          if (!err) {
            if (match) {
              res.json({
                message: 'successfully logged in',
                success: true,
                id: account._id
              });
            } else {
              res.status(401).json({
                message: 'invalid password',
                success: false
              });
            }
          } else {
            res.status(500).json({
              message: 'unknown error',
              success: false,
              error: err.message
            });
          }
        });
      } else {
        res.status(401).json({
          message: 'account is banned',
          success: false
        });
      }
    } else {
      res.status(404).json({
        message: 'cant find account',
        success: false
      });
    }
  } else {
    res.status(409).json({
      message: 'username and password are required fields',
      success: false
    });
  }
}