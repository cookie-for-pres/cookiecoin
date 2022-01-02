import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Cookies from 'universal-cookie';

import Navbar from '../components/Navbar';
import JoinGame from '../components/games/JoinGame';
import DisplayGames from '../components/games/DisplayGames';
import JoinableGames from '../components/games/JoinableGames';

const Games = () => {
  const [displayGames, setDisplayGames] = useState([]);
  const [joinableGames, setJoinableGames] = useState([]);

  const cookies = new Cookies();
  const cookie = cookies.get('account');

  useEffect(() => {
    fetch('http://127.0.0.1:5500/api/games', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ accountId: cookie })
    }).then((res) => res.json())
    .then((res) => {
      if (res.success) {
        setJoinableGames(res.joinableGames);
        setDisplayGames(res.displayGames);
      } else if (res.message === 'cant find account') {
        cookies.remove('account');
        window.location.reload();
      }
    });
  }, []);
  
  return (
    <>
      <Helmet>
        <title>CookieCoin • Games</title>
      </Helmet>

      <Navbar page='games' />
      
      <div className='container'>
        <div className='row'>
          <div className='col-sm-6'>
            <h1 style={{ textAlign: 'center' }}>Join a Game</h1>
            <br />
            <div className='card' style={{ height: '80%' }}>
              <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
                <JoinGame />
              </div>
            </div>
          </div>
          <br />
          <div className='col-sm-6'>
            <h1 style={{ textAlign: 'center' }}>Join a Random Game</h1>
            <br />
            <div className='card' style={{ height: '80%' }}>
              <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
                <DisplayGames games={displayGames} />
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <h1 style={{ textAlign: 'center' }}>Joinable Games</h1>
        <br />
        <div className='card'>
          <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>
            <JoinableGames games={joinableGames} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Games;
