import React from 'react';

import DisplayGame from './DisplayGame';

const DisplayGames = ({ games }) => {
  return (
    <>
      {
        games.length > 0 ? (
          <ul className='list-group list-group-flush'>
            {
              games.map((game) => 
                <DisplayGame 
                  key={game._id} 
                  _id={game._id} 
                  name={game.name} 
                  players={game.data.players} 
                  online={game.data.online} 
                  creatable={game.data.creatable} 
                  url={`/games/random/${game._id}`} 
                />
              )
            }
          </ul>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '106px', paddingBottom: '44px' }}><i className='fa-solid fa-circle-notch fa-spin' /></p>
        )
      }
    </>
  );
}

export default DisplayGames;