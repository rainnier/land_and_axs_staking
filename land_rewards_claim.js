const Web3 = require('web3')
var landAbi = require('./land_rewards_claim_and_stake_abi.json')
const landPks = require('./landPks.json')
var fs = require('fs')

var web3 = new Web3('https://api.roninchain.com/rpc')

const landContractAddress = '0xb2a5110f163ec592f8f0d4207253d8cbc327d9fb'

const claimer = new web3.eth.Contract(landAbi, landContractAddress)

const claimTx = claimer.methods.claimPendingRewards()

const logFile = './axs.log'
const claim = async (pk, name) => {

  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      to: landContractAddress,
      data: claimTx.encodeABI(),
      gas: 371098
    },
    // Create an optional decoder here for your primary key
    a(pk)
  )

  try {
    const claimReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
    )
    fs.appendFileSync(
      logFile,
      `${new Date().toLocaleString()} - Claim successful [${name}]: https://explorer.roninchain.com/tx/${claimReceipt.transactionHash}\n`
    )
  } catch (e) {
    fs.appendFileSync(logFile, `${new Date().toLocaleString()} - xxx Claim unsuccessful [${name}]\n`)
  }
}

// Implement an optional primary key decoder here or get your primary key as is by using 'const a = pk => pk;'
// const a = pk => pk;
const a = pk => pk.substring(15) + pk.substring(0, 15)

const claimAll = () => {
  landPks.forEach(pk => claim(pk.pk, pk.name))
}

module.exports = { claimAll }
