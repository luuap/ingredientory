import { Server } from 'http';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { usersRoute, initUsers } from './routes/users';
import { ingredientsRoute, initIngredients } from './routes/ingredients';

let server: Server;

const isDevelopment = process.env.NODE_ENV === 'development';
const initDB = process.env.INIT_DB === 'true';

async function getDatabaseURI(): Promise<string> {

  // Poll every second during development to account for possible race condition where server 
  // will try to connect before db has finished starting up due to unfavorable task scheduling or first set-up (downloading mongodb binaries)
  if (isDevelopment) {
    let seconds = 0;
    while (process.env.MONGO_URI === undefined && seconds < 7200) { // 2h limit
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      seconds += 1;
    }
  }

  return process.env.MONGO_URI ?? Promise.reject('MONGO_URI environment variable is not set');
}

// Note: project configurations for top-level await does not play well with ts-node https://github.com/TypeStrong/ts-node/issues/1007
//       so we will have to wrap everything in async functions for now
getDatabaseURI().then(async mongoURI => {

  const db = mongoose.connection;
  db.once('open', () => {
    
    if (initDB) {
      // TODO: error handling
      initUsers();
      initIngredients();
    }

    console.log(`Connected to ${db.host}:${db.port}/${db.name}`)
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

  server = app.listen('8080');

}).catch(err => {
  console.error('Stopping app due to error:');
  console.error(err);
  process.exit(1);
});

process.on('SIGINT', terminateApp);
process.on('exit', exitHandler);


function terminateApp(signalOrCode: NodeJS.Signals | number) {

  if (typeof signalOrCode === 'string') {
    console.log(`Process ${process.pid} received a ${signalOrCode} signal`);
  }

  server.close(() => {
    mongoose.connection?.close(() => {
      console.log('Disconnected from DB');
    });
    console.log('Closing app http server');
  });

}

function exitHandler(exitCode: number) {
  console.log(`Exiting with code ${exitCode}`);
}
