import Account from '../models/Account';

export  default async (req: any, res: any) => {
  const { username, password } = req.body;
  const account = await Account.findOne({ username });

  if (username && password) {
    if (account) {

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