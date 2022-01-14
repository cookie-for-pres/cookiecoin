import mongoose from 'mongoose';

const boughtCoinSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  abbreviation: { type: String, required: true },
  owner: { type: String, required: true },
  amount: { type: Number, required: true },
  wallet: { type: String, required: true }
}, { timestamps: true, versionKey: false });

export default mongoose.model('bought-coins', boughtCoinSchema);