import { useState, useEffect } from 'react'
import {
  Routes, Route, NavLink, Navigate
} from 'react-router-dom'
import wordService from './services/words'
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

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

  return (
    <div>
      <Toaster />

      <header className='border-b bg-background mb-6'>
        <nav className='mx-auto flex h-12 max-w-7xl items-center justify-between px-6'>
          <NavLink to='/'>
            Lexilog
          </NavLink>
          <div className='flex items-center gap-2'>
            {user ?
              <Button onClick={handleLogout}>
              logout
              </Button>
              :
              <>
                <Button variant='ghost'>
                  <NavLink to='/signup'>
                    Sign Up
                  </NavLink>
                </Button>

                <Button>
                  <NavLink to='/login'>
                    Login
                  </NavLink>
                </Button>
              </>
            }
          </div>
        </nav>
      </header>

      <div>
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
    </div>
  )
}

export default App