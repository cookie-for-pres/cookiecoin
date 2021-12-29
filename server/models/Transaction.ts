import mongoose from 'mongoose';

const transactionsSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  slug: { type: String, required: true },
  type: { type: String, required: true },
  data: { type: Object, required: true }
}, { timestamps: true, versionKey: false });
