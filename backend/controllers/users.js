const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
  // When .json() is called the .toJSON() transformation is called from the userSchema, which deletes the passwordHash, name, and role before sending the array of users in the response.
})

usersRouter.get('/me', userExtractor, async (request, response) => {
  const user = await User.findById(request.user.id)
  response.json(user)
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

  response.status(201).json(savedUser)
})

module.exports = usersRouter