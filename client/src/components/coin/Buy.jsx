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

const Buy = ({ coin: c, coinId, cookie, balances: b }) => {
  const [balances, setBalances] = useState(b);
  const [coin, setCoin] = useState(c);

  const [buyAccount, setBuyAccount] = useState('cash');
  const [buyAmount, setBuyAmount] = useState(0);
  const [buyTotal, setBuyTotal] = useState(0);

  const [buyAlertType, setBuyAlertType] = useState('');
  const [buyAlertMessage, setBuyAlertMessage] = useState('');
  const [buyAlertShow, setBuyAlertShow] = useState(false);

  const navigate = useNavigate();

  const cookies = new Cookies();

  // eslint-disable-next-line no-undef
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const price = parseFloat(coin.price);

    if (buyAmount > 0 && buyAccount === 'cash' && buyAmount * price > balances.cash) {
      setBuyAmount(parseFloat((balances.cash / price).toFixed(6)));
      setBuyTotal(balances.cash);
    } else if (buyAmount > 0 && buyAccount === 'bank' && buyAmount * price > balances.bank) {
      setBuyAmount(parseFloat((balances.bank / price).toFixed(6)));
      setBuyTotal(balances.bank);
    } else {
      setBuyTotal(buyAmount * price);
    }
  }, [buyAmount]);

  useEffect(() => {
    axios.post(`${BASE_URL}/api/coins/find`, {
      token: cookie,
      coinId
    }, { headers: { 'Content-Type': 'application/json' } })
    .then((res) => {
      if (res.data.success) {
        setCoin(res.data.coin);
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

  const buy = async () => {
    const req = await axios.post(`${BASE_URL}/api/coins/buy`, {
      token: cookie,
      coinId,
      amount: buyAmount,
      balance: buyAccount
    }, { headers: { 'Content-Type': 'application/json' } });

    const res = await req.data;

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

    setBuyAmount(0);
    setBuyTotal(0);

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
  }

  return (
    <>
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
              <label style={{ fontSize: '16px' }}>Account: </label>
              <select value={buyAccount} onChange={(e) => setBuyAccount(e.target.value)} className='form-select custom-select select-style'>
                <option disabled>Select Account 👨🏽‍💻</option>
                <option value='cash'>Cash: { format(balances.cash) }</option>
                <option value='bank'>Bank: { format(balances.bank) }</option>
              </select>  
              <br />
              <label style={{ fontSize: '16px' }}>Amount: </label>
              <div className='form-group'>
                <input value={buyAmount} onChange={(e) => setBuyAmount(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value ))} type='number' className='form-style' placeholder='Amount' min={0} />
                <i className='input-icon fa-solid fa-tags' />
              </div>
              <br />
              <h3 style={{ marginLeft: '2px' }}>Total: <strong>{ format(buyTotal) }</strong>
              </h3>
            </div>
            <div className='modal-footer border-0'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>Close</button>
              <button onClick={buy} type='button' className='btn btn-purple shadow-none'>Confirm <i className='fa-solid fa-check' /> </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Buy;