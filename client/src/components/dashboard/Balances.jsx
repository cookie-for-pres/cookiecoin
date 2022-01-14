import React from 'react';
import { Link } from 'react-router-dom';

const format = (amount) => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }); 
}

const Balances = ({ balances, boughtCoins, coins }) => {
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
            {
              boughtCoins.length > 0 && coins.length > 0 ? (
                boughtCoins.map((coin) => (
                  coins.map((c, i) => (
                    c.name === coin.name && (
                      coin.amount > 0 && (
                        <li className='list-group-item' style={{ textDecoration: 'none', fontSize: '18px' }} key={i}>
                          <span>
                            <img style={{ width: '4%', paddingRight: '5px' }} src={c.imageUrl} alt='icon' />
                          </span>  
                          { c.name }: 
                          <span style={{ float: 'right' }}>
                            { format(coin.amount * c.price) }
                          </span>
                        </li>
                      )
                    )
                  ))
                ))
              ) : (
                <>
                  <li className='list-group-item' style={{ textDecoration: 'none', fontSize: '18px' }}>
                    No Coins Bought
                  </li>
                </>
              )
            }
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