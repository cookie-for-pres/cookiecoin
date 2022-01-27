import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

import Navbar from '../components/Navbar';
import Alert from '../components/Alert';

const format = (amount) => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }); 
}

const Coinflip = () => {
  const [bet, setBet] = useState(0);
  const [account, setAccount] = useState('cash');
  const [side, setSide] = useState('heads');
  const [balances, setBalances] = useState({ cash: 0, bank: 0 });
  const [coinClass, setCoinClass] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertShow, setAlertShow] = useState(false);

  const navigate = useNavigate();

  const cookies = new Cookies();
  const cookie = cookies.get('account');

  // eslint-disable-next-line no-undef
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
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
  }, []);

  const coinflip = async () => {
    setCoinClass('');
    
    if (account === 'cash') {
      setBalances({ cash: balances.cash - bet, bank: balances.bank });
    } else {
      setBalances({ cash: balances.cash, bank: balances.bank - bet });
    }

    const req = await fetch(`${BASE_URL}/api/coinflip`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        token: cookie,
        bet,
        account,
        side,
      })
    });

    const res = await req.json();
    
    setButtonLoading(true);

    if (res.success) {
      if (res.data.data.botChoice === 'heads') {
        setCoinClass('heads');
      } else {
        setCoinClass('tails');
      }

      setTimeout(() => {
        setBalances(res.balances);
        if (res.data.status === 'win') {
          setAlertType('success');
          setAlertMessage('You won ' + format(res.data.data.bet) + '!');
          setAlertShow(true);
        } else {
          setAlertType('danger');
          setAlertMessage('You lost ' + format(res.data.data.bet) + '!');
          setAlertShow(true);
        }

        setTimeout(() => {
          setAlertShow(false);
        }, 3000);
      }, 3000);

    } else if (res.message === 'cant find account' || res.message === 'invalid token' || res.message === 'token expired') {
      cookies.remove('account');
      window.location.reload();
    } else {
      setAlertType('danger');
      setAlertMessage(res.message.charAt(0).toUpperCase() + res.message.slice(1) + '.');
      setAlertShow(true);

      setTimeout(() => {
        setAlertShow(false);
      }, 3000);
    }

    setTimeout(() => {
      setButtonLoading(false);
    }, 3000);
  }

  return (
    <>
      <Helmet>
        <title>CookieCoin • Coinflip</title>
      </Helmet>

      <Navbar page='games' />

      <h1 style={{ textAlign: 'center' }}>Coinflip</h1>
			<br />
      <div className='container'>
        <div className='card'>
          <div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
            { 
              alertShow ? (
                <Alert style={{ marginBottom: '24px' }} message={alertMessage} type={alertType} />
              ) : (
                <>
                  <p style={{ height: '66px' }}></p>
                </>
              )
            }
            <div className='card shadow-none' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)', height: '100%' }}>
              <div className='card-body'>
                <div className='container'>
                  <div id='coin' className={coinClass}>
                    <div className='side-a'>
                      <p style={{ fontSize: '20px', textAlign: 'center', marginTop: '20%' }}>
                        <i className='fa-solid fa-user-astronaut' />
                        <br />
                        Heads
                      </p>
                    </div>
                    <div className='side-b'>
                      <p style={{ fontSize: '20px', textAlign: 'center', marginTop: '20%' }}>
                        <i className='fa-solid fa-dove' />
                        <br />
                        Tails
                      </p>
                    </div>
                  </div>
                  <br />
                  <label style={{ fontSize: '16px' }}>Amount: </label>
                  <div className='form-group'>
                    <input value={bet} onChange={(e) => setBet(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value ))} type='number' className='form-style' placeholder='Amount' min={0} />
                    <i className='input-icon fa-solid fa-tags' />
                  </div>
                  <br />
                  <div className='row'>
                    <div className='col-sm-6'>
                      <label style={{ fontSize: '16px' }}>Side: </label>
                      <select value={side} onChange={(e) => setSide(e.target.value)} className='form-select custom-select select-style'>
                        <option disabled>Select Coin Side</option>
                        <option value='heads'>Heads</option>
                        <option value='tails'>Tails</option>
                      </select> 
                    </div>
                    <div className='col-sm-6'>
                      <label style={{ fontSize: '16px' }}>Account: </label>
                      <select value={account} onChange={(e) => setAccount(e.target.value)} className='form-select custom-select select-style'>
                        <option disabled>Select Account 👨🏽‍💻</option>
                        <option value='cash'>Cash: { format(balances.cash) }</option>
                        <option value='bank'>Bank: { format(balances.bank) }</option>
                      </select> 
                      <br />
                    </div>
                  </div>
                  <br />
                  {
                    buttonLoading ? (
                      <button disabled onClick={coinflip} style={{ width: '100%', height: '50px', fontSize: '20px' }} className='btn btn-purple shadow-none'>
                        Flip <i className='fa-solid fa-circle-notch fa-spin' />
                      </button>
                    ) : (
                      <button onClick={coinflip} style={{ width: '100%', height: '50px', fontSize: '20px' }} className='btn btn-purple shadow-none'>
                        Flip 
                      </button>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
    </>
  );
}

export default Coinflip;