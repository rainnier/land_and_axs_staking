var fs = require('fs')
const { restakeAll } = require('./axs_restaking')
var { CronJob } = require('cron')
const { claimAll } = require('./land_rewards_claim')
const { stakeAllBalance } = require('./axs_balance_staking')

var multiplier = 0
var secondsWait = 1200 // 20 minutes
var ms = 0

const claimStakeAndRestakeAllWithSleep = () => {
  fs.readFile('counter.txt', 'utf8', async (err, data) => {
    console.log(
      'Triggered cron at ' +
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
    )
    multiplier = data
    ms = multiplier * (1000 * secondsWait)
    var waitClaimToCompleteMs = 30 * 1000 // 30 seconds
    var waitStakeToCompleteMs = 20 * 60 * 1000 // 20 minutes

    if (+multiplier === 72) {
      // Reached 24 hours (72 times of 20 minutes)
      // Reset multiplier to 0 to ignore current cron trigger and trigger the next 1 for the whole 24 hours
      multiplier = 0
      fs.writeFile('counter.txt', '' + multiplier, () => {
        console.log('Resetting multiplier now to ' + multiplier)
      })
    } else {
      multiplier++
      fs.writeFile('counter.txt', '' + multiplier, () => {
        console.log('Updated multiplier now to ' + multiplier)
      })

      console.log('Will wait for ' + ms / 1000 + ' seconds before claiming')
      await new Promise(r => setTimeout(r, ms))
      console.log(
        'Claiming now at ' +
          new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
      )
      claimAll()

      console.log(
        'Will wait for ' +
          waitClaimToCompleteMs / 1000 +
          ' seconds before staking land rewards'
      )
      await new Promise(r => setTimeout(r, waitClaimToCompleteMs))
      console.log(
        'Staking AXS land rewards now at ' +
          new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
      )
      stakeAllBalance()

      console.log(
        'Will wait for ' +
          waitStakeToCompleteMs / 1000 +
          ' seconds before restaking'
      )
      await new Promise(r => setTimeout(r, waitStakeToCompleteMs))
      console.log(
        'Restaking AXS now at ' +
          new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
      )
      restakeAll()
    }
  })
}

var job = new CronJob(
  '0 21 14 * * *',
  claimStakeAndRestakeAllWithSleep,
  null,
  true,
  'Asia/Manila'
)
