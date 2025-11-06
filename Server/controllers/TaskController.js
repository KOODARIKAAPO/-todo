import { selectAllTasks, insertTask, deleteTaskById } from '../models/task.js'
import { ApiError } from '../helper/ApiError.js'

export const getTasks = async (req, res, next) => {
  try {
    const result = await selectAllTasks()
    return res.status(200).json(result.rows || [])
  } catch (error) {
    return next(error)
  }
}

export const postTask = async (req, res, next) => {
  const { task } = req.body
  try {
    if (!task || !task.description || task.description.trim().length === 0) {
      return next(new ApiError('Task description is required', 400))
    }
    const result = await insertTask(task.description.trim())
    const row = result.rows[0]
    return res.status(201).json({ id: row.id, description: row.description })
  } catch (error) {
    return next(error)
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await deleteTaskById(id)
    if (result.rowCount === 0) {
      return next(new ApiError('Task not found', 404))
    }
    return res.status(200).json({ id: result.rows[0].id, deleted: true })
  } catch (error) {
    return next(error)
  }
}
