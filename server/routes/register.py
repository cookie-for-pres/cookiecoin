from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from eth_account import Account
import datetime
import secrets
import bcrypt
import uuid

from config import db

router = APIRouter(prefix='/api')
account_collection = db.get_collection('accounts')
coin_collection = db.get_collection('coins')
bought_coin_collection = db.get_collection('bought-coins')

class Register(BaseModel):
    username: str
    password: str
    email: str

@router.post('/register')
async def register(register: Register):
    try:
        if account_collection.find_one({'username': register.username}):
            return JSONResponse({'message': 'username already exists', 'success': False}, status_code=400)

        if account_collection.find_one({'email': register.email}):
            return JSONResponse({'message': 'email already exists', 'success': False}, status_code=400)

        hashed_password = bcrypt.hashpw(register.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        account_id = str(uuid.uuid4())
        bought_coin_list = []

        for coin in coin_collection.find({}):
            wallet = Account.from_key(f'0x{secrets.token_hex(32)}').address
            bought_coin_id = str(uuid.uuid4())

            bought_coin_collection.insert_one({
                '_id': bought_coin_id,
                'name': coin['name'],
                'abbreviation': coin['abbreviation'],
                'owner': account_id,
                'amount': 0,
                'wallet': wallet,
                'createdAt': datetime.datetime.utcnow(),
                'updatedAt': datetime.datetime.utcnow()
            })

            bought_coin_list.append({'_id': bought_coin_id})

        account_collection.insert_one({
            '_id': account_id,
            'username': register.username,
            'email': register.email,
            'password': hashed_password,
            'type': 'member',
            'banned': False,
            'verified': False,
            'online': False,
            'coins': bought_coin_list,
            'cases': [],
            'friends': [],
            'blocked': [],
            'transactions': [],
            'balances': {'cash': 200, 'bank': 200},
            'ip': '',
            'token': '',
            'lastLogin': '',
            'createdAt': datetime.datetime.utcnow(),
            'updatedAt': datetime.datetime.utcnow()
        })

        return JSONResponse({'message': 'successfully registered account', 'success': True}, status_code=201)

    except Exception as e:
        return JSONResponse(
            {'message': 'unknown error', 'error': str(e), 'success': False}, status_code=500
        )