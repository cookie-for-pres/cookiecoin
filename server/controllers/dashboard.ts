import Account from '../models/Account';
import BoughtCoin from '../models/BoughtCoin';
import Friend from '../models/Friend';

export default async (req: any, res: any) => {
  const { accountId } = req.body;
  const account = await Account.findOne({ _id: accountId });

  if (account) {
    const boughtCoins = await BoughtCoin.find({ owner: account._id });
    const friends1 = await Friend.find({ owner: account._id });
    const friends2 = await Friend.find({ friend: account._id });

    res.json({
      message: 'dashboard data found',
      success: true,
      account: {
        balances: account.balances,
        friends: [...friends1, ...friends2],
        boughtCoins,
        transactions: account.transactions
      }
    });
  } else {
    res.status(404).json({
      message: 'cant find account',
      success: false
    });
  }
}