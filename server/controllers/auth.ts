import Account from '../models/Account';

export default async (req: any, res: any) => {
  const { accountId } = req.body;
  const account = await Account.findOne({ _id: accountId });

  if (account) {
    res.json({
      message: 'confirmed account',
      success: true
    });
  } else {
    res.status(404).json({ 
      message: 'cant find account',
      success: false
    });
  }
}