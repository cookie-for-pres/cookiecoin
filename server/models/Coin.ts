import mongoose from 'mongoose';

const coinSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  abbreviation: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  logs: []
}, { timestamps: true, versionKey: false });

export default mongoose.model('coins', coinSchema);