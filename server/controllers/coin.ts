import { v4 } from 'uuid';
import Coin from '../models/Coin';
import Account from '../models/Account';
import BoughtCoin from '../models/BoughtCoin';
import { Request, Response } from 'express';

const roundToHundredth = (value: number) => {
  return Number(value.toFixed(2));
}

export const coins = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const account = await Account.findOne({ _id: accountId });
  const coins = await Coin.find({});

  if (account) {
    res.json({
      message: 'successfully found coins',
      success: true,
      coins
    });
  } else {
    res.status(404).json({
      message: 'cant find account',
      success: false
    });
  }
}

export const find = async (req: Request, res: Response) => {
  const { accountId, coinId } = req.body;
  const account = await Account.findOne({ _id: accountId });
  const coin = await Coin.findOne({ _id: coinId });
  let boughtCoin = await BoughtCoin.findOne({ account: accountId, name: coin.name });

  if (account) {
    if (coin) {
      if (boughtCoin) {
        res.json({
          message: 'successfully found coin',
          success: true,
          coin,
          boughtCoin
        });
      } else {
        res.json({
          message: 'successfully found coin',
          success: true,
          coin,
          boughtCoin: {
            account: accountId,
            coin: coinId,
            amount: 0
          }
        });
      }
    } else {
      res.status(404).json({
        message: 'cant find coin',
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

export const buy = async (req: Request, res: Response) => {
  const { accountId, coinId, amount, balance } = req.body;
  const account = await Account.findOne({ _id: accountId });
  const coin = await Coin.findOne({ _id: coinId });

  if (account) {
    if (coin) {
      const owned = await BoughtCoin.findOne({ owner: account._id, abbreviation: coin.abbreviation });
      
      if (owned) {
        if (balance === 'cash') {
          if (amount <= 0) {
            return res.status(400).json({
              message: 'amount must be greater than 0',
              success: false
            });
          }
          
          let dif = (coin.price * amount) - account.balances.cash;
          if (account.balances.cash >= (coin.price * amount) - (dif > 0 ? dif : 0)) {
            account.balances.cash = roundToHundredth(account.balances.cash - (coin.price * amount) + (dif > 0 ? dif : 0));
            owned.amount = owned.amount + amount;

            await account.save(async (err1: any) => {
              if (!err1) {
                await owned.save((err2: any) => {
                  if (!err2) {

                    res.json({
                      message: 'successfully bought coin',
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
                res.status(500).json({
                  message: 'unknown error',
                  success: false,
                  error: err1.message
                });
              }
            });
          } else {
            res.status(409).json({
              message: 'insignificant funds',
              success: false
            });
          }
        } else {
          let dif = (coin.price * amount) - account.balances.bank;
          if (account.balances.bank >= coin.price * amount - (dif > 0 ? dif : 0)) {
            account.balances.bank = roundToHundredth(account.balances.bank - (coin.price * amount) + (dif > 0 ? dif : 0));
            owned.amount = owned.amount + amount;

            await account.save(async (err1: any) => {
              if (!err1) {
                await owned.save((err2: any) => {
                  if (!err2) {

                    res.json({
                      message: 'successfully bought coin',
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
                res.status(500).json({
                  message: 'unknown error',
                  success: false,
                  error: err1.message
                });
              }
            });
          } else {
            res.status(409).json({
              message: 'insignificant funds',
              success: false
            });
          }
        }
      } else {
        if (balance === 'cash') {
          let dif = (coin.price * amount) - account.balances.cash;
          if (account.balances.cash >= coin.price * amount - (dif > 0 ? dif : 0)) {
            const boughtCoinId = v4();

            account.balances.cash = roundToHundredth(account.balances.cash - (coin.price * amount) + (dif > 0 ? dif : 0));
            account.coins.push(boughtCoinId);

            const boughtCoin = new BoughtCoin({
              _id: boughtCoinId,
              name: coin.name,
              abbreviation: coin.abbreviation,
              owner: account._id,
              amount: amount
            });
            
            await account.save(async (err1: any) => {
              if (!err1) {
                await boughtCoin.save((err2: any) => {
                  if (!err2) {

                    res.json({
                      message: 'successfully bought coin',
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
                res.status(500).json({
                  message: 'unknown error',
                  success: false,
                  error: err1.message
                });
              }
            });
          } else {
            res.status(409).json({
              message: 'insignificant funds',
              success: false
            });
          }
        } else {
          let dif = (coin.price * amount) - account.balances.bank;
          if (account.balances.bank >= coin.price * amount - (dif > 0 ? dif : 0)) {
            const boughtCoinId = v4();

            account.balances.bank = roundToHundredth(account.balances.bank - (coin.price * amount) + (dif > 0 ? dif : 0));
            account.coins.push(boughtCoinId);
            
            const boughtCoin = new BoughtCoin({
              _id: boughtCoinId,
              name: coin.name,
              abbreviation: coin.abbreviation,
              owner: account._id,
              amount: amount
            });
            
            await account.save(async (err1: any) => {
              if (!err1) {
                await boughtCoin.save((err2: any) => {
                  if (!err2) {

                    res.json({
                      message: 'successfully bought coin',
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
                res.status(500).json({
                  message: 'unknown error',
                  success: false,
                  error: err1.message
                });
              }
            });
          } else {
            res.status(409).json({
              message: 'insignificant funds',
              success: false
            });
          }
        }
      }
    } else {
      res.status(404).json({
        message: 'cant find coin',
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

export const sell = async (req: Request, res: Response) => {
  const { accountId, coinId, amount, balance } = req.body;
  const account = await Account.findOne({ _id: accountId });
  const coin = await Coin.findOne({ _id: coinId });
  const boughtCoin = await BoughtCoin.findOne({ owner: account._id, abbreviation: coin.abbreviation });

  if (account) {
    if (coin) {
      if (boughtCoin) {
        if (boughtCoin.amount >= amount) {
          boughtCoin.amount = boughtCoin.amount - amount;

          if (balance === 'cash') {
            account.balances.cash = roundToHundredth(account.balances.cash + (coin.price * amount));
          } else {
            account.balances.bank = roundToHundredth(account.balances.bank + (coin.price * amount));
          }

          await boughtCoin.save(async (err1: any) => {
            if (!err1) {
              await account.save(async (err2: any) => {
                if (!err2) {                  
                  res.json({
                    message: 'successfully sold coin',
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
              res.status(500).json({
                message: 'unknown error',
                success: false,
                error: err1.message
              });
            }
          });
        } else {
          res.status(409).json({
            message: 'insignificant amount',
            success: false
          });
        }
      } else {
        res.status(404).json({
          message: 'cant find bought coin',
          success: false
        });
      }
    } else {
      res.status(404).json({
        message: 'cant find coin',
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

export const create = async (req: Request, res: Response) => {

}