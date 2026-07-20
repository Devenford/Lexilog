import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import signupService from '../services/signup'
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

const SignUp = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const handleSignUp = async (event) => {
    event.preventDefault()
    try {
      const user = await signupService.signup({ username, name, password })
      navigate('/')
      setUsername('')
      setName('')
      setPassword('')
      authService.setToken(user.token)
      window.localStorage.setItem(
        'loggedLexilogUser', JSON.stringify(user)
      )
      setUser(user)
    }
    catch {
      toast.error('username must be unique', { position: 'top-center' })
    }
  }

  return (
    <div>
      <Card className='w-full max-w-lg place-self-center'>
        <form className='flex flex-col gap-4' onSubmit={handleSignUp}>
          <CardHeader>
            <CardTitle className='text-xl'>
            Sign Up
            </CardTitle>
            <CardDescription className='text-base'>
            Create a an account
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
                <Label htmlFor='name' className='text-base'>
                Name
                </Label>
                <Input
                  type='text'
                  id='name'
                  name='name'
                  autoComplete='name'
                  required
                  value={name}
                  onChange={({ target }) => setName(target.value)}
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
              Sign Up
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default SignUp