import Account from '../models/Account';
import Game from '../models/Game';

export const games = async (req: any, res: any) => {
  const { accountId } = req.body;
  const account = await Account.findOne({ _id: accountId });
  const displayGames = await Game.find({ display: true });
  const joinableGames = await Game.find({ display: false });

  if (account) {
    res.json({
      message: 'successfully found games',
      success: true,
      displayGames,
      joinableGames
    });
  } else {
    res.status(404).json({
      message: 'cant find account',
      success: false
    });
  }
}

export const find = async (req: any, res: any) => {
  const { accountId, code } = req.body;
  const account = await Account.findOne({ _id: accountId });
  const game = await Game.findOne({ 'data.code': code });  

  if (account) {
    if (game) {
      if (game.data.players.active < game.data.players.max) {
        if (game.data.passwordRequired) {
          const password = req.body.password;

          if (game.data.password === password) {
            res.json({
              message: 'game found',
              success: true,
              game: {
                _id: game._id,
                code: game.data.code,
                password: game.data.password
              }
            });
          } else {
            res.status(401).json({
              message: 'game found but invalid password',
              success: false
            });
          }
        } else {
          res.json({
            message: 'game found',
            success: true,
            game: {
              _id: game._id,
              code: game.data.code,
              password: 'NO_PASS'
            }
          });
        }
      } else {
        res.status(409).json({
          message: 'game is full',
          success: false
        });
      }
    } else {
      res.status(404).json({
        message: 'cant find game',
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

export const join = async (req: any, res: any) => {
  const { accountId, code } = req.body;
  const account = await Account.findOne({ _id: accountId });
  const game = await Game.findOne({ 'data.code': code });  

  if (account) {
    if (game) {
      if (game.data.players.active < game.data.players.max) {
        game.data.players.players.push(account._id);
        game.data.players.active++;
      } else {
        res.status(409).json({
          message: 'game is full',
          success: false
        });
      }
    } else {
      res.status(404).json({
        message: 'cant find game',
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