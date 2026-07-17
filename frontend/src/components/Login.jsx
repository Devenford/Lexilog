import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import wordService from '../services/words'
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
      wordService.setToken(user.token)
      window.localStorage.setItem(
        'loggedLexilogUser', JSON.stringify(user)
      )
      setUser(user)
    }
    catch {
      toast('wrong username or password', { position: 'top-center' })
    }
  }

  return (
    <div>
      <Card className='w-full max-w-sm place-self-center'>
        <form className='flex flex-col gap-4' onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle>
            Login to your account
            </CardTitle>
            <CardDescription>
            Enter your username below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='username'>
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
                <Label htmlFor='password'>
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
            <Button type='submit' className='w-full'>
            Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login