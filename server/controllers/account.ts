import Account from '../models/Account';

export const balances = async (req: any, res: any) => {
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