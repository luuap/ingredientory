import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import * as User from './routes/users';
import * as Ingredient from './routes/ingredients';

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

    console.log(`Connecting to ${mongoURI}...`);
    const db = mongoose.createConnection(mongoURI, {
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // and MongoDB driver buffering
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
      
    await db.then(() => {
      console.log(`Connected to ${db.host}:${db.port}/${db.name}`)
    })

    const server = express();

    server.use(cors()); // TODO: more granular cors options
    server.use('/users', User.createRoute(db));
    server.use('/ingredients', Ingredient.createRoute(db));

    if (initDB) {
      // TODO: error handling
      console.log(`Initializing DB...`);
      await User.init(db);
      await Ingredient.init(db);
    }

    console.log(`Collections in this databse: ${Object.keys(db.collections)}`);

    app = new Ingredientory(server, db);
  }

  return app;
}

