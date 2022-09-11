import { Router } from 'express'
import { dbConnection } from './mysql'
import fs from 'fs'

const router = Router()

interface RecipesQueryData {
  recipe_id: number
  recipe_name: string
  recipe_photo: string
  ingredient_id: number
  ingredient_name: string
  ingredient_preparation_time: number
  ingredient_photo: string
}

interface ComplementsQueryData {
  recipe_id: number
  ingredient_id: number
  ingredient_name: string
  ingredient_preparation_time: number
  ingredient_photo: string
}

interface Recipe {
  recipe_id: number
  recipe_name: string
  recipe_photo: string
  ingredients: {
    ingredient_id: number
    ingredient_name: string
    ingredient_preparation_time: number
    ingredient_photo: string
  } []
}

interface RecipeComplements {
  recipe_id: number 
  ingredients: {
    ingredient_id: number
    ingredient_name: string
    ingredient_preparation_time: number
    ingredient_photo: string
  } []
}

router.post('/register', (req, res) => {
  const { name, email } = req.body

  if(!name || !email) {
    return res.status(400).send({ message: 'Name and/or email is missing' })
  }

  const couponCode = Math.random().toString(36).slice(2,10).toUpperCase()

  dbConnection.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ err })
    }
    dbConnection.query(
      'INSERT INTO clients (name, email, coupon_code) VALUES (?,?,?)',
      [name, email, couponCode],
      (error, results, fields) => {
        conn.release()
        if (error) {
          return res.status(403).send({ error: 'Usuário já cadastrado' })
        }
        return res.status(201).send({
          message: 'Usuário registrado', 
          user: { name, email, couponCode } 
        })
      }
    )
  })
})

router.get('/recipes', (req, res) => {
  const recipesQuery = fs.readFileSync('./src/queries/recipes.sql').toString().replace('\n', '')
  
  dbConnection.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ err })
    }

    dbConnection.query(recipesQuery, (error, results: RecipesQueryData[], fields) => {
      conn.release()
      if (error) {
        return res.status(500).send({ error })
      }
      
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

      return res.status(200).send({ results: formattedRecipesArray })
    })
  })

})

router.get('/complements', (req, res) => {
  const complementsQuery = fs.readFileSync('./src/queries/complements.sql').toString().replace('\n', '')
  
  dbConnection.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ err })
    }

    dbConnection.query(complementsQuery, (error, results: ComplementsQueryData[], fields) => {
      conn.release()
      const formattedComplementsArray: RecipeComplements[] = []

      if (error) {
        return res.status(500).send({ error })
      }

      results.forEach(complement => {
        const recipeIndexInTheArray = formattedComplementsArray.findIndex(item => item.recipe_id === complement.recipe_id)
        const isRecipeAlreadyInTheArray = recipeIndexInTheArray !== -1
        if(!isRecipeAlreadyInTheArray) {
          const newItem: RecipeComplements = {
            recipe_id: complement.recipe_id,
            ingredients: [{
              ingredient_id: complement.ingredient_id,
              ingredient_name: complement.ingredient_name,
              ingredient_photo: complement.ingredient_photo,
              ingredient_preparation_time: complement.ingredient_preparation_time
            }]
          }
          formattedComplementsArray.push(newItem)
        } else {
          formattedComplementsArray[recipeIndexInTheArray].ingredients.push({
            ingredient_id: complement.ingredient_id,
            ingredient_name: complement.ingredient_name,
            ingredient_photo: complement.ingredient_photo,
            ingredient_preparation_time: complement.ingredient_preparation_time
          })
        }
      })

      return res.status(200).send({ results: formattedComplementsArray })
    })
  })

})

export { router }


  // dbConnection.query(recipesQuery, function (error, results: RecipesRouteData[] , fields) {
  //   if (error) throw error

  //   const formattedRecipesArray: Recipe[] = []

  //   results.forEach(recipe => {
  //     const recipeIndexInTheArray = formattedRecipesArray.findIndex(item => item.recipe_id === recipe.recipe_id)
  //     const isRecipeAlreadyInTheArray = recipeIndexInTheArray !== -1
  //     if(!isRecipeAlreadyInTheArray) {
  //       const newItem: Recipe = {
  //         recipe_id: recipe.recipe_id,
  //         recipe_name: recipe.recipe_name,
  //         recipe_photo: recipe.recipe_photo,
  //         ingredients: [{
  //           ingredient_id: recipe.ingredient_id,
  //           ingredient_name: recipe.ingredient_name,
  //           ingredient_preparation_time: recipe.ingredient_preparation_time,
  //           ingredient_photo: recipe.ingredient_photo,
  //         }]
  //       }
  //       formattedRecipesArray.push(newItem)

  //     }
  //     else {
  //       formattedRecipesArray[recipeIndexInTheArray].ingredients.push({
  //         ingredient_id: recipe.ingredient_id,
  //         ingredient_name: recipe.ingredient_name,
  //         ingredient_preparation_time: recipe.ingredient_preparation_time,
  //         ingredient_photo: recipe.ingredient_photo,
  //       })
  //     }
  //   })

  //   res.send({ formattedRecipesArray })
  // })