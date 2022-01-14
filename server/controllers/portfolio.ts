import Account from '../models/Account';
import BoughtCoin from '../models/BoughtCoin';
import Coin from '../models/Coin';
import Wallet from 'ethereumjs-wallet';
import { Request, Response } from 'express';

export const portfolio = async (req: Request, res: Response) => {
  const { accountId } = req.body;
  const account = await Account.findOne({ _id: accountId });
  const boughtCoins = await BoughtCoin.find({ owner: accountId });
  const coins = await Coin.find({});

  if (account) {
    const portfolio = boughtCoins.map((boughtCoin) => {
      const coin = coins.find((coin) => coin.name === boughtCoin.name);
      return {
        _id: coin._id,
        name: coin.name,
        abbreviation: coin.abbreviation,
        price: coin.price,
        amount: boughtCoin.amount,
        total: boughtCoin.amount * coin.price,
        wallet: boughtCoin.wallet,
        imageUrl: coin.imageUrl
      }
    });

    res.json({
      message: 'successfully found portfolio',
      success: true,
      portfolio,
      account: {
        balances: account.balances,
      }
    });
  } else {
    res.status(404).json({
      message: 'cant find account'
    });
  }
}

export const transfer = async (req: Request, res: Response) => {
  const { accountId, type, data } = req.body;
  const account = await Account.findOne({ _id: accountId });

  if (account) {
    if (type === 'coin-to-coin') {
      const { to, from, amount } = data;
      const to_bought_coin = await BoughtCoin.findOne({ name: to });
      const from_bought_coin = await BoughtCoin.findOne({ name: from });
      const to_coin = await Coin.findOne({ name: to });
      const from_coin = await Coin.findOne({ name: from });

      if (to_coin && from_coin) {
        if (to_bought_coin && from_bought_coin) {
          if (to_bought_coin.amount >= amount) {
            const to_new_amount = to_bought_coin.amount - amount;
            const from_new_amount = from_bought_coin.amount + amount;

            await BoughtCoin.findOneAndUpdate({ name: to }, { amount: to_new_amount });
            await BoughtCoin.findOneAndUpdate({ name: from }, { amount: from_new_amount });

            res.json({
              message: 'successfully transferred',
              success: true,
              account: {
                balances: account.balances,
              }
            });
          } else {
            res.status(404).json({
              message: 'not enough coins',
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

    } else if (type === 'balance-to-balance') {
      const balances = account.balances;
      const { to, from, amount } = data;

      if (balances[to] >= amount) {
        const new_to_balance = balances[to] - amount;
        const new_from_balance = balances[from] + amount;

        const new_balances = {
          ...balances,
          [to]: new_to_balance,
          [from]: new_from_balance,
        }

        await Account.findOneAndUpdate({ _id: accountId }, { balances: new_balances });

        res.json({
          message: 'successfully transferred',
          success: true,
          account: {
            balances: new_balances,
          }
        });
      } else {
        res.status(400).json({
          message: 'insufficient funds',
          success: false
        });
      }
    } else if (type === 'user:account-to-user:account') {
      const { to, amount } = data;
      const to_account = await Account.findOne({ username: to });

      if (account.balances.bank >= amount) {
        const new_balance = account.balances.bank - amount;
        const new_to_balance = to_account.balances.bank + amount;

        await Account.findOneAndUpdate({ _id: accountId }, { 'balances.bank': new_balance });
        await Account.findOneAndUpdate({ _id: to_account._id }, { 'balances.bank': new_to_balance });

        res.json({
          message: 'successfully transferred',
          success: true,
          account: {
            balances: {
              bank: new_balance,
            }
          }
        });
      } else {
        res.status(400).json({
          message: 'insufficient funds',
          success: false
        });
      }
    } else {
      res.status(404).json({
        message: 'cant find type',
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

// export const giveAllBoughtCoinAWallet = async (req: Request, res: Response) => {
//   const boughtCoins = await BoughtCoin.find({});

//   boughtCoins.forEach(async (boughtCoin) => {
//     const wallet = Wallet.generate();
//     const address = wallet.getAddressString();
  
//     await BoughtCoin.findOneAndUpdate({ _id: boughtCoin._id }, { '$set': { wallet: address } }, {multi:true}, );
//   });

//   res.json({
//     message: 'successfully gave all bought coins a wallet',
//     success: true,
//   });
// }