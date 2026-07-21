const mongoose = require('mongoose')

const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    minLength: 1,
    required: true,
    unique: true // this ensures uniqueness of the word
  },
  difficulty: {  // 'Easy', 'Medium', or 'Hard'
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
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
  ],
  definitions: [ //contains subdocuments, each with its own id
    {
      definition: {
        type: String,
        required: true
      },
      paragraphIndices: {
        type: [Number],
        required: true
      }
    }
  ],
  synonyms: {
    type: [String],
    required: true
  }
})

wordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.definitions.forEach(def => {
      def.id = def._id.toString()
      delete def._id
    }) // for each subdocument

    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Word', wordSchema)