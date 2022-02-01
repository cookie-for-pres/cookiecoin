from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from config import db

router = APIRouter(prefix='/api')
account_collection = db.get_collection('accounts')
coin_collection = db.get_collection('coins')
bought_coin_collection = db.get_collection('bought-coins')

@router.post('/leaderboard')
async def leaderboard():
    accounts = account_collection.find({})
    leaderboard = []

    for account in accounts:
        global balance
        balance = 0

        coins = list(coin_collection.find({}))
        bought_coins = list(bought_coin_collection.find({'owner': account['_id']}))

        balance += account['balances']['bank']
        balance += account['balances']['cash']

        for bought_coin in bought_coins:
            for coin in coins:
                if bought_coin['name'] == coin['name']:
                    balance += bought_coin['amount'] * coin['price']

        balance = round(balance, 2)

        leaderboard.append({
            'username': account['username'],
            'balance': balance
        })

    leaderboard.sort(key=lambda x: x['balance'], reverse=True)
    return JSONResponse(
        {
            'message': 'successfully found leaderboard',
            'success': True,
            'leaderboard': leaderboard[:5]
        }, status_code=200
    )