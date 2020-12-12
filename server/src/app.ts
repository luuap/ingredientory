import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import { usersRoute, initUsers } from './routes/users';
import { ingredientsRoute, initIngredients } from './routes/ingredients';

const initDB = process.env.INIT_DB === 'true';

class Ingredientory {

  server: express.Express;
  db: mongoose.Connection;

  constructor(server: express.Express, db: mongoose.Connection) {
    this.server = server;
    this.db = db;
  }

  listen(port: number, callback?: () => void): http.Server {
    const server = this.server.listen(port, callback);
    server.on('close', () => {
      this.db.close(() => {
        console.log('Disconnected from DB');
      })
    });
    return server;
  }

}
export type { Ingredientory };

let app: Ingredientory;

export async function createApp(mongoURI: string): Promise<Ingredientory> {

  if (!app) {

    const corsOptions = cors({
      origin: 'http://localhost:3000', // whitelist the dev server
      optionsSuccessStatus: 200,
    });

    const server = express();

    server.use('/users', corsOptions, usersRoute);
    server.use('/ingredients', corsOptions, ingredientsRoute);

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

    app = new Ingredientory(server, db);
  }

  return app;
}

