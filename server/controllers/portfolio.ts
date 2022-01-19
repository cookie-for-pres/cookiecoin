import Account from '../models/Account';
import BoughtCoin from '../models/BoughtCoin';
import Coin from '../models/Coin';
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
    if (type === 'balance-to-balance') {
      const balances = account.balances;
      const { to, from, amount } = data;

      if (amount <= 0) {
        return res.status(400).json({
          message: 'amount must be greater than 0',
          success: false
        });
      }

      if (balances[from] >= amount) {
        const newFromBalance = balances[from] - amount;
        const newToBalance = balances[to] + amount;

        const newBalances = {
          [to]: newToBalance,
          [from]: newFromBalance
        }
      
        await Account.findOneAndUpdate({ _id: account._id }, { balances: newBalances });

        res.json({
          message: 'successfully transferred',
          success: true,
          account: {
            balances: newBalances,
          }
        });
      } else {
        res.status(400).json({
          message: 'insufficient funds',
          success: false
        });
      }
    } else if (type === 'user:account-to-user:account') {
      const { from, to, amount } = data;
      const toAccount = await Account.findOne({ username: to });

      if (toAccount.username === account.username) {
        return res.status(400).json({
          message: 'cant transfer to yourself',
          success: false
        });
      }

      if (toAccount) {
        if (account.balances.bank >= amount) {
          const newBalance = account.balances[from] - amount;
          const newToBalance = toAccount.balances.bank + amount;

          const newBalances = {
            ...account.balances,
            [from]: newBalance
          }
  
          await Account.findOneAndUpdate({ _id: account._id }, { 'balances': newBalances });
          await Account.findOneAndUpdate({ _id: toAccount._id }, { 'balances.bank': newToBalance });
  
          res.json({
            message: 'successfully transferred',
            success: true,
            account: {
              balances: {
                ...account.balances
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
        res.json({
          message: 'cant find to account',
          success: false
        });
      }
    } else if (type === 'user:coin-to-user:coin') {
      const { from, to, amount } = data;
      const fromBoughtCoin = await BoughtCoin.findOne({ owner: accountId, name: from });
      const toBoughtCoin = await BoughtCoin.findOne({ wallet: to });
      
      if (fromBoughtCoin) {
        if (toBoughtCoin) {
          const fromCoin = await Coin.findOne({ name: fromBoughtCoin.name });
          const toCoin = await Coin.findOne({ name: toBoughtCoin.name });

          if (fromCoin) {
            if (toCoin) {
              if (fromBoughtCoin.amount * fromCoin.price >= amount) {
                const fromDiff = amount / fromCoin.price;
                const toDiff = amount / toCoin.price;

                const newFromAmount = fromBoughtCoin.amount - fromDiff;
                const newToAmount = toBoughtCoin.amount + toDiff;    
                
                await BoughtCoin.findOneAndUpdate({ _id: fromBoughtCoin._id }, { amount: newFromAmount });
                await BoughtCoin.findOneAndUpdate({ _id: toBoughtCoin._id }, { amount: newToAmount })

                res.json({
                  message: 'successfully transferred',
                  success: true,
                  account: {
                    balances: account.balances,
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
                message: 'cant find to coin',
                success: false
              });
            }
          } else {
            res.status(404).json({
              message: 'cant find from coin',
              success: false
            });
          }
        } else {
          res.status(404).json({
            message: 'cant find to bought coin',
            success: false
          });
        }
      } else {
        res.status(404).json({
          message: 'cant find from bought coin',
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