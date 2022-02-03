from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import datetime
import bcrypt
import jwt

from config import db, SECRET_KEY

router = APIRouter(prefix='/api/admin')
account_collection = db.get_collection('accounts')

class Login(BaseModel):
    username: str
    password: str
    ip: str

@router.post('/login')
async def login(login: Login):
    account = account_collection.find_one({'username': login.username})

    if account:
        if account['banned']:
            return JSONResponse({'message': 'account is banned', 'success': False}, status_code=403)

        if account['type'] == 'admin' or account['type'] == 'co-owner' or account['type'] == 'owner' or account['type'] == 'developer':
            if bcrypt.checkpw(
                    login.password.encode('utf-8'),
                    account['password'].encode('utf-8')
            ):
                token = jwt.encode({
                    '_id': account['_id'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
                }, SECRET_KEY, algorithm='HS256')

                account_collection.update_one(
                    {'_id': account['_id']},
                    {
                        '$set': {
                            'token': token, 'ip': login.ip, 
                            'updatedAt': datetime.datetime.utcnow(),
                            'lastLogin': datetime.datetime.utcnow()
                        }
                    }
                )

                return JSONResponse(
                    {'message': 'successfully logged in', 'success': True, 'token': token},
                    status_code=200
                )

            else:
                return JSONResponse({'message': 'incorrect password', 'success': False}, status_code=401)

        else:
            return JSONResponse({'message': 'account not permitted to use this page, incident will be reported', 'success': False}, status_code=403)

    else:
        return JSONResponse({'message': 'cant find account', 'success': False}, status_code=404)