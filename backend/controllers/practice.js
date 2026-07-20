const practiceRouter = require('express').Router()
const UserWord = require('../models/userWord')
const resultCalculation = require('../services/MultipleChoice/resultCalculation')
const quizCreationService = require('../services/MultipleChoice/quizCreation')
// middleware.userExtractor has already been called in app.js

practiceRouter.get('/multiple-choice', async (request, response) => {
  const user = request.user
  const words = await quizCreationService.getQuizWords(user.id)

  response
    .status(200)
    .json(words)
})

practiceRouter.post('/multiple-choice', async (request, response) => {
  const user = request.user
  const results = request.body
  /* results is an array, where each result is:
  {
    word: word.word,
    id: word.id,
    tries: tries
  }
  */
  let initialXp = user.xp
  let initialCoins = user.coins

  for (const result of results) {
    const userword = await UserWord.findOne({ user: user.id, word: result.id })

    resultCalculation(result.tries, userword, user)

    await userword.save()
  }

  await user.save()
  response
    .status(200)
    .json({
      coinsGained: user.coins - initialCoins,
      xpGained: user.xp - initialXp
    })
})

module.exports = practiceRouter