const mongoose = require('mongoose')
const config = require('../../utils/config')
const logger = require('../../utils/logger')
const User = require('../../models/user')

// migration script
const updateUsers = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, { family: 4 })
    logger.info('connected to MongoDB')

    const result = await User.updateMany(
      {},
      { $set:
        { currentStreak: 0,
          longestStreak: 0,
          lastPracticeDate: null
        }
      }
    )

    logger.info(`Updated ${result.modifiedCount} users`)
  }
  catch(error) {
    logger.error('Error updating users:', error.message)
  }
  finally {
    await mongoose.connection.close()
  }
}

updateUsers()