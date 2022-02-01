from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
import threading
import uvicorn
import time

from services import fake_coin, real_coin
from routes import *

app = FastAPI()

threading.Thread(target=fake_coin).start()
threading.Thread(target=real_coin).start()

@app.middleware('http')
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers['X-Process-Time'] = str(process_time) + 'ms'
    response.headers['X-Best-Developer'] = 'cookie'

    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(login_router)
app.include_router(register_router)
app.include_router(dashboard_router)
app.include_router(games_router)
app.include_router(coins_router)
app.include_router(portfolio_router)
app.include_router(leaderboard_router)
app.include_router(account_router)
app.include_router(coinflip_router)
app.include_router(blackjack_router)
app.include_router(auth_router)

app.include_router(admin_login_router)
app.include_router(admin_dashboard_router)

if __name__ == '__main__':
    uvicorn.run(
        'main:app', 
        host='0.0.0.0', 
        port=5500, 
        reload=True,    
        workers=3
    )