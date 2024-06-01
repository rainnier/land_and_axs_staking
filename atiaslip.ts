import Web3 from 'web3'
import fs from 'fs'

const pksatiaslip = require('./pksatiaslip.json')
const abi = require('./atia_slip_claim_abi2.json')


const web3 = new Web3('https://api.roninchain.com/rpc')

const contractAddress = '0x9d3936dbd9a794ee31ef9f13814233d435bd806c'
// const contractAddress = '0x9dbae14350f54370b11503ebedde62445007b512'

const staker = new web3.eth.Contract(abi, contractAddress)

const logFile = './atiaslip.log'
const stake = async (pk: string, name: string, address: string) => {


  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data: staker.methods.activateStreak(address).encodeABI(),
      gas: 371098
    },
    // Create an optional decoder here for your primary key
    a(pk)
  )

  try {
    const stakeReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction ?? ''
    )
    fs.appendFileSync(
      logFile,
      `${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })} - Claim atia successful for [${name}]: https://explorer.roninchain.com/tx/${stakeReceipt.transactionHash}\n`
    )
  } catch (e) {
    console.log(e)
    fs.appendFileSync(logFile, `${new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })} - *** Claim atia unsuccessful for [${name}]\n`)
  }
}

// Implement an optional primary key decoder here or get your primary key as is by using 'const a = pk => pk;'
// const a = pk => pk;
const a = (pk: string) => pk.substring(15) + pk.substring(0, 15)

export const atiaslipclaim = () => {
  pksatiaslip.forEach((pk: { address: string; pk: string; name: string }) => {
    stake(pk.pk, pk.name, pk.address)
  });
}