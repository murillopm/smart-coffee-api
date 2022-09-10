import { Router } from 'express'
import { dbConnection } from './mysql'
import fs from 'fs'
// const sqlInstructions = fs.readFileSync('./src/database/script.sql').toString().split('\n')

const router = Router()

router.get('/', (req, res) => {
  dbConnection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
  res.send({ message: 'Hello world' })
})

router.get('/test', (req, res) => {
  dbConnection.query("SELECT * FROM recipes", function (error, results, fields) {
    if (error) throw error;
    res.send({ results: results})
  });
})

export { router }