import datetime
import uuid

from config import db

fail_log = db.get_collection('fail-logs')

class Logger:
    def create(self, log_type: str, data: dict) -> dict:
        if type == 'fail':
            try:
                fail_log.insert_one({
                    '_id': str(uuid.uuid4()),
                    'type': log_type,
                    'data': data,
                    'createdAt': datetime.datetime.utcnow(),
                    'updatedAt': datetime.datetime.utcnow()
                })

                return {'status': 'created'}

            except Exception as e:
                return {'status': 'error', 'message': str(e)}

    def find(self, _id: str) -> dict:
        try:
            log = fail_log.find_one({'_id': _id})

            if log:
                return {'status': 'found', 'data': log}

            return {'status': 'not found'}

        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    def update(self, _id: str, data: dict) -> dict:
        try:
            fail_log.update_one({'_id': _id}, {'$set': data})

            return {'status': 'updated'}

        except Exception as e:
            return {'status': 'error', 'message': str(e)}

    def delete(self, _id: str) -> dict:
        try:
            fail_log.delete_one({'_id': _id})

            return {'status': 'deleted'}

        except Exception as e:
            return {'status': 'error', 'message': str(e)}