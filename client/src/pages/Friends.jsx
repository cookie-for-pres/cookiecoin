import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';

const Friends = () => {
  return (
    <>
      <Helmet>
        <title>CookieCoin • Friends</title>
      </Helmet>

      <Navbar page='friends' />
      <br />
      <p className='text-muted' style={{ textAlign: 'center', fontSize: '25px' }}>Coming soon...</p>
    </>
  );
}

export default Friends;