const router = require('express').Router()
const Word = require('../models/word')
const User = require('../models/user')
const { userExtractor, adminOnly } = require('../utils/middleware')

// Only Admins can reset the state of the database (adminOnly middleware)
router.post('/reset', userExtractor, adminOnly, async (request, response) => {
  await Word.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router