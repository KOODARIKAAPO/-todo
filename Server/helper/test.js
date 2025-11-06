import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from './db.js'
import jwt from 'jsonwebtoken'
import { hash } from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const initializeTestDb = async () => {
  const raw = fs.readFileSync(path.resolve(__dirname, '../db.sql'), 'utf8')
  const cleaned = raw.replace(/\r/g, '').replace(/\u00A0/g, ' ')
  const statements = cleaned.split(';').map(s => s.trim()).filter(Boolean)
  for (const stmt of statements) {
    await pool.query(stmt)
  }
}

export const insertTestUser = (user) =>
  new Promise((resolve, reject) => {
    hash(user.password, 10, (err, hashedPassword) => {
      if (err) return reject(err)
      pool.query(
        'INSERT INTO account (email, password) VALUES ($1, $2)',
        [user.email, hashedPassword],
        (qErr) => (qErr ? reject(qErr) : resolve())
      )
    })
  })

const JWT_SECRET = process.env.JWT_SECRET || 'testsecret123'
export const getToken = (email) => jwt.sign({ email }, JWT_SECRET)
