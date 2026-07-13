const lodash = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0 ? null : blogs.reduce((maxBlog, blog) => blog.likes > maxBlog.likes ? blog : maxBlog)
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const authorCounts = []
  blogs.forEach(blog => {
    const authorObject = authorCounts.find(authorObject => authorObject.author === blog.author)

    if(authorObject) {
      authorObject.blogs++
    }
    else {
      authorCounts.push({ author: blog.author, blogs: 1 })
    }
  })

  return authorCounts.reduce((max, curr) => curr.blogs > max.blogs ? curr : max)
}

const mostBlogsLodash = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = lodash.countBy(blogs, 'author')
  //counts = {"Robert C. Martin": 3, "Edsger W. Dijkstra": 2}

  const topAuthor = lodash.maxBy(Object.entries(counts), ([author, blogs]) => blogs)
  // Object.entries returns [["Robert C. Martin", 3], ["Edsger W. Dijkstra", 2]]
  // among all the elements [author, blogs], the max element is found wrt blogs:
  // topAuthor = ["Robert C. Martin", 3]

  return {
    author: topAuthor[0],
    blogs: topAuthor[1]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length===0) {
    return null
  }

  const authorLikeCounts = []
  blogs.forEach(blog => {
    const authorObject = authorLikeCounts.find(a => a.author === blog.author)

    if(authorObject) {
      authorObject.likes += blog.likes
    }
    else {
      authorLikeCounts.push({ author: blog.author, likes: blog.likes })
    }
  })

  return authorLikeCounts.reduce((max, curr) => curr.likes > max.likes ? curr : max)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostBlogsLodash,
  mostLikes
}