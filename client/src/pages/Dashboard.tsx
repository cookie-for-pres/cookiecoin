import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

import Navbar from '../components/Navbar';
import Friends from '../components/dashboard/Friends';
import Balances from '../components/dashboard/Balances';
import NewsArticles from '../components/dashboard/NewsArticles';

const Dashboard = () => {
  const [friends, setFriends] = useState([]);
  const [boughtCoins, setBoughtCoins] = useState([]);
  const [balances, setBalances] = useState({ cash: '', bank: '' });
  const [newsArticles, setNewsArticles] = useState([]);
  const [accountId, setAccountId] = useState('');

  const cookies = new Cookies();
  const cookie = cookies.get('account');

  useEffect(() => {
    fetch('http://localhost/api/dashboard', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ accountId: cookie })
    }).then((res) => res.json())
    .then((res) => {
      if (res.success) {
        setAccountId(res.account._id);
        setFriends(res.account.friends);
        setBoughtCoins(res.account.boughtCoins);
        setBalances(res.account.balances)
      } else if (res.message === 'cant find account') {
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
						<div className='card' style={{ height: '78%' }}>
							<div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>
                <Balances balances={balances} />
              </div>
            </div>
          </div>
          <br />
          <div className='col-sm-6'>
            <h1 style={{ textAlign: 'center' }}>Friends</h1>
						<br />
						<div className='card' style={{ height: '78%' }}>
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