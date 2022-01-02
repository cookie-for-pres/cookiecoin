import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  display: { type: Boolean, required: true },
  data: { type: Object, required: true }
}, { timestamps: true, versionKey: false });

export default mongoose.model('games', gameSchema);