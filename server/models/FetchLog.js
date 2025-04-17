import mongoose from 'mongoose';

const fetchLogSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['ted', 'video', 'book', 'article'],
    required: true,
    unique: true,
  },
  lastFetchedAt: {
    type: Date,
    default: new Date(0) // start of time
  }
});

export default mongoose.model('FetchLog', fetchLogSchema);
