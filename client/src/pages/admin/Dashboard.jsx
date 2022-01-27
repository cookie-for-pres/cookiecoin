import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Cookies from 'universal-cookie';

import Navbar from '../../components/admin/Navbar';
import RecentUsers from '../../components/admin/dashboard/RecentUsers';

const Dashboard = () => {
  const [recentUsers, setRecentUsers] = useState([]);
  const [username, setUsername] = useState('');

  // eslint-disable-next-line no-undef
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const cookies = new Cookies();
  const cookie = cookies.get('account');

  useEffect(() => {
    fetch(`${BASE_URL}/api/admin/dashboard`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ token: cookie })
    }).then((res) => res.json())
    .then((res) => {
      if (res.success) {
        setRecentUsers(res.recentUsers);
      } else if (res.message === 'cant find account' || res.message === 'invalid token' || res.message === 'token expired') {
        cookies.remove('account');
        window.location.reload();
      }
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>CookieCoin • Admin Dashboard</title>
      </Helmet>

      <Navbar page='dashboard' />

      <div className='container'>
        <div className='row'>
          <div className='col-sm-6'>
            <h1 style={{ textAlign: 'center' }}>Recent Users</h1>
            <br />
            <div className='card' >
              <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>
                <RecentUsers recentUsers={recentUsers} />
              </div>
            </div>
          </div>
          <div className='col-sm-6'>
            <h1 style={{ textAlign: 'center' }}>Quick User Search</h1>
            <br />
            <div className='card' >
              <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>
                <div className='form-group'>
                  <input value={username} onChange={e => setUsername(e.target.value)} type='text' className='form-style' placeholder='Username' />
                  <i className='input-icon fa-solid fa-user' />
                </div>
              </div>
              <div className='card-footer'>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;