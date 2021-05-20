/* eslint-disable */

import React, { useState, useEffect } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import brain from '../brain.png'
import { CARD_ARRAY } from '../util/imageRepo'

const App = () => {

  const [account, setAccount] = useState('0x0')
  const [token, setToken] = useState(null)
  const [totalSupply, setTotalSupply] = useState(0)
  const [tokenURIs, setTokenURIs] = useState([])
  const [cardArray, setCardArray] = useState([])
  const [cardsChosen, setCardsChosen] = useState([])
  const [cardsChosenId, setCardsChosenId] = useState([])
  const [cardsWon, setCardsWon] = useState([])

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-ethereum browser detected. You should try MetaMask')
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])

    // Load contract
    const networkId = await web3.eth.net.getId()
    const networkData = MemoryToken.networks[networkId]

    if (networkData) {
      const abi = MemoryToken.abi
      const address = networkData.address

      const tempToken = await web3.eth.Contract(abi, address)

      // set token from abi
      setToken(tempToken)
      // set total supply of tokens from blockchain 
      setTotalSupply(await tempToken.methods.totalSupply().call())

      // Load tokens
      let balanceOf = await tempToken.methods.balanceOf(accounts[0]).call()
      for (let i = 0; i < balanceOf; i++) {
        let id = await token.methods.tokenOfOwnerByIndex(accounts[0], i).call();
        let tokenURI = await token.methods.tokenURI(id).call();
        setTokenURIs([...tokenURIs, tokenURI])
      }
    } else {
      alert("Smart contract isn't deployed to the detected network")
    }
  }

  const chooseImage = (cardId) => {
    if (cardsChosenId.includes(cardId.toString())) {

      return CARD_ARRAY[cardId].img
    } else {
      return window.location.origin + '/images/blank.png'
    }


  }

  const flipCard = async (cardId) => {
    setCardsChosen(old => [...old, CARD_ARRAY[cardId]])
    setCardsChosenId(old => [...old, cardId])
    console.log(cardsChosen, 'card chosen')
    console.log(cardsChosenId, 'card chosen id')
  }


  useEffect(() => {
    loadWeb3()
    loadBlockchainData()

    // sort images
    setCardArray(CARD_ARRAY.sort(() => 0.5 - Math.random()))
  }, [])

  return (
    <div>
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="http://www.dappuniversity.com/bootcamp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={brain} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; Memory Tokens
          </a>
        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-muted"><span id="account">{account}</span></small>
          </li>
        </ul>
      </nav>
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <div className="content mr-auto ml-auto">
              <h1 className="d-4">Edit this file in App.js!</h1>

              <div className="grid mb-4" >

                { // begin code
                  cardArray.map((card, key) => {
                    return (
                      <img key={key}
                        src={chooseImage(key)}
                        data-id={key}
                        onClick={(event) => {
                          let cardId = event.target.getAttribute('data-id')
                          if (!cardsWon.includes(cardId.toString())) {
                            flipCard(cardId)
                          }
                        }}
                      />)
                  })
                }

              </div>

              <div>

                {/* Code goes here... */}

                <div className="grid mb-4" >

                  {/* Code goes here... */}

                </div>

              </div>

            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
