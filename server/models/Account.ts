import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const accountSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  banned: { type: Boolean, required: true },
  type: { type: String, default: 'member' },
  verified: { type: Boolean, default: false },
  verify_code: { type: String, default: '' },
  coins: [],
  cases: [],
  balances: {
    cash: { type: Number, default: 100.00 },
    bank: { type: Number, default: 100.00 },
    interest: { type: Number, default: 1.00 }
  }
}, { timestamps: true, versionKey: false });

accountSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isModified('verify_code')) {
    return next();
  }

  this.verify_code = (Math.random() + 1).toString(36).substring(7);
  this.password = bcryptjs.hashSync(this.password, 12);
  next();
});

export default mongoose.model('accounts', accountSchema);