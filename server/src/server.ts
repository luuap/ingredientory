import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { usersRoute, initUsers } from './routes/users';
import { ingredientsRoute, initIngredients } from './routes/ingredients';

// Start a mongodb dev server
const mongod = new MongoMemoryServer({
  instance: {
    dbPath: './node_modules/.cache/mongodb-memory-server/mongodb-instance'
  }
});

mongod.getUri().then((uri: any) => {
  mongoose.connect(
    uri,
    {
      // setting following options will silence deprecation warnings, idrk what they do
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
    (err: any) => {
      if (err) {
        console.log('Cannot connect to database');
      } else {
        console.log('Connected to database');
      }
    }
  );
});

const db = mongoose.connection;
db.once('open', () => {
  // TODO only in development mode
  initUsers();
  initIngredients();
});

const corsOptions = cors({
  origin: 'http://localhost:3000', // whitelist the dev server
  optionsSuccessStatus: 200,
});

const app = express();

app.use('/users', corsOptions, usersRoute);
app.use('/ingredients', corsOptions, ingredientsRoute);


app.listen('8080');

// process.on('SIGTERM', () => console.log('SIGTERM'));
// process.on('SIGINT', () => console.log('SIGINT'));