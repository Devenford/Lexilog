const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    minLength: 1,
    required: true
  },
  difficulty: {
    type: String,
    required: true
  },
  options: [
    {
      type: String,
      minLength: 1,
      required: true
    }
  ],
  paragraph1: {
    type: String,
    minLength: 1,
    required: true
  },
  paragraph2: {
    type: String,
    minLength: 1,
    required: true
  },
  paragraph3: {
    type: String,
    minLength: 1,
    required: true
  },
})

wordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', wordSchema)