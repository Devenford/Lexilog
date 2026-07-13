const { test, after, beforeEach, describe, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let testUser

before(async () => {
  await User.deleteMany({})
  testUser = await helper.getTestUser()
})

describe('When a few blogs are initially saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})

    const initialBlogs = helper.initialBlogs.map(b => {
      return { ...b, user: testUser._id }
    })

    await Blog.insertMany(initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blogs contain id property, not _id', async () => {
    const response = await api.get('/api/blogs')
    assert(Object.keys(response.body[0]).includes('id'))
    assert(!Object.keys(response.body[0]).includes('_id'))
  })

  describe('addition of a new blog post', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Star Wars',
        author: 'George Lucas',
        url: 'http://starwars.com/revenge-of-the-sith',
        likes: 2,
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${helper.getTestToken(testUser)}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const savedBlog = await api
        .get(`/api/blogs/${response.body.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(savedBlog.body, response.body)
    })

    test('value of likes property is 0 by default', async () => {
      const newBlog = {
        title: 'Star Wars',
        author: 'George Lucas',
        url: 'http://starwars.com/revenge-of-the-sith',
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${helper.getTestToken(testUser)}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })

    test('fails with status code 400 if the title is missing', async () => {
      const newBlog = {
        author: 'George Lucas',
        url: 'http://starwars.com/revenge-of-the-sith',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${helper.getTestToken(testUser)}`)
        .send(newBlog)
        .expect(400)
    })

    test('fails with status code 400 if the url is missing', async () => {
      const newBlog = {
        title: 'Star Wars',
        author: 'George Lucas',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${helper.getTestToken(testUser)}`)
        .send(newBlog)
        .expect(400)
    })

    test('fails with status code 401 Unauthorized if the token is not provided', async () => {
      const newBlog = {
        title: 'Star Wars',
        author: 'George Lucas',
        url: 'http://starwars.com/revenge-of-the-sith',
        likes: 2,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  })

  describe('updating information of an individual blog', () => {
    test('succeeds with status code 200 if the id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToBeUpdated = blogsAtStart[0]
      const updatedBlogData = {
        ...blogToBeUpdated,
        likes: blogToBeUpdated.likes + 1,
        user: blogToBeUpdated.user.toString()
      }
      // .toJSON(), called in the test_helper, only converts the blog id to a string, NOT the user id. So, you must convert the user id to a string manually for the deepStrictEqual test below to work.

      const updatedBlog = await api
        .put(`/api/blogs/${updatedBlogData.id}`)
        .set('Authorization', `Bearer ${helper.getTestToken(testUser)}`)
        .send(updatedBlogData)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(updatedBlog.body, updatedBlogData)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if the id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${helper.getTestToken(testUser)}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map(blog => blog.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})