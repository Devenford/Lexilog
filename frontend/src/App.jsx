import { useState, useEffect } from 'react'
import {
  Routes, Route, Link, Navigate
} from 'react-router-dom'
import wordService from './services/words'
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // if the user state is still being loaded/retrieved from localStorage

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedLexilogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)    // updation of state causes re-rendering of the component (App), which it belongs to, and their child components/descendants
      wordService.setToken(user.token)
    }
    setLoading(false)
  }, []) // to restore a user that's logged in, must be in App to ensure the user's authentication is restored across all pages

  const handleLogout = () => {
    window.localStorage.removeItem('loggedLexilogUser')
    setUser(null)
    toast.success('Logged Out', { position: 'top-center ' })
  }

  if (loading) {
    return null
  }

  const padding = {
    padding: 5
  }

  return (
    <div>
      <Toaster />
      <Link style={padding} to='/'>
        Home
      </Link>
      {!user &&
        <span>
          <Link style={padding} to='/signup'>
            Sign Up
          </Link>
          <Link style={padding} to='/login'>
            Login
          </Link>
        </span>
      }
      {user &&
        <button onClick={handleLogout}>
          logout
        </button>
      }

      <Routes>
        <Route
          path='/login'
          element={ user ? <Navigate to='/' replace /> : <Login setUser={setUser} />}
        />
        <Route
          path='/signup'
          element={ user ? <Navigate to='/' replace /> : <SignUp setUser={setUser} />}
        />
        <Route
          path='/'
          element={<Home />}
        />
      </Routes>
    </div>
  )
}

export default App