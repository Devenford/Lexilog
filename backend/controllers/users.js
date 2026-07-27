const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../models/user')
const UserWord = require('../models/userWord')
const { userExtractor } = require('../utils/middleware')

const TOTAL_WORDS = 720

usersRouter.get('/me', userExtractor, async (request, response) => {
  const user = await User.findById(request.user.id)
  const masteredCount = await UserWord.countDocuments({
    user: request.user.id,
    status: 'mastered'
  })

  // user is a mongoose document
  response.json({
    ...user.toJSON(),
    masteredWords: masteredCount,
    totalWords: TOTAL_WORDS
  })
  // When .json() is called the .toJSON() transformation is called from the userSchema, which deletes the passwordHash, name, and role before sending the array of users in the response.
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password) {
    return response.status(400).json({ error: 'password is required' })
  }
  if (password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  const userForToken = {
    username: savedUser.username,
    id: savedUser._id
  }
  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 24*60*60 }  // or '24h'
  )

  response
    .status(201)
    .json({
      token,
      ...savedUser.toJSON()
    })
})

module.exports = usersRouter