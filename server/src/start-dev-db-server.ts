import fs from 'fs';
import { MongoMemoryServer } from 'mongodb-memory-server';

/**
 * Starts an in-memory mongodb dev server, and sets some environemnt variables 
 * Downloads mongodb 4.0.14 // TODO: configure to get latest
 */
(async () => {
  
  // Create the directory for the instance
  const instanceDir = 'node_modules/.cache/mongodb-memory-server/mongodb-instance';
  if (!fs.existsSync(instanceDir)) {
    fs.mkdirSync(instanceDir);
  }

  const mongod = new MongoMemoryServer({
    instance: {
      dbPath: instanceDir,
    }
  });
 
  process.env.MONGO_URI = await mongod.getUri(); // mongod.getUri() calls mongod.ensureInstance() that internally starts the db
})()

process.env.INIT_DB = 'true';
