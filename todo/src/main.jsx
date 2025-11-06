import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './screens/App.jsx'
import Authentication, { AuthenticationMode } from './screens/Authentication.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import UserProvider from './context/UserProvider.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import NotFound from './screens/NotFound.jsx'

const router = createBrowserRouter([
  
  {
    path: '/signin',
    element: <Authentication authenticationMode={AuthenticationMode.SignIn} />
  },
  {
    path: '/signup',
    element: <Authentication authenticationMode={AuthenticationMode.SignUp} />
  },

  
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <App />
      }
    ]
  },

  // 404
  {
    path: '*',
    element: <NotFound />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
)
