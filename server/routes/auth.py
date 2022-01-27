from pydantic import BaseModel
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import jwt

from config import db, SECRET_KEY

router = APIRouter(prefix='/api/auth')
account_collection = db.get_collection('accounts')

class AuthToken(BaseModel):
    token: str

@router.post('/token')
async def auth_token(auth_token: AuthToken):
    try:
        payload = jwt.decode(auth_token.token, SECRET_KEY, algorithms=['HS256'])
        account = account_collection.find_one({'_id': payload['_id']})

        if account:
            return JSONResponse(
                {'message': 'token verified', 'success': True}, status_code=200
            )

        else:
            return JSONResponse(
                {'message': 'token not verified', 'success': False}, status_code=400
            )
            
    except:
        return JSONResponse(
            {'message': 'token not verified', 'success': False}, status_code=400
        )