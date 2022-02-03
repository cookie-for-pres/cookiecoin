import datetime
import uuid

from config import db

account_collection = db.get_collection('accounts')
middleware_collection = db.get_collection('middlewares')
moderation_collection = db.get_collection('moderation')
logs_collection = db.get_collection('fail-logs')

class Moderation:
    def flag(self, account_id: str, reason: str):
        account = account_collection.find_one({'_id': account_id})

        if account:
            try:
                moderation_collection.insert_one({
                    '_id': str(uuid.uuid4()),
                    'accountId': account_id,
                    'reason': reason,
                    'createdAt': datetime.datetime.utcnow(),
                    'updatedAt': datetime.datetime.utcnow()
                })

            except Exception as e:
                pass

        else:
            return 'cant find account'

    def warn(self, account_id: str, reason: str):
        pass

    def blacklist(self, account_id: str, reason: str, time: int=-1):
        pass