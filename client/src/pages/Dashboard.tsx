import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

import Navbar from '../components/Navbar';
import Friends from '../components/dashboard/Friends';
import Balance from '../components/dashboard/Balance';
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
    fetch('http://127.0.0.1:5500/api/dashboard', {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
                <ul className="list-group list-group-flush">
                  {
                    balances.cash === '' ? (
                      <Balance name='Cash' type='loading' amount={0} />
                    ) : (
                      <Balance name='Cash' type='actual' amount={balances.cash} />
                    )
                  }
                  {
                    balances.bank === '' ? (
                      <Balance name='Bank' type='loading' amount={0} />
                    ) : (
                      <Balance name='Bank' type='actual' amount={balances.bank} />
                    )
                  }
                </ul>
                <br />
                <br />
                <Link className='btn btn-purple' to='/portfolio' style={{ width: '100%' }}>
                  View Portfolio <i className='fa-solid fa-piggy-bank' />
                </Link>
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