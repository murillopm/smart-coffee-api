import { Router } from 'express'
import { dbConnection } from './mysql'

const router = Router()

router.get('/', (req, res) => {
  // dbConnection.connect()
  dbConnection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
  // dbConnection.end()
  res.send({ message: 'Hello world' })
})

export { router }