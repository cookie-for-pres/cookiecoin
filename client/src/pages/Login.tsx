import { Helmet } from 'react-helmet';
import React from 'react';
import { Link } from 'react-router-dom';

import AuthNavbar from '../components/AuthNavbar';

const Login = () => {
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
      <br />
      <div className='container-sm' style={{ width: '500px' }}>	
        <div className="form-group">
          <input type="text" className="form-style" placeholder="Username" autoComplete='off' />
          <i className="input-icon fa-solid fa-user" />
        </div>
        <br />
        <div className="form-group">
          <input type="password" className="form-style" placeholder="Password" autoComplete='off' />
          <i className="input-icon fa-solid fa-lock" />
        </div>
        <hr style={{ marginTop: '25px', marginBottom: '25px' }} />
        <button className='btn shadow-none' style={{ width: '100%', height: '48px', color: 'var(--light)', backgroundColor: 'var(--purple)' }}>
          Login <i className='fa-solid fa-arrow-right-to-bracket' />
        </button>
      </div>
    </>
  )
}

export default Login;