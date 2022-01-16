import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const accountSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String, default: 'member' },
  banned: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  coins: [],
  cases: [],
  friends: [],
  blocked: [],
  transactions: [],
  balances: {
    cash: { type: Number, default: 100.00 },
    bank: { type: Number, default: 200.00 }
  }
}, { timestamps: true, versionKey: false });

accountSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = bcryptjs.hashSync(this.password, 12);
  next();
});

accountSchema.methods.comparePassword = function (plaintext, callback) {
  return callback(null, bcryptjs.compareSync(plaintext, this.password));
}

export default mongoose.model('accounts', accountSchema);