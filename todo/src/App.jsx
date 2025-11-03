import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import Row from './Row.jsx'

const url = "http://localhost:3001"

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(()=>{
    axios.get(url)
    .then(response=>{
      setTasks(response.data)
    })
  
  .catch(error=>{
    alert(error.response.data ? error.response.data.message : error)
  
  })

},[])

const addTask = () => {
  const newTask = { description: task }
  axios.post(url + '/create', { task: newTask })
    .then(response => {
      setTasks([...tasks, response.data]) 
      setTask('')
    })
    .catch(error => {
      alert(error.response ? error.response.data.error.message : error)
    })
}
const deleteTask = (deletedId) => {
  axios.delete(url + '/delete/' + deletedId)
    .then(() => {
      setTasks(tasks.filter(item => item.id !== deletedId))
    })
    .catch(error => {
      alert(error.response ? error.response.data.error.message : error)
    })
}
  

return (
  <div id="container">
    <h3>ToDo</h3>
    <form onSubmit={e => { e.preventDefault(); addTask() }}>
      <input
        placeholder="Add new task"
        value={task}
        onChange={e => setTask(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTask() } }}
      />
    </form>

    <ul>
      {tasks.map(item => (
        <Row item={item} key={item.id} deleteTask={deleteTask} />
      ))}
    </ul>
  </div>
)
}
export default App
