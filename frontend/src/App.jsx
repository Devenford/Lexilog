import { useState, useEffect } from 'react'
import {
  Routes, Route, NavLink, Navigate, useNavigate
} from 'react-router-dom'

import authService from './services/auth'
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Practice from './components/Practice'
import MultipleChoice from './components/MultipleChoice/MultipleChoice'

import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Coins } from 'lucide-react'

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // if the user state is still being loaded/retrieved from localStorage
  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedLexilogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)    // updation of state causes re-rendering of the component (App), which it belongs to, and their child components/descendants
      authService.setToken(user.token)
    }
    setLoading(false)
  }, []) // to restore a user that's logged in, must be in App to ensure the user's authentication is restored across all pages

  const handleLogout = () => {
    window.localStorage.removeItem('loggedLexilogUser')
    setUser(null)
  }

  if (loading) {
    return null
  }

  return (
    <div>
      <Toaster />

      <header className='border-b bg-background mb-6'>
        <nav className='mx-auto flex h-15 max-w-7xl items-center justify-between px-1'>
          <div className='flex items-center gap-3'>
            <NavLink to='/'>
              <img
                src='../images/Final_Website_Logo.png'
                className='h-15'
              />
            </NavLink>
            { user &&
              <Button onClick={() => navigate('/practice')} variant='link' className='text-white text-lg'>
                  Practice
              </Button>
            }
          </div>
          <div className='flex items-center gap-3'>
            {user ?
              <>
                <Badge variant='secondary' className='h-10 text-base'>
                  <img src='../images/coin.svg' alt='Coin' className='h-8 w-8'/>
                  {user.coins}
                </Badge>
                <Button onClick={handleLogout} className='text-base'>
                  logout
                </Button>
              </>
              :
              <>
                <Button variant='ghost' className='hover:bg-accent/50 text-sm'>
                  <NavLink to='/signup'>
                    Sign Up
                  </NavLink>
                </Button>

                <Button className='text-sm'>
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
            path='/practice'
            element={ user ? <Practice /> : <Navigate to='/' replace />}
          />
          <Route
            path='/practice/multiplechoice'
            element={ user ? <MultipleChoice setUser={setUser}/> : <Navigate to='/' replace />}
          />
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
            element={<Home user={user}/>}
          />
        </Routes>
      </div>
    </div>
  )
}

export default App