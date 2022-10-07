var fs = require('fs')
const { restakeAll } = require('.')
var { CronJob } = require('cron')
const { claimAll } = require('./landIndex')

var multiplier = 0
var secondsWait = 20
var ms = 0

const claimAndRestakeAllWithSleep = () => {
  fs.readFile('counter.txt', 'utf8', async (err, data) => {
    console.log('Triggered cron at ' + new Date().toLocaleString())
    multiplier = data
    ms = multiplier * (1000 * secondsWait)
    var waitClaimMs = 10000

    console.log('Will wait for ' + (ms/1000) + ' seconds before claiming')
    await new Promise(r => setTimeout(r, ms))
    console.log('Claiming now at ' + new Date().toLocaleString())
    claimAll()
    console.log('Will wait for ' + (waitClaimMs/1000) + ' seconds before restaking')
    await new Promise(r => setTimeout(r, waitClaimMs))
    console.log('Restaking now at ' + new Date().toLocaleString())
    restakeAll()
    multiplier = Number(multiplier + 1)
    fs.writeFile('counter.txt', '' + multiplier, () => {
        console.log('Updated mins now to ' + multiplier)
    })
  })
}

var job = new CronJob(
  '0 48 19 * * *',
  claimAndRestakeAllWithSleep,
  null,
  true
)