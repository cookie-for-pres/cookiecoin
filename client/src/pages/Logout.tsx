import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const Logout = () => {
  const cookies = new Cookies();
  cookies.remove('account');

  return (
    <Navigate to='/home' />
  );
}

export default Logout;
