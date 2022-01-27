import React from 'react';
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';

const Settings = () => {
  return (
    <>
      <Helmet>
        <title>CookieCoin • Settings</title>
      </Helmet>

      <Navbar page='settings' />
      <br />
      <p className='text-muted' style={{ textAlign: 'center', fontSize: '25px' }}>Coming soon...</p>
    </>
  );
}

export default Settings;