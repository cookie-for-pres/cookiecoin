import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'universal-cookie';

const ProtectedRoutes = () => {
  const cookies = new Cookies();
  const cookie = cookies.get('account');

  return cookie ? <Outlet /> : <Navigate to='/login' />;
}

export default ProtectedRoutes;
