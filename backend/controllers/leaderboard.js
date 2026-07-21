const leaderboardRouter = require('express').Router()
const User = require('../models/user')
const checkMonthlyReset = require('../services/checkMonthlyReset')
// middleware.userExtractor has already been called in app.js

leaderboardRouter.get('/', async (request, response) => {
  await checkMonthlyReset()

  const [usersByCoins, usersByXp, usersByMonthlyXp] = await Promise.all([
    User.find({})
      .select({ username: 1, coins: 1 })
      .sort({ coins: 'desc' }),
    User.find({})
      .select({ username: 1, xp: 1 })
      .sort({ xp: 'desc' }),
    User.find({})
      .select({ username: 1, monthlyXp: 1 })
      .sort({ monthlyXp: 'desc' })

  ]) // id field is included by default

  response
    .status(200)
    .json({
      usersByCoins,
      usersByXp,
      usersByMonthlyXp
    })
})

module.exports = leaderboardRouter