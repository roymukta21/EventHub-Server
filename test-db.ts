import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected ✅');
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

testConnection();