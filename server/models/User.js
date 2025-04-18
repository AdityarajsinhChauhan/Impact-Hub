import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  googleId: String,
  passion: { type: String, default: null },
  location: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  bio: { type: String, default: '' },
  interests: { type: [String], default: [] }
});

export default mongoose.model('User', userSchema);
