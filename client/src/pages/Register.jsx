import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Navigate } from 'react-router-dom';
import Alert from '../components/Alert';
import axios from 'axios';

import AuthNavbar from '../components/AuthNavbar';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertShow, setAlertShow] = useState(false);

  const [redirect, setRedirect] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');

  // eslint-disable-next-line no-undef
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
   
  const register = async () => {    
    const req = await axios.post(`${BASE_URL}/api/register`, {
      username, email, password
    }, { headers: { 'Content-Type': 'application/json' } });

    const res = await req.data;

    if (res.success) {
      setAlertType('success');
      setAlertMessage('Successfully registered account.');
      setAlertShow(true);
      setRedirectUrl('/login')

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
          CookieCoin • Register
        </title>
      </Helmet>

      <AuthNavbar page='register' />

      <h1 style={{ textAlign: 'center' }}>Register</h1>
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
          <input value={email} onChange={e => setEmail(e.target.value)} type='email' className='form-style' placeholder='Email' />
          <i className='input-icon fa-solid fa-at' />
        </div>
        <br />
        <div className='form-group'>
          <input value={password} onChange={e => setPassword(e.target.value)} type='password' className='form-style' placeholder='Password' />
          <i className='input-icon fa-solid fa-lock' />
        </div>
        <hr style={{ marginTop: '25px', marginBottom: '25px' }} />
        <button onClick={register} className='btn btn-purple shadow-none' style={{ width: '100%', height: '48px' }}>
          Register <i className='fa-solid fa-user-plus' />
        </button>
      </div>

      {
        redirect && (
          <Navigate to={redirectUrl} />
        )
      }
    </>
  );
}

export default Register;