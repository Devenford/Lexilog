const updateStreak = (user, updateType) => {
  const now = new Date()

  if (updateType === 'after practice') {
    if(!user.lastPracticeDate) {
    // First ever practice (new user)
      user.currentStreak = 1
    }
    else {
    // create a copy of lastPracticeDate to avoid mutation of the original value
      const last = new Date(user.lastPracticeDate)

      // Ignore the time of the day in the calculation by setting both dates to midnight
      now.setHours(0, 0, 0, 0)
      last.setHours(0, 0, 0, 0)

      const days = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)

      if (days === 0) {
      // Already practiced today
      }
      else if (days === 1) {
        user.currentStreak++
      }
      else {
        user.currentStreak = 1
      }
    }

    user.longestStreak = Math.max(user.longestStreak, user.currentStreak)
    user.lastPracticeDate = new Date()
  }
  else if (updateType === 'check current streak') { // updating/checking current streak
    if(!user.lastPracticeDate) {
    // (new user)
      return
    }
    else {
    // create a copy of lastPracticeDate to avoid mutation of the original value
      const last = new Date(user.lastPracticeDate)

      // Ignore the time of the day in the calculation by setting both dates to midnight
      now.setHours(0, 0, 0, 0)
      last.setHours(0, 0, 0, 0)

      const days = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)

      if (days > 1) {
        user.currentStreak = 0
      }
    }
  }
}

module.exports = updateStreak