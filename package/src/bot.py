import pymongo
import dotenv
import os

dotenv.load_dotenv()

class Bot:
    def __init__(self, prefix: str='!'):
        self.prefix = prefix
        self.client = pymongo.MongoClient(os.environ.get('MONGO_URI'))
        self.database = self.client.get_database('cookiecoin')
        self.account_collection = self.database.get_collection('accounts')
        self.admin_login_token_collection = self.database.get_collection('admin-login-tokens')
        self.middleware_collection = self.database.get_collection('middlewares')

        self.shutdown_id = os.environ.get('SHUTDOWN_ID')

    def login(self, login_token: str):
        token = self.admin_login_token_collection.find_one({'token': login_token})

        if token:
            return {
                'message': 'successfully logged in',
                'username': token['username']
            }
        
        else:
            return {'message': 'error logging in'}

    def handle_command(self, command: str, args: list):
        if command.startswith(self.prefix) and args[0].startswith(self.prefix):
            args[0] = args[0].replace(self.prefix, '')

            if args[0] == 'verify':
                try:
                    account = self.account_collection.find_one_and_update(
                    {'username': args[1]}, {'$set': {'verified': True}})

                    if account:
                        return {'message': 'account verified.'}

                    else:
                        return {'message': 'cant find account.'}
                
                except IndexError:
                    return {'message': 'username is a required field.'}
            
            elif args[0] == 'ban':
                try:
                    account = self.account_collection.find_one({'username': args[1]})

                    if not account['banned']:
                        account = self.account_collection.find_one_and_update(
                            {'username': args[1]}, {'$set': {'banned': True}})

                        if account:
                            return {'message': 'account banned.'}

                        else:
                            return {'message': 'cant find account.'}

                    else:
                        return {'message': 'account already banned.'}
                
                except IndexError:
                    return {'message': 'username is a required field.'}

            elif args[0] == 'unban':
                try:
                    account = self.account_collection.find_one({'username': args[1]})

                    if account['banned']:
                        account = self.account_collection.find_one_and_update(
                            {'username': args[1]}, {'$set': {'banned': False}})

                        if account:
                            return {'message': 'account unbanned.'}

                        else:
                            return {'message': 'cant find account.'}
                    
                    else:
                        return {'message': 'account already unbanned.'}
                
                except IndexError:
                    return {'message': 'username is a required field.'}

            elif args[0] == 'edit':
                pass

            elif args[0] == 'promote':
                try:
                    account_data = self.account_collection.find_one({'username': args[1]})

                    if account_data:
                        if account_data['type'] == 'member':
                            account = self.account_collection.find_one_and_update(
                                {'username': args[1]}, {'$set': {'type': 'admin'}})

                            if account:
                                return {'message': 'promoted account to admin.'}

                            else:
                                return {'message': 'cant find account.'}
                    
                        elif account_data['type'] == 'admin':
                            account = self.account_collection.find_one_and_update(
                                {'username': args[1]}, {'$set': {'type': 'co-owner'}})

                            if account:
                                return {'message': 'promoted account to co-owner.'}

                            else:
                                return {'message': 'cant find account.'}

                        elif account_data['type'] == 'co-owner':
                            account = self.account_collection.find_one_and_update(
                                {'username': args[1]}, {'$set': {'type': 'owner'}})

                            if account:
                                return {'message': 'promoted account to owner.'}

                            else:
                                return {'message': 'cant find account.'}

                        elif account_data['type'] == 'owner':
                            return {'message': 'account type already max (owner).'}

                    else:
                        return {'message': 'cant find account.'}

                except IndexError:
                    return {'message': 'username is a required field.'}

            elif args[0] == 'demote':
                try:
                    account_data = self.account_collection.find_one({'username': args[1]})

                    if account_data:
                        if account_data['type'] == 'member':
                            return {'message': 'account already min (member).'}
                    
                        elif account_data['type'] == 'admin':
                            account = self.account_collection.find_one_and_update(
                                {'username': args[1]}, {'$set': {'type': 'member'}})

                            if account:
                                return {'message': 'demoted account to member.'}

                            else:
                                return {'message': 'cant find account.'}

                        elif account_data['type'] == 'co-owner':
                            account = self.account_collection.find_one_and_update(
                                {'username': args[1]}, {'$set': {'type': 'admin'}})

                            if account:
                                return {'message': 'demoted account to admin.'}

                            else:
                                return {'message': 'cant find account.'}

                        elif account_data['type'] == 'owner':
                            account = self.account_collection.find_one_and_update(
                                {'username': args[1]}, {'$set': {'type': 'co-owner'}})

                            if account:
                                return {'message': 'demoted account to co-owner.'}

                            else:
                                return {'message': 'cant find account.'}

                    else:
                        return {'message': 'cant find account.'}

                except IndexError:
                    return {'message': 'username is a required field.'}

            elif args[0] == 'protocol':
                try:
                    protocol = args[1]
                    active = args[2]

                    if protocol == 'shutdown':
                        shutdown = self.middleware_collection.find_one({'_id': self.shutdown_id})

                        if shutdown['active']:
                            if active == 'off':
                                self.middleware_collection.find_one_and_update({'_id': self.shutdown_id}, {'$set': {'active': False}})
                                return {'message': 'shutdown protocol deactivated.'}

                            else:
                                return {'message': 'shutdown protocol is already active.'}

                        else:
                            if active == 'on':
                                self.middleware_collection.find_one_and_update({'_id': self.shutdown_id}, {'$set': {'active': True}})
                                return {'message': 'shutdown protocol activated.'}

                            else:
                                return {'message': 'shutdown protocol is already not active.'}

                except IndexError:
                    return {'message': 'protocol and status is a required field.'}

            elif args[0] == 'exit':
                return {'message': '[EXIT]'}

            else:
                return {'message': 'invalid command.'}

        else:
            return {'message': 'invalid command.'}