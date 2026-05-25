import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const fallbackString = 'mongodb+srv://OP-Apply:Saran123%23@cluster0.objtotk.mongodb.net/op-apply?retryWrites=true&w=majority&appName=Cluster0';
    const connString = process.env.MONGODB_URI || fallbackString;
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
