import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { usersRoute, initUsers } from './routes/users';
import { ingredientsRoute, initIngredients } from './routes/ingredients';

process.on('SIGTERM', signal => {
  console.log(`Process ${process.pid} received a SIGTERM signal`)
  process.exit(0)
})

process.on('SIGINT', signal => {
  console.log(`Process ${process.pid} has been interrupted`)
  process.exit(0)
})

const isDevelopment = process.env.NODE_ENV === 'development';
const usingInMemoryDB = process.env.IN_MEMORY_DB === 'true';

async function getDatabaseURI(): Promise<string> {
  if (isDevelopment && usingInMemoryDB) {
    // Start a mongodb dev server, downloads mongodb 4.0.14 // TODO: configure to get latest

    // Use dynamic import because mongodb-memory-server might not be installed
    const MongoMemoryServer = await import('mongodb-memory-server').then(m => m.MongoMemoryServer);

    const mongod = new MongoMemoryServer({
      instance: {
        dbPath: './node_modules/.cache/mongodb-memory-server/mongodb-instance'
      }
    });
    return await mongod.getUri();
  }

  const mongoURI = process.env.MONGO_URI; // TODO: create dockerfile for this

  if (mongoURI === undefined) {
    return Promise.reject('MONGO_URI environment variable is not set');
  }

  return mongoURI;  
}

// Note: project configurations for top-level await does not play well with ts-node https://github.com/TypeStrong/ts-node/issues/1007
//       so we will have to wrap everything in async functions for now
getDatabaseURI().then(async mongoURI => {

  const db = mongoose.connection;
  db.once('open', () => {
    
    if (isDevelopment) {
      // TODO: error handling
      initUsers();
      initIngredients();
    }

    console.log(`Connected to ${db.host}:${db.port}/${db.name}.`)
    console.log(`Collections in this databse: ${Object.keys(db.collections)}`);

  });

  // Note: need to initialize callbacks before calling connection with await
  //       because if done after, mongoose would have been connected with no callbacks defined yet
  await mongoose.connect(
    mongoURI,
    {
      // setting following options will silence deprecation warnings, idrk what they do
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  );

  const corsOptions = cors({
    origin: 'http://localhost:3000', // whitelist the dev server
    optionsSuccessStatus: 200,
  });

  const app = express();

  // TODO: token validation middleware

  app.use('/users', corsOptions, usersRoute);
  app.use('/ingredients', corsOptions, ingredientsRoute);

  app.listen('8080');

}).catch(err => {
  console.error('Stopping app due to error:');
  console.error(err);
  process.exit(1);
})

