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
                account = self.account_collection.find_one_and_update(
                    {'username': args[1]}, {'verified': True})

                if account:
                    return {'message': 'account verified.'}

                else:
                    return {'message': 'cant find account.'}
            
            elif args[0] == 'ban':
                account = self.account_collection.find_one_and_update(
                    {'username': args[1]}, {'banned': True})

                if account:
                    return {'message': 'account banned.'}

                else:
                    return {'message': 'cant find account.'}

            elif args[0] == 'unban':
                account = self.account_collection.find_one_and_update(
                    {'username': args[1]}, {'banned': False})

                if account:
                    return {'message': 'account unbanned.'}

                else:
                    return {'message': 'cant find account.'}

            elif args[0] == 'edit':
                pass

            elif args[0] == 'promote':
                account_data = self.account_collection.find_one({'username': args[1]})

                if account_data:
                    if account_data['type'] == 'member':
                        account = self.account_collection.find_one_and_update(
                            {'username': args[1]}, {'type': 'admin'})

                        if account:
                            return {'message': 'promoted account to admin.'}

                        else:
                            return {'message': 'cant find account.'}
                
                    elif account_data['type'] == 'admin':
                        account = self.account_collection.find_one_and_update(
                            {'username': args[1]}, {'type': 'co-owner'})

                        if account:
                            return {'message': 'promoted account to co-owner.'}

                        else:
                            return {'message': 'cant find account.'}

                    elif account_data['type'] == 'co-owner':
                        account = self.account_collection.find_one_and_update(
                            {'username': args[1]}, {'type': 'owner'})

                        if account:
                            return {'message': 'promoted account to admin.'}

                        else:
                            return {'message': 'cant find account.'}

                    elif account_data['type'] == 'owner':
                        return {'message': 'account type already max (owner).'}

                else:
                    return {'message': 'cant find account.'}

            elif args[0] == 'demote':
                account_data = self.account_collection.find_one({'username': args[1]})

                if account_data:
                    if account_data['type'] == 'member':
                        return {'message': 'account already min (member).'}
                
                    elif account_data['type'] == 'admin':
                        account = self.account_collection.find_one_and_update(
                            {'username': args[1]}, {'type': 'member'})

                        if account:
                            return {'message': 'demoted account to member.'}

                        else:
                            return {'message': 'cant find account.'}

                    elif account_data['type'] == 'co-owner':
                        account = self.account_collection.find_one_and_update(
                            {'username': args[1]}, {'type': 'admin'})

                        if account:
                            return {'message': 'demoted account to admin.'}

                        else:
                            return {'message': 'cant find account.'}

                    elif account_data['type'] == 'owner':
                        account = self.account_collection.find_one_and_update(
                            {'username': args[1]}, {'type': 'co-owner'})

                        if account:
                            return {'message': 'demoted account to co-owner.'}

                        else:
                            return {'message': 'cant find account.'}

                else:
                    return {'message': 'cant find account.'}

            elif args[0] == 'exit':
                return {'message': '[EXIT]'}

            else:
                return {'message': 'invalid command.'}

        else:
            return {'message': 'invalid command.'}