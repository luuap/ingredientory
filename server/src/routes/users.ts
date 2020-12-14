import express, { Router } from 'express';
import { Connection } from 'mongoose'
import { User } from '../schemas/User';

export function createRoute(connection: Connection): Router {

  const route = express.Router();
  const userModel = connection.model(User.name, User.schema, User.collection);

  route.get('/', async (req, res) => {
    const testQuery = await userModel.find({});
    res.send(testQuery);
  });

  route.get('/', async (req, res) => {
    const testQuery = await userModel.find({});
    res.send(testQuery);

  });

  return route;

}

export async function init(connection: Connection): Promise<void> {

  const userModel = connection.model(User.name, User.schema, User.collection);

  await userModel.deleteMany({}).then(() => {
    console.log('Cleared users');
  });

  await userModel.insertMany(
    [
      { name: 'John Doe' },
    ],
  ).then(async () => {
    const count = await userModel.countDocuments({});
    console.log(`DB seeded with users, ${count} documents added`);
  });
}