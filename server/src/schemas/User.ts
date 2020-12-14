import { Schema } from 'mongoose';

export const User = {
  name: 'Users',
  schema: new Schema({
    name: String,
  }),
  collection: 'users'
}