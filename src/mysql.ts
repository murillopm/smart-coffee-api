import mysql from 'mysql'

export const dbConnection = mysql.createPool({
  "host": "mysql",
  "user": "root",
  "password": "root",
  "database": "",
  "port": 3306,
  multipleStatements: true,
})