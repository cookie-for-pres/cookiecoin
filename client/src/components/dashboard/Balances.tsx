import React from 'react';
import { Link } from 'react-router-dom';

const Balances = ({ balances }) => {
  const format = (amount: number) => {
    return (amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }); 
  }

  return (
    <ul className="list-group list-group-flush">
      {
        balances.cash !== '' && balances.bank !== '' ? (
          <>
            <li className='list-group-item' style={{ textDecoration: 'none', fontSize: '18px' }}>
              Cash: <span style={{ float: 'right' }}>{ format(balances.cash) }</span>
            </li>
            <li className='list-group-item' style={{ textDecoration: 'none', fontSize: '18px' }}>
              Bank: <span style={{ float: 'right' }}>{ format(balances.bank) }</span>
            </li>
            <br />
            <br />
            <Link className='btn btn-purple' to='/portfolio' style={{ width: '100%' }}>
              View Portfolio <i className='fa-solid fa-piggy-bank' />
            </Link>
          </>
        ) : (
          <p style={{ textAlign: 'center', fontSize: '105.5px' }}><i className='fa-solid fa-circle-notch fa-spin' /></p>
        )
      }
    </ul>
  );
}

export default Balances;