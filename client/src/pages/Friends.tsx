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
      
    </>
  );
}

export default Friends;
