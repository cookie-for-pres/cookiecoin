from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import datetime
import uuid
import jwt

from config import db, SECRET_KEY

router = APIRouter(prefix='/api/portfolio')
account_collection = db.get_collection('accounts')
coin_collection = db.get_collection('coins')
bought_coin_collection = db.get_collection('bought-coins')
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

class Portfolio(BaseModel):
    token: str

class Transfer(BaseModel):
    token: str
    type: str
    data: dict

@router.post('/')
async def portfolio(portfolio: Portfolio):
    try:
        payload = jwt.decode(portfolio.token, SECRET_KEY, algorithms=['HS256'])
        account = account_collection.find_one({'_id': payload['_id']})

        if account:
            bought_coins = bought_coin_collection.find({'owner': account['_id']})
            portfolio_ = []

            for bought_coin in bought_coins:
                coin = coin_collection.find_one({'name': bought_coin['name']})

                portfolio_.append({
                    '_id': coin['_id'],
                    'name': coin['name'],
                    'abbreviation': coin['abbreviation'],
                    'price': coin['price'],
                    'amount': bought_coin['amount'],
                    'total': bought_coin['amount'] * coin['price'],
                    'wallet': bought_coin['wallet'],
                    'imageUrl': coin['imageUrl']
                })

            return JSONResponse(
                {
                    'message': 'successfully found portfolio', 'success': True,
                    'portfolio': portfolio_, 'account': {'balances': account['balances']}
                }, status_code=200
            )

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

@router.post('/transfer')
async def transfer(transfer: Transfer):
    try:
        payload = jwt.decode(transfer.token, SECRET_KEY, algorithms=['HS256'])
        account = account_collection.find_one({'_id': payload['_id']})

        if account:
            if transfer.type == 'balance-to-balance':
                balances = account['balances']
                to = transfer.data['to']
                from_ = transfer.data['from']
                amount = transfer.data['amount']

                if amount <= 0:
                    return JSONResponse({'message': 'amount must be greater than 0', 'success': False}, status_code=400)

                if balances[from_] < amount:
                    return JSONResponse({'message': 'insufficient funds', 'success': False}, status_code=400)

                from_balance = balances[from_] - amount
                to_balance = balances[to] + amount
                new_balances = {from_: from_balance, to: to_balance}

                account_collection.find_one_and_update({'_id': account['_id']}, {'$set': {'balances': new_balances}})
                add_transaction(type='Account Balance to Account Balance', data={
                    'from': from_, 'to': to, 'amount': amount
                })

                return JSONResponse(
                    {
                        'message': 'successfully transferred funds', 'success': True,
                        'account': {'balances': new_balances}
                    }, status_code=200
                )

            elif transfer.type == 'user:account-to-user:account':
                from_ = transfer.data['from']
                to = transfer.data['to']
                amount = transfer.data['amount']
                to_account = account_collection.find_one({'username': to})

                if amount <= 0:
                    return JSONResponse({'message': 'amount must be greater than 0', 'success': False}, status_code=400)

                if to_account:
                    if to_account['username'] == account['username']:
                        return JSONResponse({'message': 'cant transfer to yourself', 'success': False}, status_code=400)

                    if account['balances'][from_] < amount:
                        return JSONResponse({'message': 'insufficient funds', 'success': False}, status_code=400)

                    new_balance = account['balances'][from_] - amount
                    new_to_balance = to_account['balances']['bank'] + amount
                    new_balances = account['balances']
                    new_balances.update({from_: new_balance})

                    account_collection.find_one_and_update({'_id': account['_id']}, {'$set': {'balances': new_balances}})
                    account_collection.find_one_and_update({'_id': to_account['_id']}, {'$set': {'balances.bank': new_to_balance}})
                    add_transaction(type='User Account to User Account', data={
                        'from': from_, 'to': to, 'amount': amount
                    })

                    return JSONResponse(
                        {
                            'message': 'successfully transferred funds', 'success': True,
                            'account': {'balances': new_balances}
                        }, status_code=200
                    )

                else:
                    return JSONResponse({'message': 'cant find to account', 'success': False}, status_code=404)

            elif transfer.type == 'user:coin-to-user:coin':
                from_ = transfer.data['from']
                to = transfer.data['to']
                amount = transfer.data['amount']
                from_bought_coin = bought_coin_collection.find_one({'owner': account['_id'], 'name': from_})
                to_bought_coin = bought_coin_collection.find_one({'wallet': to})

                if amount < 0:
                    return JSONResponse({'message': 'amount must be greater than 0', 'success': False}, status_code=400)

                if not from_bought_coin:
                    return JSONResponse({'message': 'cant find from bought coin', 'success': False}, status_code=404)

                if not to_bought_coin:
                    return JSONResponse({'message': 'cant find to bought coin', 'success': False}, status_code=404)

                from_coin = coin_collection.find_one({'name': from_bought_coin['name']})
                to_coin = coin_collection.find_one({'name': to_bought_coin['name']})

                if not from_coin:
                    return JSONResponse({'message': 'cant find from coin', 'success': False}, status_code=404)

                if not to_coin:
                    return JSONResponse({'message': 'cant find to coin', 'success': False}, status_code=404)

                if from_bought_coin['amount'] * from_coin['price'] < amount:
                    return JSONResponse({'message': 'insufficient funds', 'success': False}, status_code=400)

                from_diff = amount / from_coin['price']
                to_dif = amount / to_coin['price']

                new_from_amount = from_bought_coin['amount'] - from_diff
                new_to_amount = to_bought_coin['amount'] + to_dif

                bought_coin_collection.find_one_and_update({'_id': from_bought_coin['_id']}, {'$set': {'amount': new_from_amount}})
                bought_coin_collection.find_one_and_update({'_id': to_bought_coin['_id']}, {'$set': {'amount': new_to_amount}})
                add_transaction(type='User Coin to User Coin', data={
                    'from': from_, 'to': to, 'amount': amount
                })

                return JSONResponse(
                    {
                        'message': 'successfully transferred funds', 'success': True,
                        'account': {'balances': account['balances']}
                    }, status_code=200
                )

            else:
                return JSONResponse({'message': 'cant find transfer type', 'success': False}, status_code=404)
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