// @flow
import mongoose from 'mongoose';
import MongodbMemoryServer from 'mongodb-memory-server';

let mongoServer;

before(async () => {
  mongoServer = new MongodbMemoryServer();
  const mongoUri = await mongoServer.getConnectionString();
  return mongoose.connect(mongoUri);
});

after(() => {
  mongoose.disconnect();
  mongoServer.stop();
});
