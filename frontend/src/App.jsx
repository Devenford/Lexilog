import { useState, useEffect } from 'react'
import {
  Routes, Route, NavLink, Navigate, useNavigate
} from 'react-router-dom'

import userService from './services/user'
import loginService from './services/login'
import Home from './components/Home'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Practice from './components/Practice'
import MultipleChoice from './components/MultipleChoice/MultipleChoice'
import Leaderboard from './components/Leaderboard'

import { Toaster } from '@/components/ui/sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // while the user's authentication state is being retrieved from the backend
  const navigate = useNavigate()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await userService.getCurrentUser()
        setUser(user)    // updation of state causes re-rendering of the component (App), which it belongs to, and their child components/descendants
      }
      catch { // No valid authentication cookie or the token has expired, login again
        setUser(null)
      }
      finally {
        setLoading(false)
      }
    }

    loadUser()
  }, []) // Restore authentication state by asking the backend for the current user
  // to restore a user that's logged in, must be in App to ensure the user's authentication is restored across all pages

  const handleLogout = async () => {
    await loginService.logout()
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
            <NavLink to='/' data-testid='Home'>
              <img
                src='/images/Final_Website_Logo.png'
                className='h-15'
              />
            </NavLink>
            { user &&
            <>
              <Button onClick={() => navigate('/practice')} variant='link' className='text-white text-lg'>
                  Practice
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant='link' className='text-white text-lg'>
                    Leaderboard
                  </Button>
                } />
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate('/leaderboards/coins')} className='text-base'>Coins</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/leaderboards/xp')}  className='text-base'>XP</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/leaderboards/monthlyxp')} className='text-base'>MonthlyXP</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
            }
          </div>
          <div className='flex items-center gap-3'>
            {user ?
              <>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Badge variant='secondary' className='h-10 text-base' data-testid='Coins-Count'>
                        <img src='/images/coin.svg' alt='Coin' className='h-8 w-8'/>
                        {user.coins}
                      </Badge>} />
                  <TooltipContent>
                    <p className='text-base'>Coins</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger render={
                    <Badge variant='secondary' className='h-10 text-base' data-testid='XP-Count'>
                      <img src='/images/xp.svg' alt='XP' className='h-8 w-8'/>
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
            path='/leaderboards/coins'
            element={ user ? <Leaderboard type='coins'/> : <Navigate to='/' replace />}
          />
          <Route
            path='/leaderboards/xp'
            element={ user ? <Leaderboard type='xp'/> : <Navigate to='/' replace />}
          />
          <Route
            path='/leaderboards/monthlyxp'
            element={ user ? <Leaderboard type='monthlyXp'/> : <Navigate to='/' replace />}
          />
          <Route
            path='/leaderboards'
            element={ user ? <Leaderboard type='monthlyXp'/> : <Navigate to='/' replace />}
          />
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