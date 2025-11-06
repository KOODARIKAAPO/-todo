
import { useEffect, useState } from 'react'
import axios from 'axios'
import Row from '../components/Row.jsx'
import { useUser } from '../context/useUser'
import '../App.css'
import { useNavigate } from "react-router-dom"

const API = import.meta.env.VITE_API_URL 

export default function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])
  const { user, logout } = useUser()
  
  
  const navigate = useNavigate();
  if (!user?.token) console.log("NO TOKEN", user)

  const handleLogout = () => {
    logout();
    navigate('/signin');
  }


  useEffect(() => {
    axios.get(`${API}/`)
      .then(res => setTasks(res.data))
      .catch(err => {
        const msg = err?.response?.data?.error || err?.message || 'Error fetching tasks'
        alert(msg)
      })
  }, [])

  const addTask = () => {
    if (!task.trim()) return
    const headers = { headers: { 'Content-Type': 'application/json', Authorization: user.token } }
    const newTask = { description: task.trim() }

    axios.post(`${API}/create`, { task: newTask }, headers)
      .then(res => {
        setTasks(prev => [...prev, res.data])
        setTask('')
      })
      .catch(err => {
        const msg = err?.response?.data?.error || err?.message || 'Error creating task'
        alert(msg)
      })
  }

  const deleteTask = (deletedId) => {
    const headers = { headers: { Authorization: user.token } }
    axios.delete(`${API}/delete/${deletedId}`, headers)
      .then(() => {
        setTasks(prev => prev.filter(item => item.id !== deletedId))
      })
      .catch(err => {
        const msg = err?.response?.data?.error || err?.message || 'Error deleting task'
        alert(msg)
      })
  }

  return (
    <div id="container">
      <h3>ToDo</h3>
      <button onClick= {handleLogout}>Logout</button>

      <form onSubmit={e => { e.preventDefault(); addTask() }}>
        <input
          placeholder="Add new task"
          value={task}
          onChange={e => setTask(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTask()
            }
          }}
        />
      </form>

      <ul>
        {tasks.map(item => (
          <Row key={item.id} item={item} deleteTask={deleteTask} />
        ))}
      </ul>
    </div>
  )
}
