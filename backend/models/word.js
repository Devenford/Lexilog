const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    minLength: 1,
    required: true,
    unique: true // this ensures uniqueness of the word
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
  paragraphs: [      // 3 entries in default list
    {
      type: String,
      minLength: 1,
      required: true
    }
  ]
})

wordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Word', wordSchema)