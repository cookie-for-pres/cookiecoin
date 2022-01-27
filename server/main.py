from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
import threading
import json
import time

from services import fake_coin, real_coin
from routes import *

app = FastAPI()

fake_coin_thread = threading.Thread(target=fake_coin)
fake_coin_thread.daemon = True
fake_coin_thread.start()

real_coin_thread = threading.Thread(target=real_coin)
real_coin_thread.daemon = True
real_coin_thread.start()

@app.middleware('http')
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers['X-Process-Time'] = str(process_time) + 'ms'
    response.headers['X-Best-Developer'] = 'cookie'

    return response

origins_file = open('origins.json', 'r')
origins = json.load(origins_file)
origins = [origin['url'] for origin in origins]
origins_file.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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