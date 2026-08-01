const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const app = require('../app')
const User = require('../models/user')
const helper = require('./helper')

const api = supertest(app)

const newUser = {
  username: 'albert123',
  name: 'Albert Einstein',
  password: 'emc2gravity'
}

describe('sign up', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({
      username: 'root',
      passwordHash
    })
    await user.save()
  })

  test('succeeds when the username and password exist and are valid', async () => {
    const usersAtStart = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('fails when the username is already taken', async () => {
    const usersAtStart = helper.usersInDb()
    const duplicateUser = {
      username: 'root',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  describe('when an invalid user is added', () => {
    test('fails if the username is absent', async () => {
      const usersAtStart = await helper.usersInDb()

      const result = await api
        .post('/api/users')
        .send({ ...newUser, username: '' })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('username is required'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails if the password is absent', async () => {
      const usersAtStart = await helper.usersInDb()

      const result = await api
        .post('/api/users')
        .send({ ...newUser, password: '' })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('password is required'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails if the username is shorter than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb()

      const result = await api
        .post('/api/users')
        .send({ ...newUser, username: 'ab' })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('username must be at least 3 characters long'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('fails if the password is shorter than 3 characters', async () => {
      const usersAtStart = await helper.usersInDb()

      const result = await api
        .post('/api/users')
        .send({ ...newUser, password: 'pa' })
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('password must be at least 3 characters long'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
  })
})

describe('get current user', () => {
  let userToken, userId

  beforeEach(async () => {
    await User.deleteMany({})

    const response = await api
      .post('/api/users')
      .send(newUser)

    userToken = response.body.token
    userId = response.body.id
  })

  describe('when the user exists', () => {
    test('succeeds with a valid token', async () => {
      const result = await api
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(result.body.username, newUser.username)
    })

    test('fails with an invalid token', async () => {
      const result = await api
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalidtoken12345')
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert(result.body.error.includes('token invalid'))
    })

    test('fails with an expired token', async () => {
      const userForToken = {
        username: newUser.username,
        id: userId
      }
      const expiredToken = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: -1 }  // -1 = expires on creation
      )

      const result = await api
        .get('/api/users/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert(result.body.error.includes('token expired'))
    })
  })

  test('fails when the user does not exist', async () => {
    await User.findByIdAndDelete(userId)

    const result = await api
      .get('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('userId missing or not valid'))
  })
})


after(async () => {
  await mongoose.connection.close()
})