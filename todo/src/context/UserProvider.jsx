import { useState } from 'react'
import axios from 'axios'
import { UserContext } from './UserContext'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function UserProvider({ children }) {
  const stored = sessionStorage.getItem('user')
  const [user, setUser] = useState(
    stored ? JSON.parse(stored) : { email: '', password: '' }
  )

  const persistUser = (data) => {
    setUser(data)
    sessionStorage.setItem('user', JSON.stringify(data))
  }

  const signUp = async () => {
    const { data } = await axios.post(`${API}/user/signup`, { user }, {
      headers: { 'Content-Type': 'application/json' }
    })
    
  }

  const signIn = async () => {
    const { data } = await axios.post(`${API}/user/signin`, { user }, {
      headers: { 'Content-Type': 'application/json' }
    })
    persistUser(data)
  }

  const logout = () => {
    sessionStorage.clear()
    setUser({ email: "", password: "" }) 
  }
  

  return (
    <UserContext.Provider value={{ user, setUser, signUp, signIn, logout }}>
      {children}
    </UserContext.Provider>
  )
}
