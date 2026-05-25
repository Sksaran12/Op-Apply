import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const fallbackString = 'mongodb+srv://OP-Apply:Saran123%23@cluster0.objtotk.mongodb.net/OP-apply?retryWrites=true&w=majority&appName=Cluster0';
    let connString = process.env.MONGODB_URI || fallbackString;

    // Parse and override the database name in the connection string URI to match Atlas' casing exactly
    try {
      if (connString.startsWith('mongodb+srv://') || connString.startsWith('mongodb://')) {
        const urlObj = new URL(connString);
        urlObj.pathname = '/OP-apply';
        connString = urlObj.toString();
      }
    } catch (e) {
      console.error('[Database URI parse error]', e.message);
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
