const testingRouter = require('express').Router()
const UserWord = require('../models/userWord')
const User = require('../models/user')

// reset endpoint/route is only exposed when: process.env.NODE_ENV === 'test'   in app.js
testingRouter.post('/reset', async (request, response) => {
  await UserWord.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter