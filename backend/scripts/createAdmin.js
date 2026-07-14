const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const config = require('../utils/config')
const logger = require('../utils/logger')
const User = require('../models/user')

const createAdmin = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI, { family: 4 })
    logger.info('connected to MongoDB')

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, saltRounds)

    const admin = new User({
      username: 'admin',
      name: 'Administrator',
      passwordHash,
      role: 'admin'
    })

    await admin.save()
    console.log('Admin created')
  }
  catch(error) {
    logger.error('error connecting to MongoDB:', error.message)
  }

  await mongoose.connection.close()
}

createAdmin()