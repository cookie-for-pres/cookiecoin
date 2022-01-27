from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import jwt

from config import db, SECRET_KEY

router = APIRouter(prefix='/api')
account_collection = db.get_collection('accounts')
coin_collection = db.get_collection('coins')

class Dashboard(BaseModel):
    token: str

@router.post('/dashboard')
async def dashboard(dashboard: Dashboard):
    try:
        payload = jwt.decode(dashboard.token, SECRET_KEY, algorithms=['HS256'])
        account = account_collection.find_one({'_id': payload['_id']})

        formatted_coins = []

        for coin in coin_collection.find({}):
            formatted_coins.append({
                '_id': coin['_id'],
                'name': coin['name'],
                'abbreviation': coin['abbreviation'],
                'price': coin['price']
            })

        return JSONResponse(
            {
                'message': 'successfully found dashboard data', 'success': True,
                'account': {
                    'balances': account['balances'],
                    'friends': account['friends'],
                    'boughtCoins': account['coins']
                },
                'coins': formatted_coins
            },
            status_code=200
        )

    except jwt.exceptions.DecodeError:
        return JSONResponse({'message': 'invalid token', 'success': False}, status_code=401)

    except jwt.exceptions.ExpiredSignatureError:
        return JSONResponse({'message': 'token expired', 'success': False}, status_code=401)

    except Exception as e:
        return JSONResponse(
            {'message': 'unknown error', 'error': str(e), 'success': False}, status_code=500
        )