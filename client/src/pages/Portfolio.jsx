import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet';
import Cookie from 'universal-cookie';
import axios from 'axios';

import Navbar from '../components/Navbar';
import Coins from '../components/portfolio/Coins';
import Balances from '../components/portfolio/Balances';
import Transfer from '../components/portfolio/Transfer';

const Portfolio = () => {
  const [coins, setCoins] = useState([]);
  const [balances, setBalances] = useState({ cash: 0, bank: 0 });

  const cookies = new Cookie();
  const cookie = cookies.get('account');

  // eslint-disable-next-line no-undef
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.post(`${BASE_URL}/api/portfolio`, {
      token: cookie
    }, { headers: { 'Content-Type': 'application/json' } })
    .then((res) => {
      if (res.data.success) {
        setCoins(res.data.portfolio);
        setBalances(res.data.account.balances);
      } else if (res.data.message === 'cant find account' || res.data.message === 'invalid token' || res.data.message === 'token expired') {
        cookies.remove('account');
        window.location.reload();
      }
    });
  }, []);
  
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
                <Balances balances={balances} />
              </div>
            </div>
          </div>
          <div className='col-sm-6'>
            <h1 style={{ textAlign: 'center' }}>Transfer</h1>
		        <br />
            <div className='card'>
              <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>
                <Transfer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Portfolio;