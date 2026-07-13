import { Link } from 'react-router-dom'
import Blog from '../components/Blog'

const Home = ({ blogs }) => {

  const sortedBlogs = blogs.toSorted((b1, b2) => b2.likes - b1.likes)
  /* Don't do this:
    blogs.sort((b1, b2) => b2.likes - b1.likes)
    Since blogs is a React state, you shouldn't mutate it directly!!!!!
    .sort() sorts in-place
    */

  return (
    <div>
      <h1>Blogs</h1>
      <ul>
        {sortedBlogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{`${blog.title} by ${blog.author}`}</Link>
          </li>
        ))}
      </ul>
    </div>
  )}

export default Home