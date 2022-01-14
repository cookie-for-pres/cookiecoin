import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet';
import Cookie from 'universal-cookie';

import Navbar from '../components/Navbar';
import Coins from '../components/portfolio/Coins';

const Portfolio = () => {
  const [coins, setCoins] = useState([]);

  const cookies = new Cookie();
  const cookie = cookies.get('account');

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId: cookie })
    }).then(res => res.json())
    .then(res => {
      if (res.success) {
        setCoins(res.portfolio);
      } else {
        cookies.remove('account');
        window.location.reload();   
      }
    });
  }, []);

  console.log(coins);

  return (
    <>
      <Helmet>
        <title>CookieCoin • Portfolio</title>
      </Helmet>

      <Navbar page='portfolio' />
      
      <h1 style={{ textAlign: 'center' }}>Portfolio</h1>
		  <br />
      <div className='container'>
        <div className='card'>
          <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>
            <Coins coins={coins} />
          </div>
        </div>
        <br />
        <br />
        <div className='row'>
          <div className='col-sm-6'>
            <h1 style={{ textAlign: 'center' }}>Balances</h1>
		        <br />
            <div className='card'>
              <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>

              </div>
            </div>
          </div>
          <div className='col-sm-6'>
            <h1 style={{ textAlign: 'center' }}>Transfer</h1>
		        <br />
            <div className='card'>
              <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Portfolio;