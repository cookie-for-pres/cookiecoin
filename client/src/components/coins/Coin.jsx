import React from 'react';
import { Link } from 'react-router-dom';

const format = (amount) => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }); 
}

const Coin = ({ name, abbreviation, price, imageUrl, url }) => {
  return (
    <>
      <div className='card' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
        <div style={{ alignItems: 'center' }}>
          <img src={process.env.PUBLIC_URL + imageUrl} style={{ width: '25%', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} className='card-img-top' alt='' />
        </div>
        <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
          <h5 className='card-title'>{ name } <span className='text-muted'>({ abbreviation })</span></h5>
          <p className='card-text'>{ format(price) }</p>
          <Link to={url} className='btn btn-purple shadow-none' style={{ width: '100%' }}>View <i className='fa-solid fa-magnifying-glass' /></Link>
        </div>
      </div>
    </>
  );
}

export default Coin;