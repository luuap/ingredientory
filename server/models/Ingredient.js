const mongoose = require('mongoose');

const IngredientSchema = mongoose.Schema({
  name: String,
  recipes: [String],
});

module.exports = mongoose.model('Ingredients', IngredientSchema, 'ingredients');