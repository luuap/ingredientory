const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { usersRoute, initUsers } = require('./routes/users');
const { ingredientsRoute, initIngredients } = require('./routes/ingredients');

const cors = require('cors');

// Start a mongodb dev server
const mongod = new MongoMemoryServer({
  instance: {
    dbPath: './node_modules/.cache/mongodb-memory-server/mongodb-instance'
  }
});

mongod.getUri().then(uri => {
  mongoose.connect(
    uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err) => {
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