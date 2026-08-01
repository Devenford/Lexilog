const { test, after, beforeEach, describe, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

const testUsers = [
  {
    username: 'albert123',
    name: 'Albert Einstein',
    password: 'emc2gravity'
  },
  {
    username: 'techwiz99',
    name: 'Alan Turing',
    password: 'enigma1940'
  },
  {
    username: 'sarah_connor',
    name: 'Sarah Connor',
    password: 'future1984'
  }
]

before(async () => {
  const saltRounds = 10
  for (const testUser of testUsers) {
    testUser.passwordHash = await bcrypt.hash(testUser.password, saltRounds)
  }
})

describe('requesting leaderboard', () => {
  let token // for first testUser's login (albert123)

  beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(testUsers.map(u => ({
      username: u.username,
      name: u.name,
      passwordHash: u.passwordHash
    })))

    // albert123 login
    const response = await api
      .post('/api/login')
      .send({
        username: testUsers[0].username,
        password: testUsers[0].password
      })

    token = response.body.token
  })

  test('succeeds with a valid token', async () => {
    const response = await api
      .get('/api/leaderboard')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.usersByCoins.length, testUsers.length)
    assert.strictEqual(response.body.usersByXp.length, testUsers.length)
    assert.strictEqual(response.body.usersByMonthlyXp.length, testUsers.length)
  })

  test('fails with an invalid token', async () => {
    const response = await api
      .get('/api/leaderboard')
      .set('Authorization', 'Bearer invalidtoken12345')
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('token invalid'))
  })
})

after(async () => {
  await mongoose.connection.close()
})