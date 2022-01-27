import React from 'react';
import { Helmet } from 'react-helmet';

import Navbar from '../../components/admin/Navbar';

const Logs = () => {
  return (
    <>
      <Helmet>
        <title>CookieCoin • Admin Logs</title>
      </Helmet>

      <Navbar page='logs' />
    </>
  );
};

export default Logs;