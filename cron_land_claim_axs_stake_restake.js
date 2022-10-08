var fs = require('fs')
const { restakeAll } = require('.')
var { CronJob } = require('cron')
const { claimAll } = require('./land_rewards_claim')

var multiplier = 0
var secondsWait = 20
var ms = 0

const claimStakeAndRestakeAllWithSleep = () => {
  fs.readFile('counter.txt', 'utf8', async (err, data) => {
    console.log('Triggered cron at ' + new Date().toLocaleString())
    multiplier = data
    ms = multiplier * (1000 * secondsWait)
    var waitClaimToCompleteMs = 10000
    var waitStakeToCompleteMs = 10000

    console.log('Will wait for ' + (ms/1000) + ' seconds before claiming')
    await new Promise(r => setTimeout(r, ms))
    console.log('Claiming now at ' + new Date().toLocaleString())
    claimAll()

    console.log('Will wait for ' + (waitClaimToCompleteMs/1000) + ' seconds before staking land rewards')
    await new Promise(r => setTimeout(r, waitClaimToCompleteMs))
    console.log('Staking AXS land rewards now at ' + new Date().toLocaleString())
    stake()

    console.log('Will wait for ' + (waitStakeToCompleteMs/1000) + ' seconds before restaking')
    await new Promise(r => setTimeout(r, waitStakeToCompleteMs))
    console.log('Restaking AXS now at ' + new Date().toLocaleString())
    restakeAll()

    multiplier = Number(multiplier + 1)
    fs.writeFile('counter.txt', '' + multiplier, () => {
        console.log('Updated multiplier now to ' + multiplier)
    })
  })
}

var job = new CronJob(
  '14 48 19 * * *',
  claimStakeAndRestakeAllWithSleep,
  null,
  true
)