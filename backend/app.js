const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const wordsRouter = require('./controllers/words')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const practiceRouter = require('./controllers/practice')
const leaderboardRouter = require('./controllers/leaderboard')


const app = express()

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

//routing middleware
app.use('/api/words', middleware.userExtractor, wordsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/practice', middleware.userExtractor, practiceRouter)
app.use('/api/leaderboard', middleware.userExtractor, leaderboardRouter)
// middleware.userExtractor also checks the validity of the token and if the user's account exists

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app