import { Router } from 'express'
import { hash, compare } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../helper/db.js'

const { sign } = jwt
const router = Router()

router.post('/signup', (req, res, next) => {
  const { user } = req.body

  if (!user || !user.email || !user.password) {
    const error = new Error('Email and password are required')
    error.status = 400
    return next(error)
  }

  hash(user.password, 10, (err, hashedPassword) => {
    if (err) return next(err)

    pool.query(
      'INSERT INTO account (email, password) VALUES ($1, $2) RETURNING id, email',
      [user.email, hashedPassword],
      (err, result) => {
        if (err) {
          // email unique -> 409
          if (err.code === '23505') {
            return res.status(409).json({ error: 'Email already registered' })
          }
          return next(err)
        }
        const { id, email } = result.rows[0]
        return res.status(201).json({ id, email })
      }
    )
  })
})
router.post('/signin', (req, res, next) => {
  const { user } = req.body
  if (!user || !user.email || !user.password) {
    const error = new Error('Email and password are required')
    error.status = 400
    return next(error)
  }

  pool.query('SELECT * FROM account WHERE email = $1', [user.email], (err, result) => {
    if (err) return next(err)

    if (result.rows.length === 0) {
      const error = new Error('User not found')
      error.status = 404
      return next(error)
    }

    const dbUser = result.rows[0]

    compare(user.password, dbUser.password, (cErr, isMatch) => {
      if (cErr) return next(cErr)

      if (!isMatch) {
        const error = new Error('Invalid password')
        error.status = 401
        return next(error)
      }

      const token = jwt.sign({ user: dbUser.email }, process.env.JWT_SECRET)
      return res.status(200).json({
        id: dbUser.id,
        email: dbUser.email,
        token
      })
    })
  })
})

  
export default router
