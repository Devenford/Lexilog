const UserWord = require('../../models/userWord')
const Word = require('../../models/word')
const { pickWords, pickRandomWords } = require('./wordsSelection')

// Target: 10-word quiz with 6 learning, 1 new, and 3 mastered words.
// Remaining slots are filled from available learning/mastered words.
const QUIZ_SIZE = 10
const LEARN_SIZE = 6
const NEW_SIZE = 1
const MASTERED_SIZE = 3

const shuffle = (originalArray) => {
  const shuffledArray = [...originalArray]  // do not mutate the original array
  //Fisher-Yates shuffle:
  for (let i=shuffledArray.length-1; i>0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
  }
  return shuffledArray
}

const getQuizWords = async (userId) => {
  const userWords = await UserWord.find({ user: userId }).populate('word')

  const learning = userWords.filter(w => w.status === 'learning')
  const mastered = userWords.filter(w => w.status === 'mastered')
  // eslint-disable-next-line no-useless-assignment
  let quizWords = []

  // 0.) For a new user: (Add 10 new words)
  if (userWords.length === 0) {
    const easyWords = await Word.find({ difficulty: 'Easy' })

    return pickRandomWords(easyWords, QUIZ_SIZE)
  }

  // 1.) Add learning words (6 learning)
  quizWords = pickWords(learning, LEARN_SIZE)

  // 2.) Add new, unseen words (1 new word)
  const assignedWordIds = userWords.map(w => w.word._id)

  const unseenWords = await Word.find({
    _id : { $nin: assignedWordIds }
  })
  // pick random new words:
  const newWords = pickRandomWords(unseenWords, NEW_SIZE)

  for (const word of newWords) {
    quizWords.push({
      word
    })
  }

  // 3.) Add already mastered words for revision (3 mastered words)
  mastered.sort((a, b) => (a.lastReviewed - b.lastReviewed))
  // pick the oldest reviewed mastered words
  quizWords.push(...mastered.slice(0, MASTERED_SIZE))

  // 4.) Fill the remaining slots with learning or mastered words
  if (quizWords.length < QUIZ_SIZE) {
    const selectedIds = new Set(
      quizWords.map(qw => qw.word._id.toString())
    )
    // you require .toString(), since ._id returns an ObjectId and Set.has() compares objects by reference

    const remaining = [...learning, ...mastered].filter(qw => !selectedIds.has(qw.word._id.toString()))

    quizWords.push(...pickWords(remaining, QUIZ_SIZE - quizWords.length))
  }

  quizWords = quizWords.map(qw => qw.word)
  return shuffle(quizWords)
  // without shuffling, the order of the words will always be: learning words, new words, mastered words
}

module.exports = {
  getQuizWords
}