const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const testUser = {
  username: 'albert123',
  name: 'Albert Einstein',
  password: 'emc2gravity'
}

describe('user login', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await api
      .post('/api/users')
      .send(testUser)
  })

  test('succeeds with valid credentials', async () => {
    const response = await api
      .post('/api/login')
      .send({ username: testUser.username, password: testUser.password })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, testUser.username)
  })

  describe('with invalid credentials', () => {
    test('fails with invalid username', async () => {
      const response = await api
        .post('/api/login')
        .send({ username: 'invalid', password: testUser.password })
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert(response.body.error.includes('invalid username or password'))
    })

    test('fails with invalid password', async () => {
      const response = await api
        .post('/api/login')
        .send({ username: testUser.username, password: 'invalid' })
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert(response.body.error.includes('invalid username or password'))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})