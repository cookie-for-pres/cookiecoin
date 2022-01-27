import mongoose from 'mongoose';

const middlewareSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  active: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false });

export default mongoose.model('middlewares', middlewareSchema);