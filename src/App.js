import { useState } from 'react'
import { ethers } from 'ethers'
import './App.css';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'

const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const tokenAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

function App() {
  const [greeting, setGreetingValue] = useState('')
  const [userAccount, setUserAccount] = useState('')
  const [amount, setAmount] = useState(0)

  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account)
      console.log("Balance: ", balance.toString())
    }
  }

  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      // access to wallet
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // we need to write to the blockchain
      const signer = provider.getSigner()
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer)
      // acount to send and amount
      const transaction = await contract.transfer(userAccount, amount)
      await transaction.wait()
      console.log(`${amount} Coins successfully sent to ${userAccount}`)
    }
  }

  async function fetchGreeting() {
    // metamask extension is connected?
    if (typeof window.ethereum !== 'undefined') {
      // there's other providers apart from web3
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // create an instance of the contract
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        // we can then update the ui based on this value
        console.log('data: ', data)
      } catch (err) {
        console.log('err: ', err)
      }
    }
  }

  async function setGreeting() {
    // if greeting is not set don't update anything
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      // wait for the user to enable their account
      await requestAccount()
      // create another provider
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      // we neeed a signer in order to write a transaction
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue('')
      // wait to the transaction to be written into the blockchain
      await transaction.wait()
      fetchGreeting()
    }
  }
  async function requestAccount() {
    // request account info from metamask wallet
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }



  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange={e => setGreetingValue(e.target.value)}
          placeholder="Set Greeting"
          value={greeting}
        />
        <br />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={sendCoins}>Send Coins</button>
        <input
          onChange={e => setUserAccount(e.target.value)}
          placeholder="Account ID"
        />
        <input
          onChange={e => setAmount(e.target.value)}
          placeholder="Amount"
        />
      </header>
    </div>
  );
}

export default App;
