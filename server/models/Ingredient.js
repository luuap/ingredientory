const mongoose = require('mongoose');

const IngredientSchema = mongoose.Schema({
  name: { type: String, index: true },
  recipes: [String],
});

module.exports = mongoose.model('Ingredients', IngredientSchema, 'ingredients');