from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pymongo
import jwt

from config import db, SECRET_KEY

router = APIRouter(prefix='/api')
account_collection = db.get_collection('accounts')
game_collection = db.get_collection('games')

class Games(BaseModel):
    token: str

class FindGame(BaseModel):
    token: str
    code: str
    password: str

@router.post('/games')
async def games(game: Games):
    try:
        payload = jwt.decode(game.token, SECRET_KEY, algorithms=['HS256'])
        account = account_collection.find_one({'_id': payload['_id']})

        if account:
            display_games = []
            for display_game in game_collection.find({'display': True}).sort(key_or_list='index', direction=pymongo.ASCENDING):
                display_game['createdAt'] = str(display_game['createdAt'])
                display_game['updatedAt'] = str(display_game['updatedAt'])
                display_games.append(display_game)

            joinable_games = []
            for joinable_game in game_collection.find({'display': False}):
                joinable_game['createdAt'] = str(joinable_game['createdAt'])
                joinable_game['updatedAt'] = str(joinable_game['updatedAt'])
                joinable_games.append(joinable_game)

            return JSONResponse(
                {
                    'displayGames': display_games, 'joinableGames': joinable_games,
                    'message': 'successfully found games',
                    'success': True
                }
            )

        else:
            return JSONResponse({'message': 'cant find account'}, status_code=404)

    except jwt.exceptions.DecodeError:
        return JSONResponse({'message': 'invalid token', 'success': False}, status_code=401)

    except jwt.exceptions.ExpiredSignatureError:
        return JSONResponse({'message': 'token expired', 'success': False}, status_code=401)

    except Exception as e:
        return JSONResponse(
            {'message': 'unknown error', 'error': str(e), 'success': False}, status_code=500
        )

@router.post('/games/find')
async def find_game(game: FindGame):
    try:
        payload = jwt.decode(game.token, SECRET_KEY, algorithms=['HS256'])
        account = account_collection.find_one({'_id': payload['_id']})

        if account:
            game_to_join = game_collection.find_one({'code': game.code, 'password': game.password})

            if game_to_join:
                if game_to_join['data']['players']['active'] < game_to_join['data']['players']['max']:
                    game_collection.update_one(
                        {'_id': game_to_join['_id']},
                        {
                            '$set': {
                                'data.players.active': game_to_join['data']['players']['active'] + 1
                            }
                        }
                    )

                    return JSONResponse({'message': 'successfully joined game', 'success': True}, status_code=200)

                else:
                    return JSONResponse({'message': 'game is full', 'success': False}, status_code=400)

            else:
                return JSONResponse({'message': 'cant find game', 'success': False}, status_code=404)

        else:
            return JSONResponse({'message': 'cant find account', 'success': False}, status_code=404)

    except jwt.exceptions.DecodeError:
        return JSONResponse({'message': 'invalid token', 'success': False}, status_code=401)

    except jwt.exceptions.ExpiredSignatureError:
        return JSONResponse({'message': 'token expired', 'success': False}, status_code=401)

    except Exception as e:
        return JSONResponse(
            {'message': 'unknown error', 'error': str(e), 'success': False}, status_code=500
        )