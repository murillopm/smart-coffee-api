import { app } from './app'
import { dbConnection } from './mysql'
import fs from 'fs'

const sqlFileToString = fs.readFileSync('./src/database/script.sql').toString()

app.listen(3000, () => console.log('Server is running on port 3000'))