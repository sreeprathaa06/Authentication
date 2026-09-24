const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const dbUri = process.env.MONGO_URI;

if (!dbUri) {
  console.error('MONGO_URI is missing from .env');
  process.exit(1);
}

async function fixDb() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(dbUri);
    console.log('Connected.');
    
    console.log('Attempting to drop the outdated token_1 index...');
    await mongoose.connection.collection('emailverificationtokens').dropIndex('token_1');
    console.log('✅ Successfully dropped the token_1 index.');
  } catch (e) {
    if (e.codeName === 'IndexNotFound') {
      console.log('✅ The index token_1 has already been dropped or does not exist.');
    } else {
      console.error('❌ Error:', e.message);
    }
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

fixDb();
