import mongoose from 'mongoose';

export default async function connectDB(uri: string) {
  try {
    await mongoose.connect(uri);
    console.log('✔️  MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}