import { v4 } from 'uuid';

import Coin from '../models/Coin';
import Account from '../models/Account';
import BoughtCoin from '../models/BoughtCoin';

const roundToHundredth = (value) => {
  return Number(value.toFixed(2));
};

export const coins = async (req: any, res: any) => {
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

export const find = async (req: any, res: any) => {
  const { accountId, coinId } = req.body;
  const account = await Account.findOne({ _id: accountId });
  const coin = await Coin.findOne({ _id: coinId });

  if (account) {
    if (coin) {
      res.json({
        message: 'successfully found coin',
        success: true,
        coin
      });
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

export const buy = async (req: any, res: any) => {
  const { accountId, coinId, amount, balance } = req.body;
  const account = await Account.findOne({ _id: accountId });
  const coin = await Coin.findOne({ _id: coinId });

  if (account) {
    if (coin) {
      const owned = await BoughtCoin.findOne({ owner: account._id, abbreviation: coin.abbreviation });
      
      if (owned) {
        if (balance === 'cash') {
          if (account.balances.cash >= coin.price * amount) {
            account.balances.cash = roundToHundredth(account.balances.cash - (coin.price * amount));
            owned.amount = owned.amount + amount;

            await account.save(async (err1) => {
              if (!err1) {
                await owned.save((err2) => {
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
          if (account.balances.bank >= coin.price * amount) {
            account.balances.bank = roundToHundredth(account.balances.bank - (coin.price * amount));
            owned.amount = owned.amount + amount;

            await account.save(async (err1) => {
              if (!err1) {
                await owned.save((err2) => {
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
          if (account.balances.cash >= coin.price * amount) {
            const boughtCoinId = v4();

            account.balances.cash = roundToHundredth(account.balances.cash - (coin.price * amount));
            account.coins.push(boughtCoinId);

            const boughtCoin = new BoughtCoin({
              _id: boughtCoinId,
              name: coin.name,
              abbreviation: coin.abbreviation,
              owner: account._id,
              amount: amount
            });
            
            await account.save(async (err1) => {
              if (!err1) {
                await boughtCoin.save((err2) => {
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
          if (account.balances.bank >= coin.price * amount) {
            const boughtCoinId = v4();

            account.balances.bank = roundToHundredth(account.balances.bank - (coin.price * amount));
            account.coins.push(boughtCoinId);
            
            const boughtCoin = new BoughtCoin({
              _id: boughtCoinId,
              name: coin.name,
              abbreviation: coin.abbreviation,
              owner: account._id,
              amount: amount
            });
            
            await account.save(async (err1) => {
              if (!err1) {
                await boughtCoin.save((err2) => {
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

export const sell = async (req: any, res: any) => {
  
}

export const create = async (req: any, res: any) => {

}