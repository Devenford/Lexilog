const MultipleChoiceResultCalculation = ({ tries, userword, user }) => {

  switch (tries) {
    case 1:
      userword.proficiency = Math.min(100, userword.proficiency + 10)
      user.coins += 2
      user.xp += 6
      user.monthlyXp += 6
      break
    case 2:
      userword.proficiency = Math.min(100, userword.proficiency + 5)
      user.coins += 1
      user.xp += 4
      user.monthlyXp += 4
      break
    default:
      user.xp += 2
      user.monthlyXp += 2
  }

  if (userword.proficiency >= 100) {
    userword.status = 'mastered'
  }

  userword.lastReviewed = new Date()
}

module.exports = MultipleChoiceResultCalculation