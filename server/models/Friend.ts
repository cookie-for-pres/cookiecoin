import mongoose from 'mongoose';

const friendsSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  friend: { type: String, required: true },
  owner: { type: String, required: true },
  accepted: { type: Boolean, default: 'requested' }
}, { timestamps: true, versionKey: false });

export default mongoose.model('friends', friendsSchema);