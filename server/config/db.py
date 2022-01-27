import pymongo
import dotenv

from .config import MONGO_URI

dotenv.load_dotenv()

client = pymongo.MongoClient(MONGO_URI)
db = client.get_database('cookiecoin')