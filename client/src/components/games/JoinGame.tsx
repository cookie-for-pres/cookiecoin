import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import Alert from '../Alert';

const JoinGame = () => {
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertShow, setAlertShow] = useState(false);

  const [gameCode, setGameCode] = useState('');
  const [gamePassword, setGamePassword] = useState('');
  const [gameFound, setGameFound] = useState(false);

  const [joinGameCode, setJoinGameCode] = useState('');
  const [joinGamePassword, setJoinGamePassword] = useState('');
  const [joinGameRedirect, setJoinGameRedirect] = useState(false);
  const [joinGameRedirectUrl, setJoinGameRedirectUrl] = useState('');

  if (gamePassword === 'NO_PASS') {
    setGamePassword('');

    setAlertType('warning');
    setAlertMessage('Game password can not be "NO_PASS".');
    setAlertShow(true);

    setTimeout(() => {
      setAlertShow(false);
    }, 2500);
  }

  useEffect(() => {
    if (joinGameCode !== gameCode || joinGamePassword !== gamePassword) {
      setGameFound(false);
    }
  }, [])

  const cookies = new Cookies();
  const cookie = cookies.get('account');

  const findGame = async () => {
    const req = await fetch('http://74.207.247.90/api/games/find', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ accountId: cookie, code: gameCode, password: gamePassword })
    });

    const res = await req.json();

    if (res.success) {
      setAlertType('success');
      setAlertMessage('Found game, you may now join.');
      setAlertShow(true);
      setGameFound(true);

      setJoinGameCode(res.game.code);
      setJoinGamePassword(res.game.password || 'NO_PASS');

      setTimeout(() => {
        setAlertShow(false);
      }, 2500);
    } else {
      setAlertType('danger');
      setAlertMessage(res.message.charAt(0).toUpperCase() + res.message.slice(1) + '.');
      setAlertShow(true);

      setTimeout(() => {
        setAlertShow(false);
      }, 2500);
    }
  }

  const joinGame = async () => {
    const req = await fetch('http://74.207.247.90/api/games/join', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ accountId: cookie, code: gameCode, password: gamePassword })
    });

    const res = await req.json();
    
    if (res.success) {
      setAlertType('success');
      setAlertMessage('Joining game...');
      setAlertShow(true);

      setTimeout(() => {
        setJoinGameRedirectUrl(res.url);
        setJoinGameRedirect(true);
        setAlertShow(false);
      }, 3000);
    }
  }

  return (
    <>
      { 
        alertShow && (
          <Alert style={{ marginBottom: '24px' }} message={alertMessage} type={alertType} />
        )
      }

      <div className='form-group'>
        <input value={gameCode} onChange={e => setGameCode(e.target.value)} type='text' className='form-style' placeholder='Code' />
        <i className='input-icon fa-solid fa-align-justify' />
      </div>
      <br />
      <div className='form-group'>
        <input value={gamePassword} onChange={e => setGamePassword(e.target.value)} type='text' className='form-style' placeholder='Password (optional)' />
        <i className='input-icon fa-solid fa-lock' />
      </div>
      <br />
      <div className='row'>
        <div className='col-sm-6'>
          <button onClick={findGame} className='btn btn-purple shadow-none' style={{ width: '100%', height: '48px' }}>
            Find Game <i className='fa-solid fa-magnifying-glass' />
          </button>
        </div>
        <div className='col-sm-6'>
          <button onClick={joinGame} className={gameFound ? 'btn btn-purple shadow-none' : 'btn btn-purple shadow-none disabled'} style={{ width: '100%', height: '48px' }}>
            Join Game <i className='fa-solid fa-user-plus' />
          </button>
        </div>
      </div>

      { joinGameRedirect && <Navigate to={joinGameRedirectUrl} /> }
    </>
  );
}

export default JoinGame;
