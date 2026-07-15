import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import signupService from '../services/signup'
import wordService from '../services/words'

const SignUp = ({ setUser, setNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const handleSignUp = async (event) => {
    event.preventDefault()
    try {
      const user = await signupService.signup({ username, password })
      navigate('/')
      setUsername('')
      setName('')
      setPassword('')
      wordService.setToken(user.token)
      window.localStorage.setItem(
        'loggedLexilogUser', JSON.stringify(user)
      )
      setUser(user)
    }
    catch {
      setNotification({
        data: 'username must be unique',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div>
          <label>
            username
            <input
              type='text'
              id='username'
              name='username'
              required
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            name
            <input
              type='text'
              id='name'
              name='name'
              value={name}
              onChange={({ target }) => setName(target.value)}
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
              required
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <div>
          <button type='submit' >
            sign up
          </button>
        </div>
      </form>
    </div>
  )
}

export default SignUp