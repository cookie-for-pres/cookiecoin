import React from 'react';

const format = (amount) => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }); 
}

const Balances = ({ balances }) => {
  return (
    <>
      <ul className='list-group list-group-flush'>
        <li className='list-group-item' style={{ textDecoration: 'none', fontSize: '18px' }}>
          Cash <span style={{ float: 'right' }}>{ format(balances.cash) }</span>
        </li>
        <li className='list-group-item' style={{ textDecoration: 'none', fontSize: '18px' }}>
          Bank <span style={{ float: 'right' }}>{ format(balances.bank) }</span>
        </li> 
      </ul>
    </>
  );
}

export default Balances;