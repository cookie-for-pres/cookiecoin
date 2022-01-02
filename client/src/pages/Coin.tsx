import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';

import Cookies from 'universal-cookie';
import Navbar from '../components/Navbar';

const Coin = () => {
  const [coin, setCoin] = useState({ abbreviation: 'Loading...', name: '' });

  const { coinId } = useParams();
  const cookies = new Cookies();
  const cookie = cookies.get('account');
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch('http://127.0.0.1:5500/api/coins/find', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ accountId: cookie, coinId })
    }).then((res) => res.json())
    .then((res) => {
      if (res.success) {
        setCoin(res.coin);
      } else {
        navigate(-1);
      }
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>CookieCoin • Coins • { coin.abbreviation }</title>
      </Helmet>

      <Navbar page='coins' />

      <h1 style={{ textAlign: 'center' }}>{ coin.name } <span className='text-muted'>({ coin.abbreviation })</span> </h1>
			<br />
      <div className='container'> 
        <div className='card'>
          <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>

          </div>
        </div>
      </div>
    </>
  );
}

export default Coin;