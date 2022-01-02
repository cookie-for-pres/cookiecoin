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
import Games from './pages/Games';
import Coins from './pages/Coins';
import Friends from './pages/Friends';
import Portfolio from './pages/Portfolio';
import Settings from './pages/Settings';

import Coin from './pages/Coin';

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
            <Route path='/games' element={<Games />} />
            <Route path='/coins' element={<Coins />} />
            <Route path='/friends' element={<Friends />} />
            <Route path='/portfolio' element={<Portfolio />} />
            <Route path='/settings' element={<Settings />} />

            <Route path='/coin/:coinId' element={<Coin />} />

            <Route path='/logout' element={<Logout />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;