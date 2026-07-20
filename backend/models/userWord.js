const mongoose = require('mongoose')

// Each UserWord document is the progress record for one user on one word. Ex: (Alice, brazen)

const userWordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  word: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Word',
    required: true
  },
  proficiency: {     // 0-99 = learning, 100 = mastered
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['learning', 'mastered'], // The status field is only allowed to have one of these values: 'learning' or 'mastered'
    default: 'learning',
  },
  lastReviewed: {
    type: Date
  }
})

/* .index() Ensures each user can have only one progress record per word: (Alice, brazen), (Alice, abate)

It also creates an index to make lookups like: UserWord.findOne({ user, word }) fast.
*/
userWordSchema.index(
  { user: 1, word: 1 },
  { unique: true }
)

userWordSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('UserWord', userWordSchema)