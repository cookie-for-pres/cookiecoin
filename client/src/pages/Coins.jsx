import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Cookies from 'universal-cookie';
import axios from 'axios';

import Navbar from '../components/Navbar';
import CoinS from '../components/coins/Coins';

const Coins = () => {
  const [coins, setCoins] = useState([]);

  const cookies = new Cookies();
  const cookie = cookies.get('account');

  // eslint-disable-next-line no-undef
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.post(`${BASE_URL}/api/coins`, {
      token: cookie
    }, { headers: { 'Content-Type': 'application/json' } })
    .then((res) => {
      if (res.data.success) {
        setCoins(res.data.coins);
      } else if (res.data.message === 'cant find account' || res.data.message === 'invalid token' || res.data.message === 'token expired') {
        cookies.remove('account');
        window.location.reload();
      }
    });
  }, []);

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