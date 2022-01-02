import React from 'react'
import { Helmet } from 'react-helmet';
import Navbar from '../components/Navbar';

const Portfolio = () => {
  return (
    <>
      <Helmet>
        <title>CookieCoin • Portfolio</title>
      </Helmet>

      <Navbar page='portfolio' />
      
    </>
  );
}

export default Portfolio
