import React from 'react';
import './index.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import ProtectedRoutes from './components/ProtectedRoutes';
import PublicRoutes from './components/PublicRoutes';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Coinflip from './pages/Coinflip';

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
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
