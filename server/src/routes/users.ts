import express from 'express';
import { User } from '../models/User';

export const usersRoute = express.Router();

usersRoute.get('/', async (req, res) => {
  const testQuery = await User.find({});
  res.send(testQuery);

});

export function initUsers() {
  User.insertMany(
    [
      { name: 'John Doe' },
    ],
    () => console.log('DB seeded with users')
  );
}