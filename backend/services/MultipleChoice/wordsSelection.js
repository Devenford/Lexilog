const getWeight = (proficiency) => {
  if (proficiency < 20) return 10
  if (proficiency < 40) return 8
  if (proficiency < 60) return 6
  if (proficiency < 80) return 4
  if (proficiency < 100) return 2
  return 1
}

const pickWeighted = (userwords) => {
  const total = userwords.reduce((sum, userword) => sum + getWeight(userword.proficiency), 0)

  let random = Math.random() * total
  for (const userword of userwords) {
    random -= getWeight(userword.proficiency)

    if (random <= 0) {
      return userword
    }
  }
}
/* pickWeighted performs Weighted Random Selection. So, every word has a chance of being picked, but words with higher weights are more likely to be chosen.
A word with proficiency 10 (weight 10) is 10 times as likely to be selected as a mastered word with proficiency 100 (weight 1). This biases quizzes toward words the user knows less well while still occasionally reviewing mastered words.
*/

const pickWords = (userwords, count) => { // count is the number of words you wanna pick from userwords
  const pool = [...userwords] // pool of possible words to select from
  const selected = []

  while (pool.length && selected.length < count) {
    const chosen = pickWeighted(pool)
    selected.push(chosen)
    pool.splice(pool.indexOf(chosen), 1) // delete selected word from pool
  }

  return selected
}

module.exports = {
  pickWords
}