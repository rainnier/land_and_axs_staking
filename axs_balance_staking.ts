import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import fs from 'fs'

const landPks = require('./landPks.json')
const abi = require('./axs_stake_abi.json')


const web3 = new Web3('https://api.roninchain.com/rpc')

const AXS_TOKEN = '0x97a9107c1793bc407d6f527b77e7fff4d812bece'

const AXS_DECIMAL = 18

const contractAddress = '0x05b0bb3c1c320b280501b86706c3551995bc8571'

const staker = new web3.eth.Contract(abi, contractAddress)

// The minimum ABI to get ERC20 Token balance
let minABI:AbiItem[] = [
  // balanceOf
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "type": "function"
  },
  // decimals
  // {
  //   "constant": true,
  //   "inputs": [],
  //   "name": "decimals",
  //   "outputs": [{ "name": "", "type": "uint8" }],
  //   "type": "function"
  // }
];


const getBalance = async(walletAddress: string) => {
  let contract = new web3.eth.Contract(minABI, AXS_TOKEN);
  const balance = await contract.methods.balanceOf(walletAddress).call();
  return balance;
}

const logFile = './axs.log'
const stake = async (pk: string, name: string, axsToStake:number) => {

  const createTransaction = await web3.eth.accounts.signTransaction(
    {
      to: contractAddress,
      data: staker.methods.stake(axsToStake).encodeABI(),
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
      `${new Date().toLocaleString()} - Stake of land rewards successful of ${axsToStake/(10**AXS_DECIMAL)} [${name}]: https://explorer.roninchain.com/tx/${stakeReceipt.transactionHash}\n`
    )
  } catch (e) {
    fs.appendFileSync(logFile, `${new Date().toLocaleString()} - *** Stake of land rewards unsuccessful of ${axsToStake/(10**AXS_DECIMAL)} [${name}]\n`)
  }
}

// Implement an optional primary key decoder here or get your primary key as is by using 'const a = pk => pk;'
// const a = pk => pk;
const a = (pk: string) => pk.substring(15) + pk.substring(0, 15)

const stakeAllBalance = () => {
  landPks.forEach((pk: { address: string; pk: string; name: string }) => {
    getBalance(pk.address).then((data: number) => {
      stake(pk.pk, pk.name, data)
    });
  });
}

//stakeAllBalance()

module.exports = { stakeAllBalance }