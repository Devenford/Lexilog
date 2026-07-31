const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    required: true,
    unique: true  // this ensures uniqueness of username
  },
  name: {
    type: String,
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: { // user or admin
    type: String,
    required: true,
    default: 'user'
  },
  coins: {
    type: Number,
    default: 0
  },
  xp: {
    type: Number,
    default: 0
  },
  monthlyXp: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0,
  },
  lastPracticeDate: {
    type: Date,
    default: null,
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash and name should not be revealed
    delete returnedObject.passwordHash
    delete returnedObject.name
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User