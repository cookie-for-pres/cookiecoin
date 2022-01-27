from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pymongo
import jwt

from config import db, SECRET_KEY

router = APIRouter(prefix='/api/admin')
account_collection = db.get_collection('accounts')
coin_collection = db.get_collection('coins')

class Dashboard(BaseModel):
    token: str

@router.post('/dashboard')
async def dashboard(dashboard: Dashboard):
    try:
        payload = jwt.decode(dashboard.token, SECRET_KEY, algorithms=['HS256'])
        account = account_collection.find_one({'_id': payload['_id']})

        if account:
            if account['type'] == 'admin' or account['type'] == 'co-owner' or account['type'] == 'owner' or account['type'] == 'developer':
                accounts = account_collection.find({})

                accounts = account_collection.find({}).sort(key_or_list='updatedAt', direction=pymongo.DESCENDING)
                accounts = [{'username': account_['username'], 'updatedAt': account_['updatedAt'].isoformat()} for account_ in accounts]

                return JSONResponse({'message': 'successfully found dashboard data', 'success': True, 'recentUsers': accounts[:5]})

            else:
                return JSONResponse({'message': 'account not permitted to use this page, incident will be reported', 'success': False}, status_code=403)
        
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