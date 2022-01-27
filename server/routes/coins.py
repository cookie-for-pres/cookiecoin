from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from eth_account import Account
import datetime
import secrets
import pymongo
import uuid
import jwt

from config import db, SECRET_KEY

router = APIRouter(prefix='/api')
account_collection = db.get_collection('accounts')
coin_collection = db.get_collection('coins')
bought_coins_collection = db.get_collection('bought-coins')

class Coin(BaseModel):
    token: str

class FindCoin(BaseModel):
    token: str
    coinId: str

class BuyCoin(BaseModel):
    token: str
    coinId: str
    balance: str
    amount: float

class SellCoin(BaseModel):
    token: str
    coinId: str
    balance: str
    amount: float

@router.post('/coins')
async def coins(coin: Coin):
    try:
        payload = jwt.decode(coin.token, SECRET_KEY, algorithms=['HS256'])
        account = account_collection.find_one({'_id': payload['_id']})

        if account:
            bought_coins = []
            for bought_coin in bought_coins_collection.find({'owner': account['_id']}):
                bought_coin['createdAt'] = bought_coin['createdAt'].isoformat()
                bought_coin['updatedAt'] = bought_coin['updatedAt'].isoformat()

                bought_coins.append(bought_coin)

            coins = []
            coins_ = coin_collection.find({}).sort(key_or_list='index', direction=pymongo.ASCENDING)

            for coin in coins_:
                coin_collection.find_one_and_update({'name': coin['name']}, {'$set': {'index': str(coin['index'])}})
                coin['createdAt'] = coin['createdAt'].isoformat()
                coin['updatedAt'] = coin['updatedAt'].isoformat()
                
                coins.append(coin)

            return JSONResponse({
                'message': 'successfully found coins', 'success': True,
                'coins': coins, 'boughtCoins': bought_coins
            }, status_code=200)

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

@router.post('/coins/find')
async def find_coin(coin: FindCoin):
    try:
        payload = jwt.decode(coin.token, SECRET_KEY, algorithms=['HS256'])
        account = account_collection.find_one({'_id': payload['_id']})

        if account:
            coin_ = coin_collection.find_one({'_id': coin.coinId})
            coin_logs = []

            for coin_log in coin_['logs']:
                coin_log['price'] = float(round(coin_log['price'], 2))

                coin_logs.append(coin_log)

            coin_ = {
                '_id': coin_['_id'], 'name': coin_['name'], 'abbreviation': coin_['abbreviation'],
                'price': coin_['price'], 'index': int(str(coin_['index'])), 'logs': coin_logs,
                'imageUrl': coin_['imageUrl']
            }

            print(coin_)

            bought_coin = bought_coins_collection.find_one({'owner': account['_id'], 'name': coin_['name']})

            bought_coin = {
                '_id': bought_coin['_id'], 'owner': bought_coin['owner'], 'name': bought_coin['name'],
                'abbreviation': bought_coin['abbreviation'], 'amount': bought_coin['amount']
            }

            if coin and bought_coin:
                return JSONResponse({
                    'message': 'successfully found coin', 'success': True,
                    'coin': coin_,
                    'boughtCoin': bought_coin
                }, status_code=200)

            else:
                return JSONResponse({'message': 'cant find coin', 'success': False}, status_code=404)

        else:
            return JSONResponse({'message': 'cant find account', 'success': False}, status_code=404)

    except jwt.exceptions.DecodeError:
        return JSONResponse({'message': 'invalid token'}, status_code=401)

    except jwt.exceptions.ExpiredSignatureError:
        return JSONResponse({'message': 'token expired'}, status_code=401)

    except Exception as e:
        return JSONResponse(
            {'message': 'unknown error', 'error': str(e), 'success': False}, status_code=500
        )

@router.post('/coins/buy')
async def buy_coin(coin: BuyCoin):
    payload = jwt.decode(coin.token, SECRET_KEY, algorithms=['HS256'])
    account = account_collection.find_one({'_id': payload['_id']})
    coin_ = coin_collection.find_one({'_id': coin.coinId})

    if account:
        if account['balances'][coin.balance] < coin_['price'] * coin.amount:
            return JSONResponse({'message': 'insignificant funds', 'success': False}, status_code=400)

        owned = bought_coins_collection.find_one({'owner': account['_id'], 'name': coin_['name']})

        if owned:
            owned['amount'] = owned['amount'] + coin.amount
            account['balances'][coin.balance] = account['balances'][coin.balance] - (coin.amount * coin_['price'])
            bought_coins_collection.update_one({'_id': owned['_id']}, {'$set': {'amount': owned['amount'], 'updatedAt': datetime.datetime.now()}})
            account_collection.update_one({'_id': account['_id']}, {'$set': {'balances': account['balances'], 'updatedAt': datetime.datetime.now()}})

            return JSONResponse({'message': 'successfully bought coin', 'success': True}, status_code=200)

        else:
            account['balances'][coin.balance] = account['balances'][coin.balance] - coin.amount * coin_['price']
            wallet = Account.from_key(f'0x{secrets.token_hex(32)}').address

            bought_coins_collection.insert_one({
                '_id': str(uuid.uuid4()), 'owner': account['_id'], 'name': coin_['name'],
                'abbreviation': coin_['abbreviation'], 'amount': coin.amount,
                'wallet': wallet, 'createdAt': datetime.datetime.utcnow(), 'updatedAt': datetime.datetime.utcnow()
            })

            return JSONResponse({'message': 'successfully bought coin', 'success': True}, status_code=200)

    else:
        return JSONResponse({'message': 'cant find account', 'success': False}, status_code=404)

@router.post('/coins/sell')
async def sell_coin(coin: SellCoin):
    payload = jwt.decode(coin.token, SECRET_KEY, algorithms=['HS256'])
    account = account_collection.find_one({'_id': payload['_id']})
    coin_ = coin_collection.find_one({'_id': coin.coinId})

    if account:
        owned = bought_coins_collection.find_one({'owner': account['_id'], 'name': coin_['name']})

        if owned:
            if owned['amount'] < coin.amount:
                return JSONResponse({'message': 'insignificant funds', 'success': False}, status_code=400)

            owned['amount'] = owned['amount'] - coin.amount
            account['balances'][coin.balance] = account['balances'][coin.balance] + (coin.amount * coin_['price'])
            bought_coins_collection.update_one({'_id': owned['_id']}, {'$set': {'amount': owned['amount'], 'updatedAt': datetime.datetime.now()}})
            account_collection.update_one({'_id': account['_id']}, {'$set': {'balances': account['balances'], 'updatedAt': datetime.datetime.now()}})

            return JSONResponse({'message': 'successfully sold coin', 'success': True}, status_code=200)

        else:
            return JSONResponse({'message': 'cant find coin', 'success': False}, status_code=404)

    else:
        return JSONResponse({'message': 'cant find account', 'success': False}, status_code=404)