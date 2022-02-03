from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, Depends
from fastapi.responses import JSONResponse
import threading
import uvicorn
import time
import jwt

from services import fake_coin, real_coin
from config import db, SECRET_KEY
from routes import *

app = FastAPI()
middleware_collection = db.get_collection('middlewares')
account_collection = db.get_collection('accounts')

threading.Thread(target=fake_coin).start()
threading.Thread(target=real_coin).start()

@app.middleware('http')
async def set_process_time(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers['X-Process-Time'] = str(process_time) + 'ms'
    response.headers['X-Best-Developer-Every'] = 'cookie'

    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

async def token_check(request: Request):
    non_check = ['login', 'register', 'home', 'leaderboard']
    for check in non_check:
        if check not in str(request.url):
            body = await request.json()
            token = body['token']

            if account_collection.find_one({'token': token}) is None:
                return JSONResponse({'message': 'cant find account', 'success': False}, status_code=401)

            if account_collection.find_one({'token': token})['banned']:
                return JSONResponse({'message': 'banned', 'success': False}, status_code=401)

            try:
                jwt.decode(token, SECRET_KEY, algorithms=['HS256'])

            except jwt.ExpiredSignatureError:
                return JSONResponse({'message': 'token expired', 'success': False}, status_code=401)

            except jwt.InvalidTokenError:
                return JSONResponse({'message': 'invalid token', 'success': False}, status_code=401)

app.include_router(login_router)
app.include_router(register_router)
app.include_router(leaderboard_router)
app.include_router(dashboard_router, dependencies=[Depends(token_check)])
app.include_router(games_router, dependencies=[Depends(token_check)])
app.include_router(coins_router, dependencies=[Depends(token_check)])
app.include_router(portfolio_router, dependencies=[Depends(token_check)])
app.include_router(account_router, dependencies=[Depends(token_check)])
app.include_router(coinflip_router, dependencies=[Depends(token_check)])
app.include_router(blackjack_router, dependencies=[Depends(token_check)])
app.include_router(auth_router, dependencies=[Depends(token_check)])

app.include_router(admin_login_router, dependencies=[Depends(token_check)])
app.include_router(admin_dashboard_router, dependencies=[Depends(token_check)])

if __name__ == '__main__':
    uvicorn.run(
        'main:app', 
        host='0.0.0.0', 
        port=5500, 
        workers=1,
        reload=True
    )