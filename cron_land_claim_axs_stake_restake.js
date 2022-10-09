var fs = require('fs')
const { restakeAll } = require('./axs_restaking')
var { CronJob } = require('cron')
const { claimAll } = require('./land_rewards_claim')
const { stakeAllBalance } = require('./axs_balance_staking')

var multiplier = 0
var secondsWait = 600
var ms = 0

const claimStakeAndRestakeAllWithSleep = () => {
  fs.readFile('counter.txt', 'utf8', async (err, data) => {
    console.log('Triggered cron at ' + new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }))
    multiplier = data
    ms = multiplier * (1000 * secondsWait)
    var waitClaimToCompleteMs = 5*60*1000
    var waitStakeToCompleteMs = 5*60*1000

    // console.log('Will wait for ' + ms / 1000 + ' seconds before claiming')
    // await new Promise(r => setTimeout(r, ms))
    // console.log('Claiming now at ' + new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }))
    // claimAll()

    console.log(
      'Will wait for ' +
        waitClaimToCompleteMs / 1000 +
        ' seconds before staking land rewards'
    )
    //await new Promise(r => setTimeout(r, waitClaimToCompleteMs))
    console.log(
      'Staking AXS land rewards now at ' + new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })
    )
    stakeAllBalance()

    // console.log(
    //   'Will wait for ' +
    //     waitStakeToCompleteMs / 1000 +
    //     ' seconds before restaking'
    // )
    // await new Promise(r => setTimeout(r, waitStakeToCompleteMs))
    // console.log('Restaking AXS now at ' + new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }))
    // restakeAll()

    multiplier = Number(multiplier + 1)
    fs.writeFile('counter.txt', '' + multiplier, () => {
      console.log('Updated multiplier now to ' + multiplier)
    })
  })
}

var job = new CronJob(
  '0 25 2 * * *',
  claimStakeAndRestakeAllWithSleep,
  null,
  true,
  'Asia/Manila'
)
