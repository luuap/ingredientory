import express from 'express';
import { User } from '../models/User';

export const usersRoute = express.Router();

usersRoute.get('/', async (req, res) => {
  const testQuery = await User.find({});
  res.send(testQuery);

});

export async function initUsers(): Promise<void> {

  await User.deleteMany({}).then(() => {
    console.log('Cleared users');
  });

  await User.insertMany(
    [
      { name: 'John Doe' },
    ],
  ).then(async () => {
    const count = await User.countDocuments({});
    console.log(`DB seeded with users, ${count} documents added`);
  });
}