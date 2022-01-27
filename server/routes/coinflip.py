from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import datetime
import random
import uuid
import jwt

from config import db, SECRET_KEY

router = APIRouter(prefix='/api')
account_collection = db.get_collection('accounts')
bought_coin_collection = db.get_collection('bought-coins')
game_log_collection = db.get_collection('game-logs')
transaction_collection = db.get_collection('transactions')

def add_transaction(type: str, data: dict):
    _id = str(uuid.uuid4())
    slug = str(uuid.uuid4())[:4].upper()

    transaction_collection.insert_one({
        '_id': _id,
        'slug': slug,
        'type': type,
        'data': data,
        'createdAt': datetime.datetime.now(),
        'updatedAt': datetime.datetime.now()
    })

class CoinFlip(BaseModel):
    account: str
    bet: float
    side: str
    token: str

@router.post('/coinflip')
async def coinflip(coinflip: CoinFlip):
    try:
        payload = jwt.decode(coinflip.token, SECRET_KEY, algorithms=['HS256'])
        account = account_collection.find_one({'_id': payload['_id']})

        if account:
            if account['balances'][coinflip.account] < coinflip.bet:
                return JSONResponse(
                    {'message': 'insufficient funds', 'success': False}, status_code=400
                )

            choices = ['heads', 'tails']
            bot_choice = random.choice(choices)

            if coinflip.side == bot_choice:
                account['balances'][coinflip.account] = account['balances'][coinflip.account] + coinflip.bet
                
                doc = {
                    '_id': str(uuid.uuid4()),
                    'playerId': account['_id'],
                    'game': 'coinflip',
                    'status': 'win',
                    'data': {
                        'bet': coinflip.bet,
                        'side': coinflip.side,
                        'botChoice': bot_choice
                    }
                }

                game_log_collection.insert_one(doc)
                add_transaction(type='Coinflip', data={'status': 'win', 'bet': coinflip.bet, 'side': coinflip.side, 'botChoice': bot_choice})

                account_collection.update_one(
                    {'_id': account['_id']},
                    {'$set': {'balances': account['balances'], 'updatedAt': datetime.datetime.now()}}
                )

                return JSONResponse(
                    {
                        'message': 'successfully played coinflip', 'success': True,
                        'data': doc, 'balances': account['balances']
                    }, status_code=200
                )

            else:
                account['balances'][coinflip.account] = account['balances'][coinflip.account] - coinflip.bet

                doc = {
                    '_id': str(uuid.uuid4()),
                    'playerId': account['_id'],
                    'game': 'coinflip',
                    'status': 'lose',
                    'data': {
                        'bet': coinflip.bet,
                        'side': coinflip.side,
                        'botChoice': bot_choice
                    }
                }
                
                game_log_collection.insert_one(doc)
                add_transaction(type='Coinflip', data={'status': 'lose', 'bet': coinflip.bet, 'side': coinflip.side, 'botChoice': bot_choice})

                account_collection.update_one(
                    {'_id': account['_id']},
                    {'$set': {'balances': account['balances'], 'updatedAt': datetime.datetime.now()}}
                )

                return JSONResponse(
                    {
                        'message': 'successfully played coinflip', 'success': True,
                        'data': doc, 'balances': account['balances']
                    }, status_code=200
                )
            
        else:
            return JSONResponse(
                {'message': 'cant find account', 'success': False}, status_code=404
            )

    except jwt.exceptions.DecodeError:
        return JSONResponse({'message': 'invalid token', 'success': False}, status_code=401)

    except jwt.exceptions.ExpiredSignatureError:
        return JSONResponse({'message': 'token expired', 'success': False}, status_code=401)

    except Exception as e:
        return JSONResponse(
            {'message': 'unknown error', 'error': str(e), 'success': False}, status_code=500
        )