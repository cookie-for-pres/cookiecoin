import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'universal-cookie';

const PublicRoutes = () => {
  const cookies = new Cookies();
  const cookie = cookies.get('account');

  return cookie ? <Navigate to='/dashboard' /> : <Outlet />;
}

export default PublicRoutes;