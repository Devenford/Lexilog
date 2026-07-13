import { useState, useEffect } from 'react'
import {
  Routes, Route, Link, Navigate, useMatch
} from 'react-router-dom'
import blogService from './services/blogs'
import Notification from './components/Notification'
import Login from './components/Login'
import Home from './components/Home'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlogForm'

import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // if the user state is still being loaded/retrieved from the backend

  const match = useMatch('/blogs/:id')
  const blog = match ? blogs.find(b => b.id === match.params.id) : null

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs) // updation of state causes re-rendering of the component (App), which it belongs to, and their child components/descendants
    )
  }, []) // should be in App, since blogs state is also in App

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)    // updation of state causes re-rendering of the component (App), which it belongs to, and their child components/descendants
      blogService.setToken(user.token)
    }
    setLoading(false)
  }, []) // to restore a user that's logged in, must be in App to ensure the user's authentication is restored across all pages

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async blogObject => {
    try {
      const blog = await blogService.create(blogObject)
      setBlogs(blogs.concat(blog))
      setNotification({
        data: `A new blog: ${blog.title} by ${blog.author} added`,
        type: 'success'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
    catch {
      setNotification({
        data: 'invalid blog',
        type: 'error'
      })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const updateLikes = async blog => {
    const updatedBlog = await blogService.update({
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      id: blog.id
    })
    setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
  }

  const deleteBlog = async id => {
    await blogService.deletion(id)
    setBlogs(blogs.filter(b => b.id !== id))
    setNotification({
      data: `"${blog.title} by ${blog.author}" deleted`,
      type: 'success'
    })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  if (loading) {
    return null
  }

  const style = { '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }

  return (
    <Container>
      <AppBar position='static' sx={{ mb: 2 }}>
        <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>
            Blog App
          </Typography>
          <Button color='inherit' component={Link} to='/' sx={style}>
            blogs
          </Button>
          {!user && <Button color='inherit' component={Link} to='/login' sx={style}>
            login
          </Button>}
          {user &&
          <span>
            <Button color='inherit' component={Link} to='/create' sx={style}>
              new blog
            </Button>
            <Button color='inherit' onClick={handleLogout} sx={style}>
              logout
            </Button>
          </span>}
        </Toolbar>
      </AppBar>

      <Notification notification={notification} />

      <Routes>
        <Route
          path='/blogs/:id'
          element={
            <Blog user={user} blog={blog} updateLikes={updateLikes} deleteBlog={deleteBlog} />
          }
        />
        <Route
          path='/create'
          element={user ? <NewBlogForm createBlog={addBlog} /> : <Navigate to='/' replace />}
        />
        <Route
          path='/login'
          element={ user ? <Navigate to='/' replace /> : <Login setUser={setUser} setNotification={setNotification} />}
        />
        <Route
          path='/blogs'
          element={<Home blogs={blogs} />}
        />
        <Route
          path='/'
          element={<Home blogs={blogs} />}
        />
      </Routes>
    </Container>
  )
  /*
    React component identity:
    Do Not Define Components within Components (check notes on this topic (A more complex state & Debugging React Apps) on Notion, Chp. 1, part d)

    Components should be defined at the top level, not inside another component.

    If a component is defined inside App (or another component), a new function is created on every render. React compares component types by their function reference, so it treats the new function as a different component.

    Result:
      App re-renders
          ↓
      Old component unmounts
          ↓
      New component mounts
          ↓
      All local state (useState) is reinitialized

    ****It is perfectly fine to render components inside other components:

      function App() {
        return (
          <>
            <Notification />
            <LoginForm />
            <Blog />
          </>
        )
      }

    ****  Don't do this: (Don't define components inside other components)
    function App() {
      const DisplayUserBlogs = () => {
        return (
          <div>
            ...
          </div>
        )
      }

      return <DisplayUserBlogs />
    }

    Every time App re-renders, a new DisplayUserBlogs function is created. React treats it as a different component type, so it unmounts the previous component and mounts a new one. Consequently, all local state (useState) in DisplayUserBlogs and its children is reset.

    Instead, define DisplayUserBlogs outside App (or in its own file) and pass the required data via props.

    Example:
      const [visible, setVisible] = useState(false)

    If the Blog component is remounted, `visible` is reset to `false`, causing the expanded view to collapse.

    Re-rendering is NOT the same as remounting:
      - Re-render: component instance is reused; local state is preserved.
      - Remount: old instance is destroyed and a new one is created; local state
        is reset.
  */
}

export default App