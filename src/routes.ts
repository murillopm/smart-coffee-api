import { Router } from 'express'
import { dbConnection } from './mysql'
import fs from 'fs'

const router = Router()

interface RecipesRouteData {
  recipe_id: number
  recipe_name: string
  recipe_photo: string
  ingredient_id: number,
  ingredient_name: string,
  ingredient_preparation_time: number,
  ingredient_photo: string
}

interface Recipe {
  recipe_id: number
  recipe_name: string
  recipe_photo: string
  ingredients: {
    ingredient_id: number,
    ingredient_name: string,
    ingredient_preparation_time: number,
    ingredient_photo: string
  } []
}



router.get('/clients', (req, res) => {
  dbConnection.query("SELECT * FROM clients", function (error, results, fields) {
    if (error) throw error;
    res.send({ results })
  });
})

router.get('/recipes', (req, res) => {
  const recipesQuery = fs.readFileSync('./src/queries/recipes.sql').toString().replace('\n', '')
  dbConnection.query(recipesQuery, function (error, results: RecipesRouteData[] , fields) {
    if (error) throw error;

    const formattedRecipesArray: Recipe[] = []
    results.forEach(recipe => {
      const recipeIndexInTheArray = formattedRecipesArray.findIndex(item => item.recipe_id === recipe.recipe_id)
      const isRecipeAlreadyInTheArray = recipeIndexInTheArray !== -1
      if(!isRecipeAlreadyInTheArray) {
        const newItem: Recipe = {
          recipe_id: recipe.recipe_id,
          recipe_name: recipe.recipe_name,
          recipe_photo: recipe.recipe_photo,
          ingredients: [{
            ingredient_id: recipe.ingredient_id,
            ingredient_name: recipe.ingredient_name,
            ingredient_preparation_time: recipe.ingredient_preparation_time,
            ingredient_photo: recipe.ingredient_photo,
          }]
        }
        formattedRecipesArray.push(newItem)
      }
      else {
        formattedRecipesArray[recipeIndexInTheArray].ingredients.push({
          ingredient_id: recipe.ingredient_id,
          ingredient_name: recipe.ingredient_name,
          ingredient_preparation_time: recipe.ingredient_preparation_time,
          ingredient_photo: recipe.ingredient_photo,
        })
      }
    })
    res.send({ formattedRecipesArray })
  });
})

export { router }