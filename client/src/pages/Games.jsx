import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Cookies from 'universal-cookie';
import axios from 'axios';

import Navbar from '../components/Navbar';
import DisplayGames from '../components/games/DisplayGames';
import JoinableGames from '../components/games/JoinableGames';

const Games = () => {
  const [displayGames, setDisplayGames] = useState([]);
  const [joinableGames, setJoinableGames] = useState([]);

  const cookies = new Cookies();
  const cookie = cookies.get('account');

  // eslint-disable-next-line no-undef
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.post(`${BASE_URL}/api/games`, {
      token: cookie
    }, { headers: { 'Content-Type': 'application/json' } })
    .then((res) => {
      if (res.data.success) {
        setJoinableGames(res.data.joinableGames);
        setDisplayGames(res.data.displayGames);
      } else if (res.data.message === 'cant find account' || res.data.message === 'invalid token' || res.data.message === 'token expired') {
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
        {/* <div className='row'>
          <div className='col-sm-6'>
            <h1 style={{ textAlign: 'center' }}>Join a Game</h1>
            <br />
            <div className='card' style={{ height: '82%' }}>
              <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
                <JoinGame />
              </div>
            </div>
          </div>
          <br />
          <div className='col-sm-6'>
            <h1 style={{ textAlign: 'center' }}>Join a Random Game</h1>
            <br />
            <div className='card' style={{ height: '82%' }}>
              <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
                <DisplayGames games={displayGames} />
              </div>
            </div>
          </div>
        </div> */}
        <h1 style={{ textAlign: 'center' }}>Join a Random Game</h1>
        <br />
        <div className='card' style={{ height: '82%' }}>
          <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
            <DisplayGames games={displayGames} />
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