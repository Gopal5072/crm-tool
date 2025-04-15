import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Sales', 'Founder'],
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
