import { Schema, model } from 'mongoose';

const IngredientSchema = new Schema({
  name: { type: String, index: true },
  recipes: [String],
});

export const Ingredient = model('Ingredients', IngredientSchema, 'ingredients');