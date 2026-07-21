const wordsRouter = require('express').Router()
const Word = require('../models/word')
const { adminOnly } = require('../utils/middleware')
// middleware.userExtractor has already been called in app.js

wordsRouter.get('/', async (request, response) => {
  const words = await Word.find({})
  response.json(words)
})

wordsRouter.get('/:word', async (request, response) => {
  const word = await Word.findOne({ word: request.params.word })

  if (word) {
    response.json(word)
  }
  else {
    response.status(404).end()
  }
})

// Only Admins can create new words (adminOnly middleware)
wordsRouter.post('/', adminOnly, async (request, response) => {
  const body = request.body

  const word = new Word({
    word: body.word,
    difficulty: body.difficulty,
    options: body.options,
    paragraphs: body.paragraphs
  })

  const savedWord = await word.save()
  response.status(201).json(savedWord)
})

// Only Admins can modify words (adminOnly middleware)
wordsRouter.put('/:word', adminOnly, async (request, response) => {
  const { word, difficulty, options, paragraphs } = request.body
  const wordToBeUpdated = await Word.findOne({ word: request.params.word })

  if (!wordToBeUpdated) {
    return response.status(404).json({ error: 'word does not exist' })
  }

  /* Ownership check:
  const user = request.user
  if (wordToBeUpdated.user.toString() !== user._id.toString()) // you require .toString(), since .user and ._id return ObjectId and === compares objects by reference
  {
    return response.status(403).json({ error: 'forbidden updation' })
  }
  */

  wordToBeUpdated.word = word
  wordToBeUpdated.difficulty = difficulty
  wordToBeUpdated.options = options
  wordToBeUpdated.paragraphs = paragraphs

  const updatedWord = await wordToBeUpdated.save()

  response.status(200).json(updatedWord)
})

// Only Admins can delete words (adminOnly middleware)
wordsRouter.delete('/:id', adminOnly, async (request, response) => {
  const word = await Word.findOne({ word: request.params.word })
  if (!word) {
    return response.status(404).json({ error: 'word does not exist' })
  }

  /* Ownership check: (only the owner of the word can delete it)
  const user = request.user
  if (word.user.toString() !== user._id.toString()) // you require .toString(), since .user and ._id return ObjectId and === compares objects by reference
  {
    return response.status(403).json({ error: 'forbidden deletion' })
  }
  */

  await word.deleteOne()
  response.status(204).end()
  // status 204 is for 'no content in the response body'
})

module.exports = wordsRouter