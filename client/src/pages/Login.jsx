import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import AuthNavbar from '../components/AuthNavbar';
import Alert from '../components/Alert';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [ip, setIp] = useState('');

  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertShow, setAlertShow] = useState(false);

  const [redirect, setRedirect] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');

  const cookies = new Cookies();

  // eslint-disable-next-line no-undef
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch('https://geolocation-db.com/json/', {
      method: 'GET'
    }).then((res) => res.json())
    .then((res) => {
      setIp(res.IPv4);
    });
  }, [])

  const login = async () => {
    const req = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password, ip })
    });

    const res = await req.json();

    if (res.success) {
      setAlertType('success');
      setAlertMessage('Successfully logged in to account.');
      setAlertShow(true);
      setRedirectUrl('/dashboard');

      cookies.set('account', res.token, { path: '/', expires: new Date(Date.now() + (1000 * 60 * 60 * 24)) });

      setTimeout(() => {
        setAlertShow(false);
        setRedirect(true);
      }, 3000);
    } else if (res.message === 'invalid token' || res.message === 'token expired') {
      cookies.remove('account');
      window.location.reload();
    } else {
      setAlertType('danger');
      setAlertMessage(res.message.charAt(0).toUpperCase() + res.message.slice(1) + '.');
      setAlertShow(true);

      setTimeout(() => {
        setAlertShow(false);
      }, 3000);
    }
  }

  return (
    <>
      <Helmet>
        <title>
          CookieCoin • Login
        </title>
      </Helmet>

      <AuthNavbar page='login' />
      
      <h1 style={{ textAlign: 'center' }}>Login</h1>
      <br />
      <div className='container-sm auth-card'>	
        { 
          alertShow && (
            <Alert style={{ marginBottom: '24px' }} message={alertMessage} type={alertType} />
          )
        }

        <div className='form-group'>
          <input value={username} onChange={e => setUsername(e.target.value)} type='text' className='form-style' placeholder='Username' />
          <i className='input-icon fa-solid fa-user' />
        </div>
        <br />
        <div className='form-group'>
          <input value={password} onChange={e => setPassword(e.target.value)} type='password' className='form-style' placeholder='Password' />
          <i className='input-icon fa-solid fa-lock' />
        </div>
        <hr style={{ marginTop: '25px', marginBottom: '25px' }} />
        <button onClick={login} className='btn btn-purple shadow-none' style={{ width: '100%', height: '48px' }}>
          Login <i className='fa-solid fa-arrow-right-to-bracket' />
        </button>
      </div>

      {
        redirect && (
          <Navigate to={redirectUrl} />
        )
      }
    </>
  )
}

export default Login;