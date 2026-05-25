import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const fallbackString = 'mongodb+srv://OP-Apply:Saran123%23@cluster0.objtotk.mongodb.net/OP-apply?retryWrites=true&w=majority&appName=Cluster0';
    let connString = process.env.MONGODB_URI || fallbackString;

    // Force casing of the DB name in the connection string
    if (connString.includes('/op-apply')) {
      connString = connString.replace('/op-apply', '/OP-apply');
    }

    console.log('[Database] Connecting to MongoDB...');
    const conn = await mongoose.connect(connString, {
      dbName: 'OP-apply'
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] MongoDB connection failure: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
