import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import Chart from '../components/coins/Chart';
import Navbar from '../components/Navbar';
import Alert from '../components/Alert';

const Coin = () => {
  const [coin, setCoin] = useState({ abbreviation: 'Loading...', name: 'Loading...', imageUrl: '', price: 'Loading...', logs: [] });
  const [balances, setBalances] = useState({ cash: 0, bank: 0 });
  const [buyAccount, setBuyAccount] = useState('bank');
  const [buyAmount, setBuyAmount] = useState(0);
  const [buyTotal, setBuyTotal] = useState(0);

  const [buyAlertType, setBuyAlertType] = useState('');
  const [buyAlertMessage, setBuyAlertMessage] = useState('');
  const [buyAlertShow, setBuyAlertShow] = useState(false);

  const [sellAlertType, setsellAlertType] = useState('');
  const [sellAlertMessage, setsellAlertMessage] = useState('');
  const [sellAlertShow, setSellAlertShow] = useState(false);

  const { coinId } = useParams();
  const cookies = new Cookies();
  const cookie = cookies.get('account');
  const navigate = useNavigate();

  const format = (amount: any) => {
    return (amount).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    }); 
  }

  useEffect(() => {
    fetch('http://127.0.0.1:5500/api/coins/find', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ accountId: cookie, coinId })
    }).then((res) => res.json())
    .then((res) => {
      if (res.success) {
        setCoin(res.coin);
      } else {
        navigate(-1);
      }
    });

    fetch('http://127.0.0.1:5500/api/account/balances', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ accountId: cookie })
    }).then((res) => res.json())
    .then((res) => {
      if (res.success) {
        setBalances(res.balances);
      } else {
        navigate(-1);
      }
    });
  }, []);

  useEffect(() => {
    const price: number = parseFloat(coin.price);
    const diff: number = price * (isNaN(buyAmount) ? 0 : buyAmount) - (buyAccount === 'cash' ? balances.cash : balances.bank);
    const total = diff < 0 ? 0 : diff;

    setBuyTotal(parseFloat((price * buyAmount - total).toFixed(2)));   

    if (buyAccount === 'cash' && balances.cash === parseFloat((price * buyAmount - total).toFixed(2))) {
      setBuyAmount(parseFloat((balances.cash / price).toFixed(6)));
    } else if (buyAccount === 'bank' && balances.bank === parseFloat((price * buyAmount - total).toFixed(2))) {
      setBuyAmount(parseFloat((balances.bank / price).toFixed(6)));
    }
  });

  const buy = async () => {
    const req = await fetch('http://127.0.0.1:5500/api/coins/buy', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ accountId: cookie, coinId, amount: buyAmount, balance: buyAccount })
    });

    const res = await req.json();

    if (res.success) {
      setBuyAlertType('success');
      setBuyAlertMessage('Successfully bought ' + buyAmount + ' ' + coin.abbreviation + '.');
      setBuyAlertShow(true);

      setTimeout(() => {
        setBuyAlertShow(false);
      }, 3000);

    } else {
      setBuyAlertType('danger');
      setBuyAlertMessage(res.message.charAt(0).toUpperCase() + res.message.slice(1) + '.');
      setBuyAlertShow(true);

      setTimeout(() => {
        setBuyAlertShow(false);
      }, 3000);
    }
    
    setBuyAccount('');
    setBuyAmount(0);
    setBuyTotal(0);
  }

  const sell = async () => {

  }

  const backAPage = () => {
    navigate(-1);
  }

  const times = (by: number) => {
    const price: number = parseFloat(coin.price);

    if (buyAccount === 'cash') {
      let bal = balances.cash;
      if (price * by > bal) {
        setBuyAmount(parseFloat((bal / price).toFixed(6)));
      } else {
        setBuyAmount(parseFloat((by).toFixed(6)));
      }
    } else {
      let bal = balances.bank;
      if (price * by > bal) {
        setBuyAmount(parseFloat((bal / price).toFixed(6)));
      } else {
        setBuyAmount(parseFloat((by).toFixed(6)));
      }
    }  

    const diff: number = price * (isNaN(buyAmount) ? 0 : buyAmount) - (buyAccount === 'cash' ? balances.cash : balances.bank);
    const total = diff < 0 ? 0 : diff;

    setBuyTotal(parseFloat((price * buyAmount - total).toFixed(2)));
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
                    <button className='btn btn-purple shadow-none' style={{ width: '100%', marginTop: '5px', fontSize: '20px' }}>Sell <i className='fa-solid fa-hand-pointer' /></button>
                  </div>
                </div>
                {
                  coin.logs.length > 0 && (
                    <Chart data={coin.logs} />
                  )
                }

                <div className='modal fade' id='buyModal' tabIndex={-1} aria-labelledby='buyModalLabel' aria-hidden='true'>
                  <div className='modal-dialog modal-dialog-centered border-0'>
                    <div className='modal-content border-0' style={{ backgroundColor: 'var(--dark)' }}>
                      <div className='modal-header border-0'>
                        <h2 className='modal-title' id='buyModalLabel'>Buy { coin.name } <span className='text-muted'>({ coin.abbreviation })</span> </h2>
                        <button type='button' className='btn-close shadow-none btn-purple' data-bs-dismiss='modal' aria-label='Close'></button>
                      </div>
                      <div className='modal-body border-0'>
                        { 
                          buyAlertShow && (
                            <Alert style={{ marginBottom: '24px' }} message={buyAlertMessage} type={buyAlertType} />
                          )
                        }
                        <h3 style={{ marginLeft: '2px' }}>Price: <strong>{ format(coin.price) }</strong> </h3>
                        <br />
                        <select value={buyAccount} onChange={(e) => setBuyAccount(e.target.value)} className='form-select custom-select select-style' aria-label='Default select example'>
                          <option disabled>Select Account 👨🏽‍💻</option>
                          <option value='cash'>Cash: { format(balances.cash) }</option>
                          <option value='bank'>Bank: { format(balances.bank) }</option>
                        </select>    
                        <br />
                        <div className='row'>
                          <div className='col-sm-6'>
                            <div className='form-group'>
                              <input value={buyAmount} onChange={(e) => setBuyAmount(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value ))} type='number' className='form-style' placeholder='Amount' min={0} />
                              <i className='input-icon fa-solid fa-tags' />
                            </div>
                          </div>
                          <div className='col-sm-6'>
                            <button onClick={() => times(1)} style={{ height: '48px', width: '30.3%', marginRight: '10px' }} className='btn btn-purple shadow-none'>1x</button>
                            <button onClick={() => times(5)} style={{ height: '48px', width: '30.3%', marginRight: '10px' }} className='btn btn-purple shadow-none'>5x</button>
                            <button onClick={() => times(10)} style={{ height: '48px', width: '30.3%' }} className='btn btn-purple shadow-none'>10x</button>
                          </div>
                        </div>
                        <br />
                        <h3 style={{ marginLeft: '2px' }}>Total: <strong>{ format(buyTotal) }</strong> </h3>
                      </div>
                      <div className='modal-footer border-0'>
                        <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
                        <button onClick={buy} type='button' className='btn btn-purple shadow-none'>Confirm <i className='fa-solid fa-check' /> </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='modal fade' id='exampleModal' tabIndex={-1} aria-labelledby='exampleModalLabel' aria-hidden='true'>
                  <div className='modal-dialog'>
                    <div className='modal-content'>
                      <div className='modal-header'>
                        <h5 className='modal-title' id='exampleModalLabel'>Modal title</h5>
                        <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
                      </div>
                      <div className='modal-body'>
                        ...
                      </div>
                      <div className='modal-footer'>
                        <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
                        <button type='button' className='btn btn-primary'>Save changes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Coin;