from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import jwt

from config import db, SECRET_KEY

router = APIRouter(prefix='/api/account')
account_collection = db.get_collection('accounts')
coin_collection = db.get_collection('coins')
bought_coins_collection = db.get_collection('bought-coins')

class Balances(BaseModel):
    token: str

@router.post('/balances')
async def balances(balances: Balances):
    payload = jwt.decode(balances.token, SECRET_KEY, algorithms=['HS256'])
    account = account_collection.find_one({'_id': payload['_id']})

    if account:
        return JSONResponse(
            {'message': 'successfully found balances', 'success': True, 'balances': account['balances']}, 
            status_code=200
        )

    else:
        return JSONResponse(
            {'message': 'cant find account', 'success': False}, status_code=404
        )
