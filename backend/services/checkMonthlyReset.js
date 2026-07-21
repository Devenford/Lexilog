const Settings = require('../models/settings')
const User = require('../models/user')

const checkMonthlyReset = async () => {
  let setting = await Settings.findOne({ key: 'lastMonthlyReset' })

  if (!setting) {
    setting = await Settings.create({
      key: 'lastMonthlyReset',
      value: new Date()
    })
  }

  const lastReset = setting.value
  const now = new Date()

  const isNewMonth = lastReset.getFullYear() !== now.getFullYear() || lastReset.getMonth() !== now.getMonth()

  if (isNewMonth) {
    // Reset everyone's monthly xp
    await User.updateMany({}, { $set: { monthlyXp: 0 } })

    setting.value = now
    await setting.save()
  }
}

module.exports = checkMonthlyReset