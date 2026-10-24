import mongoose from 'mongoose';
export async function connectDB() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required. Copy server/.env.example to server/.env and configure Atlas.');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB connected');
}
