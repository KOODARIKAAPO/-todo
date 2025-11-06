import { Router } from 'express'
import { pool } from '../helper/db.js'
import { auth } from '../helper/auth.js'
import { getTasks, postTask, deleteTask } from '../controllers/TaskController.js'
import { ApiError } from '../helper/ApiError.js'

const router = Router()


router.get('/', getTasks)


router.post('/create', auth, postTask)
router.delete('/delete/:id', auth, deleteTask)

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM task')
    return res.status(200).json(rows || [])
  } catch (err) {
    next(err)
  }
})
/*router.get('/', (req, res, next) => {
  pool.query('SELECT * FROM task', (err, result) => {
    if (err) {
      return next(err)
    }
    res.status(200).json(result.rows || [])
  })
})
*/

/*
router.post('/create', auth, (req, res, next) => {
  const { task } = req.body
  if (!task?.description) {
    return res.status(400).json({ error: 'Task is required' })
  }
  pool.query(
    'INSERT INTO task (description) VALUES ($1) RETURNING *',
    [task.description],
    (err, result) => {
      if (err) {
        return next(err)
      }
      res.status(201).json({ id: result.rows[0].id, description: task.description })
    }
  )
})

router.delete('/delete/:id', auth, (req, res, next) => {
  const { id } = req.params
  pool.query('DELETE FROM task WHERE id = $1 RETURNING id', [id], (err, result) => {
    if (err) return next(err)
    if (result.rowCount === 0) {
      const error = new Error('Task not found')
      error.status = 404
      return next(error)
    }
    res.status(200).json({ id: result.rows[0].id, deleted: true })
  })
})
*/

export default router
