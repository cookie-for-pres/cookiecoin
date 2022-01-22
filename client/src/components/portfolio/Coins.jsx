import React from 'react';

import Coin from './Coin';

const Coins = ({ coins }) => {
  coins.sort((a, b) => b.total - a.total);
  
  return (
    <div className='table-responsive'>
      <table className='table table-striped table-hover border-0'>
        <thead className='border-0' style={{ color: 'var(--light)', backgroundColor: 'var(--purple)' }}>
          <tr>
            <th className='border-0' scope='col'>Abbr.</th>
            <th className='border-0' scope='col'>Name</th>
            <th className='border-0' scope='col'>Wallet</th>
            <th className='border-0' scope='col'>Price</th>
            <th className='border-0' scope='col'>Amount</th>
            <th className='border-0' scope='col'>Total</th>
            <th className='border-0' scope='col'>View</th>
          </tr>
        </thead>
        <tbody>
          {
            coins.length > 0 ? (
              coins.map(coin => (
                <Coin
                  key={coin._id}
                  id={coin._id}
                  abbreviation={coin.abbreviation}
                  name={coin.name}
                  amount={coin.amount.toFixed(6)}
                  price={coin.price}
                  total={coin.total}
                  wallet={coin.wallet}
                />
              ))
            ) : (
              <tr>
                <td colSpan='7' style={{ color: 'var(--light) '}} className='text-center border-0'>
                  <p style={{ textAlign: 'center', fontSize: '105.5px' }}>
                    <i className='fa-solid fa-circle-notch fa-spin' />
                  </p>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    </div>
  );
}

export default Coins;