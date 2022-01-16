/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Cookies from 'universal-cookie';
import { io } from 'socket.io-client';

import Navbar from '../components/Navbar';
import CoinS from '../components/coins/Coins';

const Coins = () => {
  const [coins, setCoins] = useState([]);

  const cookies = new Cookies();
  const cookie = cookies.get('account');

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const socket = io(BASE_URL);

  socket.on('coin-update', (data) => {
    setCoins(data);
  });

  useEffect(() => {
    getCoins();
  }, []);
  
  const getCoins = () => {
    fetch(`${BASE_URL}/api/coins`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ accountId: cookie })
    }).then((res) => res.json())
    .then((res) => {
      if (res.success) {
        setCoins(res.coins);
      } else if (res.message === 'cant find account') {
        cookies.remove('account');
        window.location.reload();
      }
    });
  }

  return (
    <>
      <Helmet>
        <title>CookieCoin • Coins</title>
      </Helmet>

      <Navbar page='coins' />
      
      <h1 style={{ textAlign: 'center' }}>Coins</h1>
		  <br />
      <div className='container'>
        <div className='card scroll'>
          <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
            <CoinS coins={coins} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Coins;