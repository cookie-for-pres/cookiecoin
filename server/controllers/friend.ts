import { v4 } from 'uuid';
import Account from '../models/Account';
import Friend from '../models/Friend';

export const add = async (req: any, res: any) => {
  const { accountId, friendId } = req.body;
  const account = await Account.findOne({ _id: accountId });
  const friendAccount = await Account.findOne({ _id: friendId });
  const friendCheck1 = await Friend.findOne({ friend: friendId, owner: accountId });
  const friendCheck2 = await Friend.findOne({ friend: accountId, owner: friendId });

  if (account) {
    if (friendAccount) {
      if (account._id !== friendAccount._id) {
        if (!friendCheck1 && !friendCheck2) {
          const friend = new Friend({
            _id: v4(),
            owner: account._id,
            friend: friendAccount._id
          });

          await friend.save((err: any) => {
            if (!err) {
              res.json({
                message: 'successfully sent friend request',
                success: true
              });
            } else {
              res.status(500).json({
                message: 'unknown error',
                success: false,
                error: err.message
              });
            }
          });
        } else {
          res.status(409).json({
            message: 'already friends',
            success: false
          });
        }
      } else {
        res.status(409).json({
          message: 'cant add yourself',
          success: false
        });
      }
    } else {
      res.status(404).json({
        message: 'cant find friend',
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

export const remove = async (req: any, res: any) => {
  const { accountId, friendId } = req.body;
  const account = await Account.findOne({ _id: accountId });
  const friend = await Friend.findOne({ _id: friendId });

  if (account) {
    if (friend) {
      let newFriends1 = [];
      let newFriends2 = [];

      account.friends.forEach((friend1) => {
        if (friend1 !== friend._id) {
          newFriends1.push(friend1);
        }
      });

      friend.friends.forEach((friend1) => {
        if (friend1 !== account._id) {
          newFriends2.push(friend1);
        }
      });

      account.friends = newFriends1;
      friend.friends = newFriends2;

      await account.save(async (err) => {
        if (!err) {
          await friend.save((err1) => {
            if (!err1) {
              res.json({
                message: 'successfully removed friend',
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
            error: err.message
          });
        }
      });
      
      res.status(409).json({
        message: 'not friends',
        success: false
      });
    } else {
      res.status(404).json({
        message: 'cant find friend',
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

export const block = async (req: any, res: any) => {
  
}

export const unblock = async (req: any, res: any) => {
  
}