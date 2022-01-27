import dotenv
import os

dotenv.load_dotenv()

MONGO_URI = os.getenv('MONGO_URI')
SECRET_KEY = os.getenv('SECRET_KEY')
CRYPTO_API_KEY = os.getenv('CRYPTO_API_KEY')