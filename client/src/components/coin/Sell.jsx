import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';

import Alert from '../Alert';

const format = (amount) => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }); 
}

const Sell = ({ coin: c, boughtCoin: bc, coinId, cookie, balances: b }) => {
  const [balances, setBalances] = useState(b);  
  const [coin, setCoin] = useState(c);
  const [boughtCoin, setBoughtCoin] = useState(bc);

  const [sellAccount, setSellAccount] = useState('cash');
  const [sellAmount, setSellAmount] = useState(0);
  const [sellTotal, setSellTotal] = useState(0);

  const [sellAlertType, setSellAlertType] = useState('');
  const [sellAlertMessage, setSellAlertMessage] = useState('');
  const [sellAlertShow, setSellAlertShow] = useState(false);

  const navigate = useNavigate();

  const cookies = new Cookies();
  // eslint-disable-next-line no-undef
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const price = parseFloat(coin.price);
    const amount = parseFloat(boughtCoin.amount);

    if (sellAmount >= amount) {
      setSellAmount(amount);
      setSellTotal(amount * price);
    } else {
      setSellTotal(sellAmount * price);
    }
  });

  useEffect(() => {
    axios.post(`${BASE_URL}/api/coins/find`, {
      token: cookie,
      coinId
    }, { headers: { 'Content-Type': 'application/json' } })
    .then((res) => {
      if (res.data.success) {
        setCoin(res.data.coin);
        setBoughtCoin(res.data.boughtCoin);
      } else if (res.data.message === 'cant find account' || res.data.message === 'invalid token' || res.data.message === 'token expired') {
        cookies.remove('account');
        window.location.reload();
      } else {
        navigate(-1);
      }
    });
  }, [balances]);

  useEffect(() => {
    axios.post(`${BASE_URL}/api/account/balances`, {
      token: cookie
    }, { headers: { 'Content-Type': 'application/json' } })
    .then((res) => {
      if (res.data.success) {
        setBalances(res.data.balances);
      } else if (res.data.message === 'cant find account' || res.data.message === 'invalid token' || res.data.message === 'token expired') {
        cookies.remove('account');
        window.location.reload();
      } else {
        navigate(-1);
      }
    });
  }, []);

  const sell = async () => {
    const req = await fetch(`${BASE_URL}/api/coins/sell`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ token: cookie, coinId, amount: sellAmount, balance: sellAccount })
    });

    const res = await req.json();

    if (res.success) {
      setSellAlertType('success');
      setSellAlertMessage('Successfully sold ' + sellAmount + ' ' + coin.abbreviation + '.');
      setSellAlertShow(true);

      setTimeout(() => {
        setSellAlertShow(false);
      }, 3000);
    } else if (res.message === 'cant find account' || res.message === 'invalid token' || res.message === 'token expired') {
      cookies.remove('account');
      window.location.reload();
    } else {
      setSellAlertType('danger');
      setSellAlertMessage(res.message.charAt(0).toUpperCase() + res.message.slice(1) + '.');
      setSellAlertShow(true);

      setTimeout(() => {
        setSellAlertShow(false);
      }, 3000);
    }

    setSellAmount(0);
    setSellTotal(0);

    fetch(`${BASE_URL}/api/account/balances`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ token: cookie })
    }).then((res) => res.json())
    .then((res) => {
      if (res.success) {
        setBalances(res.balances);
      } else if (res.message === 'cant find account' || res.message === 'invalid token' || res.message === 'token expired') {
        cookies.remove('account');
        window.location.reload();
      } else {
        navigate(-1);
      }
    });

    fetch(`${BASE_URL}/api/coins/find`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ token: cookie, coinId })
    }).then((res) => res.json())
    .then((res) => {
      if (res.success) {
        setCoin(res.coin);
        setBoughtCoin(res.boughtCoin);
      } else if (res.message === 'cant find account' || res.message === 'invalid token' || res.message === 'token expired') {
        cookies.remove('account');
        window.location.reload();
      } else {
        navigate(-1);
      }
    });
  }

  return (
    <>
      <div className='modal fade' id='sellModal' tabIndex={-1} aria-labelledby='sellModalLabel' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered border-0'>
          <div className='modal-content border-0' style={{ backgroundColor: 'var(--dark)' }}>
            <div className='modal-header border-0'>
              <h2 className='modal-title border-0' id='sellModalLabel'>Sell { coin.name } <span className='text-muted'>({ coin.abbreviation })</span></h2>
              <button type='button' className='btn-close shadow-none btn-purple' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body border-0'>
              { 
                sellAlertShow && (
                  <Alert style={{ marginBottom: '24px' }} message={sellAlertMessage} type={sellAlertType} />
                )
              }
              <h3 style={{ marginLeft: '2px' }}>Price: <strong>{ format(coin.price) }</strong> </h3>
              <h3 style={{ marginLeft: '2px' }}>Owned: <strong>{ boughtCoin.amount } <span className='text-muted'>({ format(boughtCoin.amount * coin.price) })</span></strong> </h3>
              <br />
              <label style={{ fontSize: '16px' }}>Account: </label>
              <select value={sellAccount} onChange={(e) => setSellAccount(e.target.value)} className='form-select custom-select select-style'>
                <option disabled>Select Account 👨🏽‍💻</option>
                <option value='cash'>Cash</option>
                <option value='bank'>Bank</option>
              </select>  
              <br />
              <label style={{ fontSize: '16px' }}>Amount: </label>
              <div className='form-group'>
                <input value={sellAmount} onChange={(e) => setSellAmount(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value ))} type='number' className='form-style' placeholder='Amount' min={0} />
                <i className='input-icon fa-solid fa-tags' />
              </div>
              <br />
              <h3 style={{ marginLeft: '2px' }}>Total: {
                  sellAmount === 0 ? (
                    <strong>
                      { format(sellTotal) }
                    </strong>
                  ) : (
                    <strong style={{ color: 'green' }}>
                      +{ format(sellTotal) }
                    </strong> 
                  )
                } 
              </h3>
            </div>
            <div className='modal-footer border-0'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
              <button onClick={sell} type='button' className='btn btn-purple shadow-none'>Confirm <i className='fa-solid fa-check' /> </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sell;