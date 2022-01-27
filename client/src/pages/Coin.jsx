import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { io } from 'socket.io-client';

import Chart from '../components/coins/Chart';
import Navbar from '../components/Navbar';
import Buy from '../components/coin/Buy';
import Sell from '../components/coin/Sell';

const format = (amount) => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }); 
}

const Coin = () => {
  const [coin, setCoin] = useState({ abbreviation: 'Loading...', name: 'Loading...', imageUrl: '', price: 'Loading...', logs: [].slice(-100) });
  const [boughtCoin, setBoughtCoin] = useState({ amount: 0 });
  const [balances, setBalances] = useState({ cash: 0, bank: 0 });

  const { coinId } = useParams();
  const cookies = new Cookies();
  const cookie = cookies.get('account');
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  
  const socket = io(BASE_URL);

  socket.on('coin-update', (data) => {
    window.location.reload();
  });

  useEffect(() => {
    fetch(`${BASE_URL}/api/coins/find`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ accountId: cookie, coinId })
    }).then((res) => res.json())
    .then((res) => {
      if (res.success) {
        setCoin(res.coin);
        setBoughtCoin(res.boughtCoin);
      } else {
        navigate(-1);
      }
    });
  }, []);

  const backAPage = () => {
    navigate(-1);
  }

  return (
    <>
      <Helmet>
        <title>CookieCoin • Coins • { coin.abbreviation }</title>
      </Helmet>

      <Navbar page='coins' />

      <h1 style={{ textAlign: 'center' }}> <button onClick={backAPage} className='btn btn-purple' style={{ marginRight: '1%' }}><i className='fa-solid fa-arrow-left' /> Back</button>  { coin.name } <span className='text-muted'>({ coin.abbreviation })</span> </h1>
			<br />
      <div className='container'> 
        <div className='card'>
          <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
            <div className='row'>
              <div className='col-sm-5'>
                <div style={{ textAlign: 'center' }}>
                  <img src={coin.imageUrl} style={{ width: '75%' }} alt='' />
                </div>
              </div>
              <div className='col-sm-7'>
                <div className='row'>
                  <div className='col-sm-6'>
                    <h3>Name: <strong>{ coin.name }</strong> </h3>
                    <h3>Abbreviation: <strong>{ coin.abbreviation }</strong> </h3>
                    <h3>Price: <strong>{ format(coin.price) }</strong> </h3>
                  </div>
                  <br />
                  <div className='col-sm-6'>
                    <button data-bs-toggle='modal' data-bs-target='#buyModal' className='btn btn-purple shadow-none' style={{ width: '100%', marginBottom: '5px', fontSize: '20px' }}>Buy <i className='fa-solid fa-cart-shopping' /></button>
                    <button data-bs-toggle='modal' data-bs-target='#sellModal' className='btn btn-purple shadow-none' style={{ width: '100%', marginTop: '5px', fontSize: '20px' }}>Sell <i className='fa-solid fa-hand-holding-dollar' /></button>
                  </div>
                </div>
                {
                  coin.logs.length > 0 && (
                    <Chart data={coin.logs} />
                  )
                }
              
                <Sell coin={coin} boughtCoin={boughtCoin} coinId={coinId} cookie={cookie} balances={balances} />
                <Buy coin={coin} coinId={coinId} cookie={cookie} balances={balances} />

              </div>
            </div>
            <br />
            <p style={{ textAlign: 'center' }} className='text-muted'>
              * This page refreshes every 2.5 minutes, any unsaved data will be erased. * 
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Coin;