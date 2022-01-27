import React from 'react';
import { Helmet } from 'react-helmet';

import Navbar from '../../components/admin/Navbar';

const Games = () => {
  return (
    <>
      <Helmet>
        <title>CookieCoin • Admin Games</title>
      </Helmet>

      <Navbar page='games' />
    </>
  );
};

export default Games;