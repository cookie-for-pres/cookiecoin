import dotenv from 'dotenv';

dotenv.config();

export default {
  mongoUri: process.env.MONGO_URI,
  port: process.env.PORT,
  cecId: process.env.CEC_ID,
  shutdownId: process.env.SHUTDOWN_ID,
  cryptoApiKey: process.env.CRYPTO_API_KEY,
  pusher: {
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true
  }
}