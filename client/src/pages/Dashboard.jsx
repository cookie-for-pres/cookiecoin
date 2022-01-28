import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Cookies from 'universal-cookie';
import axios from 'axios';

import Navbar from '../components/Navbar';
import Friends from '../components/dashboard/Friends';
import Balances from '../components/dashboard/Balances';
import NewsArticles from '../components/dashboard/NewsArticles';

const Dashboard = () => {
  const [friends, setFriends] = useState([]);
  const [boughtCoins, setBoughtCoins] = useState([]);
  const [coins, setCoins] = useState([]);
  const [balances, setBalances] = useState({ cash: '', bank: '' });
  const [newsArticles, setNewsArticles] = useState([]);

  const cookies = new Cookies();
  const cookie = cookies.get('account');

  // eslint-disable-next-line no-undef
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.post(`${BASE_URL}/api/dashboard`, {
      token: cookie
    }, { headers: { 'Content-Type': 'application/json' } })
    .then((res) => {
      if (res.data.success) {
        setFriends(res.data.account.friends);
        setBoughtCoins(res.data.account.boughtCoins);
        setBalances(res.data.account.balances);
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
        <title>CookieCoin • Dashboard</title>
      </Helmet>

      <Navbar page='dashboard' />
      
      <div className='container'>
        <div className='row'>
          <div className='col-sm-6'>
            <h1 style={{ textAlign: 'center' }}>Summary</h1>
						<br />
						<div className='card' >
							<div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>
                <Balances balances={balances} boughtCoins={boughtCoins} coins={coins} />
              </div>
            </div>
          </div>
          <br />
          <div className='col-sm-6'>
            <h1 style={{ textAlign: 'center' }}>Friends</h1>
						<br />
						<div className='card'>
							<div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>
                <Friends friends={friends} />
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <h1 style={{ textAlign: 'center' }}>Recent News</h1>
        <br />
        <div className='card'>
          <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>
            <NewsArticles articles={newsArticles} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard;