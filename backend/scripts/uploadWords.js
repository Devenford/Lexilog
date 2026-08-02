const mongoose = require('mongoose')
const config = require('../utils/config')
const logger = require('../utils/logger')
const Word = require('../models/word')
const vocabulary = require('../../vocab-data/vocabulary_final.json')

const uploadWords = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, { family: 4 })
    logger.info('connected to MongoDB')

    await Word.insertMany(vocabulary)
    console.log('Uploaded Words to Database')
  }
  catch(error) {
    logger.error('error connecting to MongoDB:', error.message)
  }

  await mongoose.connection.close()
}

uploadWords()

// To seed the development database:
// node scripts/uploadWords.js

// To seed the test database:
// npx cross-env NODE_ENV=test node scripts/uploadWords.js