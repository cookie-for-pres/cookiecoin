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
import Blackjack from './pages/Blackjack';

import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminNews from './pages/admin/News';
import AdminUsers from './pages/admin/Users';
import AdminGames from './pages/admin/Games';
import AdminLogs from './pages/admin/Logs';
import AdminProtocols from './pages/admin/Protocols';
import AdminChat from './pages/admin/Chat';

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

            <Route path='/admin/login' element={<AdminLogin />} />
          </Route>

          <Route element={<ProtectedRoutes />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/games' element={<Games />} />
            <Route path='/games/coinflip' element={<Coinflip />} />
            <Route path='/games/blackjack' element={<Blackjack />} />
            <Route path='/coins' element={<Coins />} />
            <Route path='/friends' element={<Friends />} />
            <Route path='/portfolio' element={<Portfolio />} />
            <Route path='/settings' element={<Settings />} />

            <Route path='/coin/:coinId' element={<Coin /> } />

            <Route path='/admin/dashboard' element={<AdminDashboard />} />
            <Route path='/admin/news' element={<AdminNews />} />
            <Route path='/admin/users' element={<AdminUsers />} />
            <Route path='/admin/games' element={<AdminGames />} />
            <Route path='/admin/logs' element={<AdminLogs />} />
            <Route path='/admin/protocols' element={<AdminProtocols />} />
            <Route path='/admin/chat' element={<AdminChat />} />
            
            <Route path='/logout' element={<Logout />} />
            
            <Route path='*' element={<Navigate to='/' />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;