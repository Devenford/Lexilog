const { test, after, beforeEach, describe, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const UserWord = require('../models/userWord')
const helper = require('./helper')

const api = supertest(app)

const testUser = {
  username: 'albert123',
  name: 'Albert Einstein',
  password: 'emc2gravity'
}
const QUIZ_LENGTH = 10 // number of quiz words

before(async () => {
  await User.deleteMany({})

  const response = await api
    .post('/api/users')
    .send(testUser)

  testUser.token = response.body.token
  testUser.userId = response.body.id
})

describe('get multiple choice questions', () => {
  beforeEach(async () => {
    await UserWord.deleteMany({})
  })

  test('succeeds with a valid token', async () => {
    const response = await api
      .get('/api/practice/multiple-choice')
      .set('Authorization', `Bearer ${testUser.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const quizWords = response.body
    assert.strictEqual(quizWords.length, QUIZ_LENGTH)
  })

  test('fails with an invalid token', async () => {
    const response = await api
      .get('/api/practice/multiple-choice')
      .set('Authorization', 'Bearer invalidtoken12345')
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('token invalid'))
  })
})

describe('submit multiple choice answers', () => {
  beforeEach(async () => {
    await UserWord.deleteMany({})
    // get the quiz words
    const response = await api
      .get('/api/practice/multiple-choice')
      .set('Authorization', `Bearer ${testUser.token}`)

    testUser.quizWords = response.body
  })

  test('succeeds with a valid token', async () => {
    const userWordsAtStart = await helper.getUserWords(testUser.userId)

    const userAnswers = testUser.quizWords.map(qw => ({
      word: qw.word,
      id: qw.id,
      tries: 1
    }))

    const response = await api
      .post('/api/practice/multiple-choice')
      .set('Authorization', `Bearer ${testUser.token}`)
      .send(userAnswers)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    testUser.quizResult = {
      coinsGained: response.body.coinsGained,
      xpGained: response.body.xpGained,
      currentStreak: response.body.currentStreak,
      longestStreak: response.body.longestStreak
    }

    const expectedResult = {
      coinsGained: 20,
      xpGained: 60,
      currentStreak: 1,
      longestStreak: 1
    }

    assert.deepStrictEqual(testUser.quizResult, expectedResult)

    const userWordsAtEnd = await helper.getUserWords(testUser.userId)

    assert.strictEqual(userWordsAtEnd.length, userWordsAtStart.length + 10) // 10 userWords have been added for the new user
  })

  test('fails with an invalid token', async () => {
    const userWordsAtStart = await helper.getUserWords(testUser.userId)

    const userAnswers = testUser.quizWords.map(qw => ({
      word: qw.word,
      id: qw.id,
      tries: 1
    }))

    const response = await api
      .post('/api/practice/multiple-choice')
      .set('Authorization', 'Bearer invalidtoken12345')
      .send(userAnswers)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('token invalid'))

    const userWordsAtEnd = await helper.getUserWords(testUser.userId)
    assert.strictEqual(userWordsAtEnd.length, userWordsAtStart.length)
  })

  test('fails if less than 10 user answers are submitted', async () => {
    const userWordsAtStart = await helper.getUserWords(testUser.userId)

    const userAnswers = testUser.quizWords
      .slice(0, 9)  // pick first 9 words
      .map(qw => ({
        word: qw.word,
        id: qw.id,
        tries: 1
      }))

    const response = await api
      .post('/api/practice/multiple-choice')
      .set('Authorization', `Bearer ${testUser.token}`)
      .send(userAnswers)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(response.body.error.includes('exactly 10 answers are required'))

    const userWordsAtEnd = await helper.getUserWords(testUser.userId)
    assert.strictEqual(userWordsAtEnd.length, userWordsAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})