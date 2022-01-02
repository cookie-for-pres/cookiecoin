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
      
    </>
  );
}

export default Settings;
