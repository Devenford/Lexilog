const User = require('../models/user')
const UserWord = require('../models/userWord')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const getUserWords = async (userId) => {
  const response = await UserWord.find({ user : userId })
  return response.map(uw => uw.toJSON())
}

module.exports = {
  usersInDb,
  getUserWords
}