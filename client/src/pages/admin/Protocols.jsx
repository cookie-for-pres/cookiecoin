import React from 'react';
import { Helmet } from 'react-helmet';

import Navbar from '../../components/admin/Navbar';

const Protocols = () => {
  return (
    <>
      <Helmet>
        <title>CookieCoin • Admin Protocols</title>
      </Helmet>

      <Navbar page='protocols' />
    </>
  );
};

export default Protocols;