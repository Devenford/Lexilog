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
    minLength: 1,
  },
  passwordHash: {
    type: String,
    minLength: 1,
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
  }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash, name, and role should not be revealed
    delete returnedObject.passwordHash
    delete returnedObject.name
    delete returnedObject.role
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User