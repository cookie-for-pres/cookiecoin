import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import ProtectedRoutes from './components/ProtectedRoutes';
import PublicRoutes from './components/PublicRoutes';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Coinflip from './pages/Coinflip';
import Dashboard from './pages/Dashboard';
import Logout from './pages/Logout';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route path='/' element={<Navigate to='/home' />} />
            <Route path='/home' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route path='/home' element={<Home />} />
            <Route path='/coinflip' element={<Coinflip />} />
            <Route path='/dashboard' element={<Dashboard />} />

            <Route path='/logout' element={<Logout />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;