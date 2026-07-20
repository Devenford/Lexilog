import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import authService from '../services/auth'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Login = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      navigate('/')
      setUsername('')
      setPassword('')
      authService.setToken(user.token)
      window.localStorage.setItem(
        'loggedLexilogUserToken', user.token
      )
      setUser(user)
    }
    catch (error) {
      console.log(error)
      toast('wrong username or password', { position: 'top-center' })
    }
  }

  return (
    <div>
      <Card className='w-full max-w-lg place-self-center'>
        <form className='flex flex-col gap-4' onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className='text-xl'>
              Login to your account
            </CardTitle>
            <CardDescription className='text-base'>
              Enter your username below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='username' className='text-base'>
                  Username
                </Label>
                <Input
                  type='text'
                  id='username'
                  name='username'
                  autoComplete='username'
                  required
                  value={username}
                  onChange={({ target }) => setUsername(target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='password' className='text-base'>
                  Password
                </Label>
                <Input
                  type='password'
                  id='password'
                  name='password'
                  autoComplete='current-password'
                  required
                  value={password}
                  onChange={({ target }) => setPassword(target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-2'>
            <Button type='submit' className='w-full text-base h-10'>
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login