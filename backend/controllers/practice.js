const practiceRouter = require('express').Router()
const UserWord = require('../models/userWord')

practiceRouter.get('/multiple-choice', async (request, response) => {
  const user = request.user

  const totalWords = await UserWord.countDocuments({ user })


  const userwords = await UserWord.find({ user })
    .sort({ score: 'asc' })
    .limit(10)

  if (userwords.length === 0) {
    await UserWord.insertMany()
  }
})

module.exports = practiceRouter