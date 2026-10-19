const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const UserWord = require('../models/userWord')
const updateStreak = require('../services/updateStreak')

const TOTAL_WORDS = 720

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) { // or !user || !passwordCorrect (DeMorgan's laws)
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET,
    { expiresIn: 24*60*60 }  // (in seconds) or '24h'
  )

  const masteredCount = await UserWord.countDocuments({
    user: user._id,
    status: 'mastered'
  })

  const oldStreak = user.currentStreak
  updateStreak(user, 'check current streak')
  if (user.currentStreak !== oldStreak) {
    await user.save()
  }

  response
    .cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000  // in milliseconds
    })
    .status(200)
    .json({
      ...user.toJSON(),
      masteredWords: masteredCount,
      totalWords: TOTAL_WORDS
    })
  // We can send the name here (in the login endpoint), since only an authentic user (with the right username and password credentials) can login. Thus, only the user will have access to their name.
  // Don't call .json(), since it would call the toJSON() transformation, which would delete the name
})

loginRouter.delete('/', (request, response) => {
  response
    .clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    })
    .status(204)
    .end()
})

module.exports = loginRouter