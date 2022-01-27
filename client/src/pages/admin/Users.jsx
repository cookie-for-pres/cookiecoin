import React from 'react';
import { Helmet } from 'react-helmet';

import Navbar from '../../components/admin/Navbar';

const Users = () => {
  return (
    <>
      <Helmet>
        <title>CookieCoin • Admin Users</title>
      </Helmet>

      <Navbar page='users' />
    </>
  );
};

export default Users;