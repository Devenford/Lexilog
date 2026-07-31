const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const usersRouter = require('express').Router()
const User = require('../models/user')
const UserWord = require('../models/userWord')
const { userExtractor } = require('../utils/middleware')
const updateStreak = require('../services/updateStreak')

const TOTAL_WORDS = 720

usersRouter.get('/me', userExtractor, async (request, response) => {
  const user = await User.findById(request.user.id)
  const masteredCount = await UserWord.countDocuments({
    user: request.user.id,
    status: 'mastered'
  })

  const oldStreak = user.currentStreak
  updateStreak(user, 'check current streak')
  if (user.currentStreak !== oldStreak) {
    await user.save()
  }

  // user is a mongoose document
  response.status(200)
    .json({
      ...user.toJSON(),
      masteredWords: masteredCount,
      totalWords: TOTAL_WORDS
    })
  // When .json() is called the .toJSON() transformation is called from the userSchema, which deletes the passwordHash, name, and role before sending the array of users in the response.
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!username) {
    return response.status(400).json({ error: 'username is required' })
  }

  if (!password) {
    return response.status(400).json({ error: 'password is required' })
  }
  if (username.length < 3) {
    return response.status(400).json({ error: 'username must be at least 3 characters long' })
  }
  if (password.length < 3) {
    return response.status(400).json({ error: 'password must be at least 3 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  // Only the first 72 bytes of a password string are used for hashing
  // Resultant hashes will always be 60 characters long

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

  const masteredCount = await UserWord.countDocuments({
    user: savedUser._id,
    status: 'mastered'
  })

  response
    .status(201)
    .json({
      token,
      ...savedUser.toJSON(),
      masteredWords: masteredCount,
      totalWords: TOTAL_WORDS
    })
})

module.exports = usersRouter