import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography, Link, Button } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import HeartIcon from '@mui/icons-material/Favorite'

const Blog = ({ user, blog, updateLikes, deleteBlog }) => {
  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  const showIfLoggedIn = { display: user ? '' : 'none' }
  const showRemoveButton = { display: (user && user.id === blog.user.id) ? '' : 'none' }

  const handleDelete = () => {
    if (confirm(`Remove blog "${blog.title} by ${blog.author}"?`)) {
      deleteBlog(blog.id)
      navigate('/')
    }
  }

  return (
    <Card sx = {{ my: 1 }}>
      <CardContent>
        <Typography variant='h5' gutterBottom sx={{ fontWeight: 'medium' }} mb=''>
          {blog.title}
        </Typography>
        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
          by {blog.author}
        </Typography>
        <Link href={blog.url}>{blog.url}</Link>
        <Typography gutterBottom sx = {{ my: 1, color: 'text.secondary', fontSize: 14 }}>
          Added by {blog.user.name}
        </Typography>
        <Typography gutterBottom sx = {{ my: 1 }}>
          {blog.likes} likes
          <Button onClick={() => updateLikes(blog)} style={showIfLoggedIn} variant='outlined' startIcon={<HeartIcon />} sx = {{ mx: 1 }}>
            like
          </Button>
          <Button onClick={handleDelete} style={showRemoveButton} variant='outlined' color='error' startIcon={<DeleteIcon />}>
            remove
          </Button>
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Blog