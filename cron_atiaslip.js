var fs = require('fs')
var { CronJob } = require('cron')
const { atiaslipclaim } = require('./atiaslip')

var multiplier = 0
var secondsWait = 1200 // 20 minutes
var ms = 0

const claimStakeAndRestakeAllWithSleep = () => {
  console.log(
    'Triggered cron at ' +
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
  )
  console.log(
    'Claiming slip now at ' +
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
  )
  atiaslipclaim()
}

claimStakeAndRestakeAllWithSleep()

var job = new CronJob(
  '0 10 11 * * *',
  claimStakeAndRestakeAllWithSleep,
  null,
  true,
  'Asia/Manila'
)
