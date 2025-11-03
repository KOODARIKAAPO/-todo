import dotenv from 'dotenv'
import pkg from 'pg'
const environment = process.env.NODE_ENV || 'development'
dotenv.config()

const { Pool } = pkg


const port = process.env.DB_PORT
const host = process.env.DB_HOST
const user = process.env.DB_USER
const password = process.env.DB_PASSWORD

const databaseName = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DB_NAME
  : process.env.DB_NAME


const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number (process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: databaseName
})


export { pool }
