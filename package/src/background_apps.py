from datetime import datetime
import threading
import requests
import pymongo
import random
import pusher
import dotenv
import uuid
import time
import os

dotenv.load_dotenv()

class BackgrounApps:
    def __init__(self):
        self.client = pymongo.MongoClient(os.environ.get('MONGO_URI'))
        self.database = self.client.get_database('cookiecoin')
        self.coin_collection = self.database.get_collection('coins')
        self.background_app_log_collection = self.database.get_collection('background-application-logs')
        self.crypto_api_key = os.environ.get('CRYPTO_API_KEY')

        self.pusher_client = pusher.Pusher(
            app_id=os.environ.get('PUSHER_APP_ID'), key=os.environ.get('PUSHER_KEY'), 
            secret=os.environ.get('PUSHER_SECRET'), cluster=os.environ.get('PUSHER_CLUSTER')
        )

    def live_coin_update(self):
        while True:
            url = 'https://coingecko.p.rapidapi.com/simple/price'
            params = {'ids': 'bitcoin,ethereum,dogecoin', 'vs_currencies': 'usd'}
            headers = {
                'x-rapidapi-host': 'coingecko.p.rapidapi.com', 
                'x-rapidapi-key': 'b94414038cmshb3205d6a0c31a45p12c9bejsn2a77d0ffa6a1'
            }

            res = requests.get(url=url, params=params, headers=headers)
            res = res.json()
            
            try:
                current_btc = self.coin_collection.find_one({'abbreviation': 'BTC'})
                current_eth = self.coin_collection.find_one({'abbreviation': 'ETH'})
                current_doge = self.coin_collection.find_one({'abbreviation': 'DOGE'})

                self.coin_collection.find_one_and_update({'abbreviation': 'BTC'}, {
                    '$set': {'price': round(res['bitcoin']['usd'], 2)}, 
                    '$push': {'logs': {'price': current_btc['price'], 'date': datetime.now().isoformat()}}
                })
                self.coin_collection.find_one_and_update({'abbreviation': 'ETH'}, {
                    '$set': {'price': round(res['ethereum']['usd'], 2)}, 
                    '$push': {'logs': {'price': current_eth['price'], 'date': datetime.now().isoformat()}}
                })
                self.coin_collection.find_one_and_update({'abbreviation': 'DOGE'}, {
                    '$set': {'price': round(res['dogecoin']['usd'], 2)}, 
                    '$push': {'logs': {'price': current_doge['price'], 'date': datetime.now().isoformat()}}
                })
                
                self.pusher_client.trigger('coins', 'update', {})
                self.pusher_client.trigger('coin', 'update', {})

            except Exception as e:
                self.background_app_log_collection.insert_one({
                    '_id': str(uuid.uuid4()), 
                    'description': 'failed to get/insert/update bitcoin, ethereum, or dogecoin prices.',
                    'error': str(e),
                    'createdAt': datetime.now().isoformat(),
                    'updatedAt': datetime.now().isoformat()   
                })

            time.sleep(300)

    def other_coin_update(self):
        while True:
            try:
                current_cec = self.coin_collection.find_one({'abbreviation': 'CEC'})
                current_bpm = self.coin_collection.find_one({'abbreviation': 'BPM'})
                current_lvc = self.coin_collection.find_one({'abbreviation': 'ŁVC'})

                new_price_cec = round(random.uniform(-1, 1), 2) + current_cec['price']
                new_price_bpm = round(random.uniform(-1, 1), 2) + current_bpm['price']
                new_price_lvc = round(random.uniform(-1, 1), 2) + current_lvc['price']

                self.coin_collection.find_one_and_update({'abbreviation': 'CEC'}, {
                    '$set': {'price': new_price_cec}, 
                    '$push': {'logs': {'price': new_price_cec, 'date': datetime.now().isoformat()}}
                })
                self.coin_collection.find_one_and_update({'abbreviation': 'BPM'}, {
                    '$set': {'price': new_price_bpm}, 
                    '$push': {'logs': {'price': new_price_bpm, 'date': datetime.now().isoformat()}}
                })
                self.coin_collection.find_one_and_update({'abbreviation': 'ŁVC'}, {
                    '$set': {'price': new_price_lvc}, 
                    '$push': {'logs': {'price': new_price_lvc, 'date': datetime.now().isoformat()}}
                })

                self.pusher_client.trigger('coins', 'update', {})
                self.pusher_client.trigger('coin', 'update', {})

            except Exception as e:
                self.background_app_log_collection.insert_one({
                    '_id': str(uuid.uuid4()), 
                    'description': 'failed to get/insert/update cookiecoin, big pik man, or lv coin prices.',
                    'error': str(e),
                    'createdAt': datetime.now().isoformat(),
                    'updatedAt': datetime.now().isoformat()   
                })

            time.sleep(300)

    def anti_cheat(self):
        pass

    def start(self):
        threading.Thread(target=self.live_coin_update).start()
        threading.Thread(target=self.other_coin_update).start()
        # threading.Thread(target=self.anti_cheat).start()

ba = BackgrounApps()
ba.start()