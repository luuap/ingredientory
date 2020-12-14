import { Schema } from 'mongoose';

export const Ingredient = {
  name: 'Ingredients',
  schema: new Schema({
    name: { type: String, index: true },
    recipes: [String],
  }),
  collection: 'ingredients'
}