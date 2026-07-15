import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginService from '../services/login'
import wordService from '../services/words'

const Login = ({ setUser, setNotification }) => {
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
      setNotification({
        data: 'wrong username or password', type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h2>Log in</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type='text'
              id='username'
              name='username'
              autoComplete='username'
              required
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type='password'
              id='password'
              name='password'
              autoComplete='current-password'
              required
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <div>
          <button type='submit' >
            login
          </button>
        </div>
      </form>
    </div>
  )
}

export default Login