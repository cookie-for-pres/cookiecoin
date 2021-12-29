import React from 'react';

const Balance = ({ name, type, amount }) => {
  const format = (amount: number) => {
    return (amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }); 
  }

  return (
    <>
      {
        type === 'actual' ? (
          <li className='list-group-item' style={{ textDecoration: 'none', fontSize: '18px' }}>
            { name }: <span style={{ float: 'right' }}>{ format(amount) }</span>
          </li>
        ) : (
          <li className='list-group-item' style={{ textDecoration: 'none', fontSize: '18px' }}>
            { name }: <span style={{ float: 'right' }}><i className='fa-solid fa-circle-notch fa-spin' /></span>
          </li>
        )
      }
    </>
  );
}

export default Balance;
