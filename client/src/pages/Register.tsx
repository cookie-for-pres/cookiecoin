import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import AuthNavbar from '../components/AuthNavbar';

const Register = () => {
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
      <br />
      <div className='container-sm' style={{ width: '500px' }}>	
        <div className="form-group">
          <input type="text" className="form-style" placeholder="Username" autoComplete='off' />
          <i className="input-icon fa-solid fa-user" />
        </div>
        <br />
        <div className="form-group">
          <input type="email" className="form-style" placeholder="Email" autoComplete='off' />
          <i className="input-icon fa-solid fa-at" />
        </div>
        <br />
        <div className="form-group">
          <input type="password" className="form-style" placeholder="Password" autoComplete='off' />
          <i className="input-icon fa-solid fa-lock" />
        </div>
        <hr style={{ marginTop: '25px', marginBottom: '25px' }} />
        <button className='btn shadow-none' style={{ width: '100%', height: '48px', color: 'var(--light)', backgroundColor: 'var(--purple)' }}>
          Register <i className='fa-solid fa-user-plus' />
        </button>
      </div>
    </>
  );
}

export default Register;