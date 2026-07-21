import { useState, useEffect } from 'react'
import {
  Routes, Route, NavLink, Navigate, useNavigate
} from 'react-router-dom'

import authService from './services/auth'
import userService from './services/user'
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Practice from './components/Practice'
import MultipleChoice from './components/MultipleChoice/MultipleChoice'

import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // if the user state is still being loaded/retrieved from localStorage
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = window.localStorage.getItem('loggedLexilogUserToken')
        if (token) {
          authService.setToken(token)
          const user = await userService.getCurrentUser()
          setUser(user)    // updation of state causes re-rendering of the component (App), which it belongs to, and their child components/descendants
        }
      }
      catch (error) { // token expired, login again
        console.log(error)
        window.localStorage.removeItem('loggedLexilogUserToken')
        setUser(null)
        authService.setToken(null)
      }
      finally {
        setLoading(false)
      }
    }

    loadUser()
  }, []) // to restore a user that's logged in, must be in App to ensure the user's authentication is restored across all pages

  const handleLogout = () => {
    window.localStorage.removeItem('loggedLexilogUserToken')
    authService.setToken(null)
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
                <Tooltip>
                  <TooltipTrigger render={<Badge variant='secondary' className='h-10 text-base'>
                    <img src='../images/coin.svg' alt='Coin' className='h-8 w-8'/>
                    {user.coins}
                  </Badge>} />
                  <TooltipContent>
                    <p className='text-base'>Coins</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={<Badge variant='secondary' className='h-10 text-base'>
                    <img src='../images/xp.svg' alt='XP' className='h-8 w-8'/>
                    {user.xp}
                  </Badge>} />
                  <TooltipContent>
                    <p className='text-base'>XP</p>
                  </TooltipContent>
                </Tooltip>
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