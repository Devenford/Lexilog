import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { TextField, Button } from '@mui/material'

const NewBlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const navigate = useNavigate()

  const addBlog = (event) => {
    event.preventDefault()
    createBlog(newBlog)

    navigate('/')
    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>Create a new blog </h2>

      <form onSubmit={addBlog}>
        <div>
          <TextField
            label='title'
            margin='dense'
            size='small'
            value={newBlog.title}
            onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
          />
        </div>
        <div>
          <TextField
            label='author'
            margin='dense'
            size='small'
            value={newBlog.author}
            onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
          />
        </div>
        <div>
          <TextField
            label='url'
            margin='dense'
            size='small'
            value={newBlog.url}
            onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
          />
        </div>
        <Button type='submit' variant='contained' style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </div>
  )
}

export default NewBlogForm