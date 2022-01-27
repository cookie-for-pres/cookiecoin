import React from 'react';

import Coin from './Coin';

const Coins = ({ coins }) => {
  return (
    <>
      {
        coins.length > 0 ? (
          <div className='wrapper-3'>
            {
              coins.map((coin) => 
                <Coin 
                  key={coin._id} 
                  name={coin.name} 
                  abbreviation={coin.abbreviation} 
                  price={coin.price} 
                  imageUrl={coin.imageUrl} 
                  url={`/coin/${coin._id}`} 
                />
              )
            }
          </div>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '200px' }}>
            <i className='fa-solid fa-circle-notch fa-spin' />
          </p>
        )
      }
    </>
  );
}

export default Coins;