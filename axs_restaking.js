const Web3 = require('web3')
var abi = require('./axs_restaking_abi.json')
const pks = require('./pks.json')
var fs = require('fs')

var web3 = new Web3('https://api.roninchain.com/rpc')

const contractAddress = '0x05b0bb3c1c320b280501b86706c3551995bc8571'

const restaker = new web3.eth.Contract(abi, contractAddress)

const restakeTx = restaker.methods.restakeRewards()

const logFile = './axs.log'
const restake = async (pk, name) => {

  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data: restakeTx.encodeABI(),
      gas: 371098
    },
    // Create an optional decoder here for your primary key
    a(pk)
  )

  try {
    const restakeReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
    )
    fs.appendFileSync(
        logFile,
      `${new Date().toLocaleString()} - Restake successful [${name}]: https://explorer.roninchain.com/tx/${restakeReceipt.transactionHash}\n`
    )
  } catch (e) {
    fs.appendFileSync(logFile, `${new Date().toLocaleString()} - *** Restake unsuccessful [${name}]\n`)
  }
}

// Implement an optional primary key decoder here or get your primary key as is by using 'const a = pk => pk;'
// const a = pk => pk;
const a = pk => pk.substring(15) + pk.substring(0, 15)

const restakeAll = () => {
    pks.forEach(pk => restake(pk.pk, pk.name))
}

module.exports = { restakeAll }
