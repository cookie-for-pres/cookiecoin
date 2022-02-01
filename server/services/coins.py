import datetime
import requests
import random
import time

from config import db, CRYPTO_API_KEY

coin_collection = db.get_collection('coins')

def fake_coin():
    while True:
        cec = coin_collection.find_one({'abbreviation': 'CEC'})
        lvc = coin_collection.find_one({'abbreviation': 'ŁVC'})
        bpm = coin_collection.find_one({'abbreviation': 'BPM'})
        s4y = coin_collection.find_one({'abbreviation': '420'})
        boof = coin_collection.find_one({'abbreviation': 'BOOF'})
        shr = coin_collection.find_one({'abbreviation': 'SHR'})

        cec['price'] = cec['price'] + random.uniform(-12, 12)
        lvc['price'] = lvc['price'] + random.uniform(-12, 12)
        bpm['price'] = bpm['price'] + random.uniform(-12, 12)
        s4y['price'] = s4y['price'] + random.uniform(-12, 12)
        boof['price'] = boof['price'] + random.uniform(-12, 12)
        shr['price'] = shr['price'] + random.uniform(-12, 12)

        if len(cec['logs']) > 1000: cec['logs'] = []
        if len(lvc['logs']) > 1000: lvc['logs'] = []
        if len(bpm['logs']) > 1000: bpm['logs'] = []
        if len(s4y['logs']) > 1000: s4y['logs'] = []
        if len(boof['logs']) > 1000: boof['logs'] = []
        if len(shr['logs']) > 1000: shr['logs'] = []

        cec['logs'].append({'price': cec['price'], 'time': datetime.datetime.now()})
        lvc['logs'].append({'price': lvc['price'], 'time': datetime.datetime.now()})
        bpm['logs'].append({'price': bpm['price'], 'time': datetime.datetime.now()})
        s4y['logs'].append({'price': s4y['price'], 'time': datetime.datetime.now()})
        boof['logs'].append({'price': boof['price'], 'time': datetime.datetime.now()})
        shr['logs'].append({'price': shr['price'], 'time': datetime.datetime.now()})

        coin_collection.update_one(
            {'abbreviation': 'CEC'}, 
            {'$set': {'price': cec['price'], 'logs': cec['logs']}}
        )

        coin_collection.update_one(
            {'abbreviation': 'ŁVC'},
            {'$set': {'price': lvc['price'], 'logs': lvc['logs']}}
        )

        coin_collection.update_one(
            {'abbreviation': 'BPM'},
            {'$set': {'price': bpm['price'], 'logs': bpm['logs']}}
        )

        coin_collection.update_one(
            {'abbreviation': '420'},
            {'$set': {'price': s4y['price'], 'logs': s4y['logs']}}
        )

        coin_collection.update_one(
            {'abbreviation': 'BOOF'},
            {'$set': {'price': boof['price'], 'logs': boof['logs']}}
        )

        coin_collection.update_one(
            {'abbreviation': 'SHR'},
            {'$set': {'price': shr['price'], 'logs': shr['logs']}}
        )

        time.sleep(300)

def real_coin():
    while True:
        btc = coin_collection.find_one({'abbreviation': 'BTC'})
        eth = coin_collection.find_one({'abbreviation': 'ETH'})
        ltc = coin_collection.find_one({'abbreviation': 'LTC'})

        url = 'https://coingecko.p.rapidapi.com/simple/price'
        params = {'ids': 'bitcoin,ethereum,litecoin', 'vs_currencies': 'usd'}
        headers = {'x-rapidapi-host': 'coingecko.p.rapidapi.com', 'x-rapidapi-key': str(CRYPTO_API_KEY)}

        response = requests.get(url, headers=headers, params=params)
        data = response.json()

        btc['price'] = data['bitcoin']['usd']
        eth['price'] = data['ethereum']['usd']
        ltc['price'] = data['litecoin']['usd']

        if len(btc['logs']) > 1000: btc['logs'] = []
        if len(eth['logs']) > 1000: eth['logs'] = []
        if len(ltc['logs']) > 1000: ltc['logs'] = []

        btc['logs'].append({'price': btc['price'], 'time': datetime.datetime.now()})
        eth['logs'].append({'price': eth['price'], 'time': datetime.datetime.now()})
        ltc['logs'].append({'price': ltc['price'], 'time': datetime.datetime.now()})

        coin_collection.update_one(
            {'abbreviation': 'BTC'},
            {'$set': {'price': btc['price'], 'logs': btc['logs']}}
        )

        coin_collection.update_one(
            {'abbreviation': 'ETH'},
            {'$set': {'price': eth['price'], 'logs': eth['logs']}}
        )

        coin_collection.update_one(
            {'abbreviation': 'LTC'},
            {'$set': {'price': ltc['price'], 'logs': ltc['logs']}}
        )

        time.sleep(300)
