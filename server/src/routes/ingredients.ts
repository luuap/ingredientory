import fs from 'fs';
import express from 'express';

import { Ingredient } from '../models/Ingredient';

export const ingredientsRoute = express.Router();

ingredientsRoute.get('/', async (req, res) => {
  const query = (req.query.query as string)?.split(';');

  if (query === undefined) {
    res.send('Ready for query');
  } else {

    const result = await Ingredient.aggregate([
      { $match: { name: { $in: query } } }, // filter the ingredients, check if name is in query string array
      {
        $group: { 
          _id: 0,
          // Note: $something is a field from the documents returned by the previous stage 
          matched_ingredients: { $push: '$name' }, // array of all values with name field that resulted from previous stage
          recipes: { $push: '$recipes' }, // array of matched recipes (array of arrays in this case)
          initial: { $first: '$recipes' }, // separate the first result (this is done in preparation for $reduce operator in the $project stage)
        }
      },
      {
        $project: {
          unmatched_ingredients: { $setDifference: [query, '$matched_ingredients'] }, // return only the elements that exist on the query array
          common_recipes: {
            $reduce: { // reduce funcction that takes intersection of recipes
              input: '$recipes',
              initialValue: '$initial',
              in: { $setIntersection: ['$$value', '$$this'] } 
            }
          }
        }
      }
    ]);

    if (result.length === 0) {
      res.send({ _id: 0, unmatched_ingredients: [], common_recipes: [] })
    }

    res.send(result[0]); // Note: aggregate function returns array of results, return only the first result
  }

});

// Seed the database with each ingredient as a document
export async function initIngredients(): Promise<void> {
  const rawData = fs.readFileSync('./test_data/test_data.json');
  const ingredients = JSON.parse(rawData.toString());

  await Ingredient.deleteMany({}).then(() => {
    console.log('Cleared ingredients');
  });

  await Ingredient.insertMany(
    ingredients,
  ).then(async () => {
    const count = await Ingredient.countDocuments({});
    console.log(`DB seeded with ingredients, ${count} documents added`);
  });
}
