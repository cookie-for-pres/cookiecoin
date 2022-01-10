import mongoose from 'mongoose';

const gameLogSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  playerId: { type: String, required: true },
  game: { type: String, required: true },
  status: { type: String, default: 'playing' },
  data: {}
}, { timestamps: true, versionKey: false });

export default mongoose.model('game-logs', gameLogSchema);