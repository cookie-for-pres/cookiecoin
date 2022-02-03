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
        'createdAt': datetime.datetime.utcnow(),
        'updatedAt': datetime.datetime.utcnow()
    })
    
class Blackjack(BaseModel):
    token: str
    bet: float
    account: str
    status: str

@router.post('/blackjack')
async def blackjack(blackjack: Blackjack):
    payload = jwt.decode(blackjack.token, SECRET_KEY, algorithms=['HS256'])
    account = account_collection.find_one({'_id': payload['_id']})

    if account:
        if account['balances'][blackjack.account] < blackjack.bet:
            return JSONResponse(
                {'message': 'insufficient funds', 'success': False}, status_code=400
            )

        game_log_collection.insert_one({
            '_id': str(uuid.uuid4()),
            'playerId': account['_id'],
            'game': 'blackjack',
            'status': blackjack.status,
            'data': {
                'bet': blackjack.bet,
                'account': blackjack.account
            }
        })

        if blackjack.status == 'win':
            account['balances'][blackjack.account] = account['balances'][blackjack.account] + blackjack.bet
        
        elif blackjack.status == 'lose':
            account['balances'][blackjack.account] = account['balances'][blackjack.account] - blackjack.bet
        
        account_collection.find_one_and_update({'_id': account['_id']}, {'$set': {'balances': account['balances'], 'updatedAt': datetime.datetime.utcnow()}})
        add_transaction(type='Blackjack', data={'status': blackjack.status, 'bet': blackjack.bet, 'account': blackjack.account})

        return JSONResponse(
            {
                'message': 'successfully played blackjack', 'success': True,
                'balances': account['balances'],
            }, status_code=200
        )

    else:
        return JSONResponse(
            {'message': 'cant find account', 'success': False}, status_code=404
        )