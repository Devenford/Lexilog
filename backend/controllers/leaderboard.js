const leaderboardRouter = require('express').Router()
const User = require('../models/user')
const checkMonthlyReset = require('../services/checkMonthlyReset')
// middleware.userExtractor has already been called in app.js

leaderboardRouter.get('/', async (request, response) => {
  await checkMonthlyReset()

  const [usersByCoins, usersByXp, usersByMonthlyXp] = await Promise.all([
    User.find({ role: { $ne: 'admin' } })
      .select({ username: 1, coins: 1 })
      .sort({ coins: 'desc' })
      .limit(100),
    User.find({ role: { $ne: 'admin' } })
      .select({ username: 1, xp: 1 })
      .sort({ xp: 'desc' })
      .limit(100),
    User.find({ role: { $ne: 'admin' } })
      .select({ username: 1, monthlyXp: 1 })
      .sort({ monthlyXp: 'desc' })
      .limit(100)
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