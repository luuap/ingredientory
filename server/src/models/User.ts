import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: String,
});

export const User = model('Users', UserSchema, 'users');