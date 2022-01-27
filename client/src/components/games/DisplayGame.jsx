import React from 'react';
import { Link } from 'react-router-dom';

const DisplayGame = ({ _id, name, players, online, creatable }) => {
  return (
    <>
      <li className='list-group-item' style={{ textDecoration: 'none', fontSize: '18px' }}>
        <>
          {  
            players.max === players.min ? (
              <>
                { name } <span className='text-muted'>• 1 Player <i className='fa-solid fa-user' /></span>
              </>
            ) : (
              <>
                { name } <span className='text-muted'>• { players.min }-{ players.max } Players <i className='fa-solid fa-user' /></span>
              </>
            )
          }
        </>
        <span style={{ float: 'right' }}>
          {
            creatable ? (
              <>
                <Link className={online ? 'btn btn-purple shadow-none me-2' : 'btn btn-purple shadow-none disabled me-2'} to={`/games/random/${_id}`}>
                  Play <i className='fa-solid fa-play' />
                </Link>
                <Link className={online ? 'btn btn-purple shadow-none' : 'btn btn-purple shadow-none disabled'} to={`/games/create/${_id}`}>
                  Create <i className='fa-solid fa-plus' />
                </Link>
              </>
            ) : (
              name === 'Coinflip' ? (
                <>
                  <Link className={online ? 'btn btn-purple shadow-none me-2' : 'btn btn-purple shadow-none disabled me-2'} to={`/games/coinflip`}>
                    Play <i className='fa-solid fa-play' />
                  </Link>
                  <Link className={'btn btn-purple shadow-none disabled'} to=''>
                    Create <i className='fa-solid fa-plus' />
                  </Link>
                </>
              ) : (
                name === 'Blackjack' ? (
                  <>
                    <Link className={online ? 'btn btn-purple shadow-none me-2' : 'btn btn-purple shadow-none disabled me-2'} to={`/games/blackjack`}>
                      Play <i className='fa-solid fa-play' />
                    </Link>
                    <Link className={'btn btn-purple shadow-none disabled'} to=''>
                      Create <i className='fa-solid fa-plus' />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link className={online ? 'btn btn-purple shadow-none me-2' : 'btn btn-purple shadow-none disabled me-2'} to={`/games/random/${_id}`}>
                      Play <i className='fa-solid fa-play' />
                    </Link>
                    <Link className={online ? 'btn btn-purple shadow-none disabled' : 'btn btn-purple shadow-none disabled'} to={`/games/create/${_id}`}>
                      Create <i className='fa-solid fa-plus' />
                    </Link>
                  </>
                )        
              )
            )
          }
        </span>
      </li>
    </>
  );
}

export default DisplayGame;