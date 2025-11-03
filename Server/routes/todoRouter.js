import { Router } from 'express'
import { pool } from '../helper/db.js'

const router = Router()

router.get('/', (req, res) => {
  pool.query('SELECT * FROM task', (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    return res.status(200).json(result.rows || [])
  })
})

router.post('/create', (req, res) => {
  const { task } = req.body
  if (!task?.description) {
    return res.status(400).json({ error: 'Task is required' })
  }
  pool.query(
    'INSERT INTO task (description) VALUES ($1) RETURNING *',
    [task.description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message })
      return res.status(201).json(result.rows[0])
    }
  )
})

router.delete('/delete/:id', (req, res) => {
  const { id } = req.params
  pool.query('DELETE FROM task WHERE id = $1', [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message })
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }
    return res.status(200).json({ id })
  })
})

export default router
