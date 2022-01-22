import React, { useState, useEffect } from 'react';
import Helmet from 'react-helmet';
import Cookies from 'universal-cookie';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Alert from '../components/Alert';

const format = (amount) => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }); 
}

const Blackjack = () => {
  const [dealersHand, setDealersHand] = useState([]);
  const [playersHand, setPlayersHand] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const [balances, setBalances] = useState({ cash: 0, bank: 0 });

  const [bet, setBet] = useState(0);
  const [account, setAccount] = useState('cash');

  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertShow, setAlertShow] = useState(false);

  const playingCards = [
    { name: 'ace', value: 1, image: '/blackjack/ace.png' },
    { name: 'two', value: 2, image: '/blackjack/two.png' },
    { name: 'three', value: 3, image: '/blackjack/three.png' },
    { name: 'four', value: 4, image: '/blackjack/four.png' },
    { name: 'five', value: 5, image: '/blackjack/five.png' },
    { name: 'six', value: 6, image: '/blackjack/six.png' },
    { name: 'seven', value: 7, image: '/blackjack/seven.png' },
    { name: 'eight', value: 8, image: '/blackjack/eight.png' },
    { name: 'nine', value: 9, image: '/blackjack/nine.png' },
    { name: 'ten', value: 10, image: '/blackjack/ten.png' },
    { name: 'jack', value: 10, image: '/blackjack/jack.png' },
    { name: 'queen', value: 10, image: '/blackjack/queen.png' },
    { name: 'king', value: 10, image: '/blackjack/king.png' }
  ];

  const cookies = new Cookies();
  const cookie = cookies.get('account');

  const navigate = useNavigate();

  // eslint-disable-next-line no-undef
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/account/balances`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ accountId: cookie })
    }).then((res) => res.json())
    .then((res) => {
      if (res.success) {
        setBalances(res.balances);
      } else {
        navigate(-1);
      }
    });
  }, []);

  const callApi = async (status) => {
    const req = await fetch(`${BASE_URL}/api/blackjack`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ accountId: cookie, bet: parseFloat(bet), account, status })
    });

    const res = await req.json();

    if (res.success) {
      setBalances(res.balances);
    }

    return res;
  }

  const getHandValue = (hand) => {
    let total = 0;
    hand.forEach((card) => {
      total += card.value;
    });
    return total;
  }

  const hit = async () => {
    const newPlayersHand = [...playersHand];
    const newCard = playingCards[Math.floor(Math.random() * playingCards.length)];
    newPlayersHand.push(newCard);
    setPlayersHand(newPlayersHand);

    if (getHandValue(newPlayersHand) > 21) {
      setAlertType('danger');
      setAlertMessage('You busted!');
      setAlertShow(true);
      setButtonsDisabled(true);

      setTimeout(() => {
        setAlertShow(false);
        setCurrentPlaying(false);
        setButtonsDisabled(false);
      } , 3000);

      await callApi('lose');
    }

    if (getHandValue(newPlayersHand) === 21) {
      setAlertType('success');
      setAlertMessage('You got 21!');
      setAlertShow(true);
      setButtonsDisabled(true);

      setTimeout(() => {
        setAlertShow(false);
        setCurrentPlaying(false);
        setButtonsDisabled(false);
      } , 3000);

      await callApi('win');
    }
  }

  const stand = async () => {
    setButtonsDisabled(true);

    const newDealersHand = [...dealersHand];
    const newCard = playingCards[Math.floor(Math.random() * playingCards.length)];
    newDealersHand.push(newCard);

    setDealersHand(newDealersHand);

    if (getHandValue(newDealersHand) > 21) {
      setAlertType('success');
      setAlertMessage('Dealer busted. You win!');
      setAlertShow(true);
      setButtonsDisabled(true);

      setTimeout(() => {
        setAlertShow(false);
        setCurrentPlaying(false);
        setButtonsDisabled(false);
      } , 3000);
      
      await callApi('win');
    }

    if (getHandValue(newDealersHand) === 21) {
      setAlertType('danger');
      setAlertMessage('Dealer got 21. You lose!');
      setAlertShow(true);
      setButtonsDisabled(true);

      setTimeout(() => {
        setAlertShow(false);
        setCurrentPlaying(false);
        setButtonsDisabled(false);
      } , 3000);

      await callApi('lose');
    }

    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (getHandValue(newDealersHand) < 17) {
        const newCard = playingCards[Math.floor(Math.random() * playingCards.length)];
        newDealersHand.push(newCard);
      }

      if (getHandValue(newDealersHand) >= 17) {
        break;
      }

      setDealersHand(newDealersHand);
    }

    if (getHandValue(newDealersHand) > getHandValue(playersHand) && getHandValue(newDealersHand) <= 21) {
      setAlertType('danger');
      setAlertMessage('Dealer wins!');
      setAlertShow(true);
      setButtonsDisabled(true);

      setTimeout(() => {
        setAlertShow(false);
        setCurrentPlaying(false);
        setButtonsDisabled(false);
      } , 3000);

      await callApi('lose');
    } else if (getHandValue(newDealersHand) === getHandValue(playersHand)) {
      setAlertType('warning');
      setAlertMessage('Push!');
      setAlertShow(true);
      setButtonsDisabled(true);

      setTimeout(() => {
        setAlertShow(false);
        setCurrentPlaying(false);
        setButtonsDisabled(false);
      } , 3000);

      await callApi('push');
    } else if (getHandValue(newDealersHand) < getHandValue(playersHand) && getHandValue(playersHand) <= 21) {
      setAlertType('success');
      setAlertMessage('You win!');
      setAlertShow(true);
      setButtonsDisabled(true);

      setTimeout(() => {
        setAlertShow(false);
        setCurrentPlaying(false);
        setButtonsDisabled(false);
      } , 3000);

      await callApi('win');
    } else {
      setAlertType('success');
      setAlertMessage('You win!');
      setAlertShow(true);
      setButtonsDisabled(true);

      setTimeout(() => {
        setAlertShow(false);
        setCurrentPlaying(false);
        setButtonsDisabled(false);
      } , 3000);

      await callApi('win');
    }
  }

  const double = () => {
    setBet(bet * 2);
    hit();
  }
  
  const deal = () => {
    if (bet > 0 && bet <= balances[account]) {
      setCurrentPlaying(true);

      const newDealersHand = [];
      const newPlayersHand = [];

      const newDealerCard = playingCards[Math.floor(Math.random() * playingCards.length)];
      newDealersHand.push(newDealerCard);

      const newPlayerCard = playingCards[Math.floor(Math.random() * playingCards.length)];
      newPlayersHand.push(newPlayerCard);

      const newPlayerCard2 = playingCards[Math.floor(Math.random() * playingCards.length)];
      newPlayersHand.push(newPlayerCard2);

      balances[account] -= bet;

      setDealersHand(newDealersHand);
      setPlayersHand(newPlayersHand);
    } else {
      setAlertType('danger');
      setAlertMessage(`Bet must be greater than 0 and less that ${balances[account]}!`);
      setAlertShow(true);

      setTimeout(() => {
        setAlertShow(false);
      }, 3000);
    }
  }

  return (
    <>
      <Helmet>
        <title>CookieCoin • Blackjack</title>
      </Helmet>

      <Navbar page='games' />
      
      <h1 style={{ textAlign: 'center' }}> Blackjack </h1>
      <br />
      <div className='container'>
        <div className='card' style={{ height: '70vh' }}>
          <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
            { 
              alertShow ? (
                <Alert style={{ marginBottom: '24px' }} message={alertMessage} type={alertType} />
              ) : (
                <>
                  <p style={{ height: '66px' }}></p>
                </>
              )
            }
            <div className='row' style={{ height: '100%' }}>
              <div className='col-md-6'>
                <div className='card shadow-none' style={{ backgroundColor: 'transparent', height: '100%' }}>
                  <div className='card-body'>
                    <h3 style={{ textAlign: 'center' }}>Dealer</h3>
                    <br />
                    {
                      currentPlaying ? (
                        <>
                          <div className='blackjack-wrapper'>
                            {
                              dealersHand.map((card, index) => (
                                <img key={index} className='blackjack-card appear' src={card.image} alt={card.name} />
                              ))
                            }
                          </div>
                        </>
                      ) : (
                        <>
                          <p className='text-muted' style={{ fontSize: '19px', textAlign: 'center' }}>
                            Game not started
                          </p>
                        </>
                      )
                    }
                  </div>
                  <div className='card-footer border-0' style={{ backgroundColor: 'transparent' }}>
                    {
                      currentPlaying && (
                        buttonsDisabled === false ? (
                          <>
                            <p>Total: {getHandValue(dealersHand)}</p>
                            <br />
                            <p></p>
                          </>
                        ) : (
                          <>
                            <p>Total: {getHandValue(dealersHand)}</p>
                            <br />
                            <p></p>
                          </>
                        )
                      )
                    }
                  </div>
                </div>
              </div>
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <div className='col-md-6'>
                <div className='card shadow-none' style={{ backgroundColor: 'transparent', height: '100%' }}>
                  <div className='card-body'>
                    <h3 style={{ textAlign: 'center' }}>Player</h3>
                    <br />
                    {
                      currentPlaying ? (
                        <>
                          <div className='blackjack-wrapper'>
                            {
                              playersHand.map((card, index) => (
                                <img key={index} className='blackjack-card appear' src={card.image} alt={card.name} />
                              ))
                            }
                          </div>
                          <br />
                        </>
                      ) : (
                        <>
                          <p className='text-muted' style={{ fontSize: '19px', textAlign: 'center' }}>
                            Game not started
                          </p>
                        </>
                      )
                    }
                  </div>
                  <div className='card-footer border-0'>
                    <div className='row'>
                      {
                        currentPlaying ? (
                          buttonsDisabled === false ? (
                            <>
                              <p>Total: {getHandValue(playersHand)}</p>
                              <br />
                              <div className='col-md-4'>
                                <button onClick={stand} style={{ width: '100%' }} className='btn btn-purple shadow-none'>
                                  Stand <i className='fa-solid fa-hand' />
                                </button>
                              </div>
                              <br />
                              <br />
                              <div className='col-md-4'>
                                <button onClick={hit} style={{ width: '100%' }} className='btn btn-purple shadow-none'>
                                  Hit <i className='fa-solid fa-hand-pointer' />
                                </button>
                              </div>
                              <br />
                              <br />
                              <div className='col-md-4'>
                                <button onClick={double} style={{ width: '100%' }} className='btn btn-purple shadow-none'>
                                  Double <i className='fa-solid fa-2' /><i className='fa-solid fa-x' />
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <p>Total: {getHandValue(playersHand)}</p>
                              <br />
                              <div className='col-md-4'>
                                <button style={{ width: '100%' }} disabled className='btn btn-purple shadow-none'>
                                  Stand <i className='fa-solid fa-hand' />
                                </button>
                              </div>
                              <br />
                              <br />
                              <div className='col-md-4'>
                                <button style={{ width: '100%' }} disabled className='btn btn-purple shadow-none'>
                                  Hit <i className='fa-solid fa-hand-pointer' />
                                </button>
                              </div>
                              <br />
                              <br />
                              <div className='col-md-4'>
                                <button style={{ width: '100%' }} disabled className='btn btn-purple shadow-none'>
                                  Double <i className='fa-solid fa-2' /><i className='fa-solid fa-x' />
                                </button>
                              </div>
                            </>
                          )
                        ) : (
                          <>
                            <div className='col-md-4'>
                              <button style={{ width: '100%' }} disabled className='btn btn-purple shadow-none'>
                                Stand <i className='fa-solid fa-hand' />
                              </button>
                            </div>
                            <br />
                            <br />
                            <div className='col-md-4'>
                              <button style={{ width: '100%' }} disabled className='btn btn-purple shadow-none'>
                                Hit <i className='fa-solid fa-hand-pointer' />
                              </button>
                            </div>
                            <br />
                            <br />
                            <div className='col-md-4'>
                              <button style={{ width: '100%' }} disabled className='btn btn-purple shadow-none'>
                                Double <i className='fa-solid fa-2' /><i className='fa-solid fa-x' />
                              </button>
                            </div>
                          </>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='card-footer border-0' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
            <br />
            <br />
            <br />
            <div className='row'>
              <div className='col-md-6'>
                {
                  currentPlaying ? (
                    <>
                      <select disabled value={account} onChange={(e) => setAccount(e.target.value)} className='form-select custom-select select-style'>
                        <option disabled>Select Account 👨🏽‍💻</option>
                        <option value='cash'>Cash: { format(balances.cash) }</option>
                        <option value='bank'>Bank: { format(balances.bank) }</option>
                      </select>
                    </>
                  ) : (
                    <>
                      <select value={account} onChange={(e) => setAccount(e.target.value)} className='form-select custom-select select-style'>
                        <option disabled>Select Account 👨🏽‍💻</option>
                        <option value='cash'>Cash: { format(balances.cash) }</option>
                        <option value='bank'>Bank: { format(balances.bank) }</option>
                      </select>
                    </>
                  )
                }
              </div>
              <br />
              <br />
              <div className='col-md-6'>
                {
                  currentPlaying ? (
                    <>
                      <div className='form-group'>
                        <input disabled value={bet} onChange={(e) => setBet(e.target.value)} type='number' className='form-style' placeholder='Bet'/>
                        <i className='input-icon fa-solid fa-dollar-sign' />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className='form-group'>
                        <input value={bet} onChange={(e) => setBet(e.target.value)} type='number' className='form-style' placeholder='Bet'/>
                        <i className='input-icon fa-solid fa-dollar-sign' />
                      </div>
                    </>
                  ) 
                }
              </div>
            </div>
            <br />
            {
              currentPlaying ? (
                <>
                  <button disabled onClick={deal} style={{ width: '100%', fontSize: '20px' }} className='btn btn-purple shadow-none'>
                    Deal <i className='fa-solid fa-hands'></i>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={deal} style={{ width: '100%', fontSize: '20px' }} className='btn btn-purple shadow-none'>
                    Deal <i className='fa-solid fa-hands'></i>
                  </button>
                </>
              )
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default Blackjack;