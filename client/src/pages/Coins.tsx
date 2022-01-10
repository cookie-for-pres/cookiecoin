import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Cookies from 'universal-cookie';
import Pusher from 'pusher-js';

import Navbar from '../components/Navbar';
import CoinS from '../components/coins/Coins';

const Coins = () => {
  const [coins, setCoins] = useState([]);

  const cookies = new Cookies();
  const cookie = cookies.get('account');

  const pusher = new Pusher('07371de38a1579061d39', { cluster: 'us3' });
  const channel = pusher.subscribe('coins');

  channel.bind('update', () => {
    getCoins();
  });

  useEffect(() => {
    getCoins();
  }, []);
  
  const getCoins = () => {
    fetch('http://127.0.0.1:5500/api/coins', {
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
        <div className='card'>
          <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>
            <CoinS coins={coins} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Coins;
