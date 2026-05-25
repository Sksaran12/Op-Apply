import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || 'mongodb://localhost:27017/op-apply';
    console.log('[Database] Connecting to MongoDB...');
    const conn = await mongoose.connect(connString);
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failure: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
