import React from 'react';
import { Link } from 'react-router-dom';

const format = (amount) => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }); 
}

const Coin = ({ abbreviation, name, amount, price, total, id, wallet }) => {
  return (
    <>
      <tr style={{ color: 'var(--light)' }}>
        <td className='border-0'>{ abbreviation }</td>
        <td className='border-0'>{ name }</td>
        <td className='border-0'>{ wallet }</td>
        <td className='border-0'>{ format(price) }</td>
        <td className='border-0'>{ amount }</td>
        <td className='border-0'>{ format(total) }</td>
        <td className='border-0'>
          <Link to={`/coin/${id}`}>
            <button className='btn btn-purple btn-sm shadow-none'>
              <i className='fas fa-magnifying-glass' />
            </button>
          </Link>
        </td>
      </tr>
    </>
  );
}

export default Coin;