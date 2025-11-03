import express from 'express'
import cors from 'cors'
import todoRouter from './routes/todoRouter.js'

const port = process.env.PORT 

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/',todoRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
