import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import AuthNavbar from '../components/AuthNavbar';
import Alert from '../components/Alert';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertShow, setAlertShow] = useState(false);

  const [redirect, setRedirect] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');

  const cookies = new Cookies();

  const login = async () => {
    const req = await fetch('http://localhost/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
    });

    const res = await req.json();

    if (res.success) {
      setAlertType('success');
      setAlertMessage('Successfully logged in to account.');
      setAlertShow(true);
      setRedirectUrl('/dashboard');

      cookies.set('account', res.id);

      setTimeout(() => {
        setAlertShow(false);
        setRedirect(true);
      }, 3000);
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
      <div className='container-sm' style={{ width: '500px' }}>	
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