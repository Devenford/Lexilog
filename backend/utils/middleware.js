const jwt = require('jsonwebtoken')
const logger = require('./logger')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path: ', request.path)
  logger.info('Body: ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
} // No next() needed because sending the response ends the request-response cycle

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if(error.name==='CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }
  else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token =  authorization.replace('Bearer ', '')
    // a new token property is created and assigned a value
  }
  else {
    request.token = null
  }

  next()
}

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // .verify only checks if the token is authentic/valid, it doesn't check if the blog (with the given id) belongs to the user that sent the request. Thus, anyone with a valid token and UserId could delete any blog, even ones that don't belong to them.
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(401).json({ error: 'userId missing or not valid' })
  }
  /*
  Checking whether the user exists is important. Consider this scenario:
  1. User Alice creates a blog.
  2. Alice logs in and gets a valid JWT.
  3. Alice's account is deleted from the database.
  4. Her JWT hasn't expired yet.

  Without the user lookup, the token could still authorize actions based solely on the embedded ID. With the lookup, deleted users immediately lose access.
  */

  request.user = user
  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}