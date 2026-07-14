const router = require('express').Router()
const Word = require('../models/word')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Word.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router