import React, { useState, useEffect } from 'react';
import Cookie from 'universal-cookie';

import Alert from '../Alert';

const format = (amount) => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }); 
}

const Transfer = () => {
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');

  const [balances, setBalances] = useState({ cash: 0, bank: 0 });
  const [coins, setCoins] = useState([]);
  const [boughtCoins, setBoughtCoins] = useState([]);

  const [buttonLoading, setButtonLoading] = useState(false);

  const [transferType, setTransferType] = useState('balance-to-balance');

  const [balanceFromAccount, setBalanceFromAccount] = useState('cash');
  const [balanceAmount, setBalanceAmount] = useState(0);

  const [uatFromAccount, setUatFromAccount] = useState('cash');
  const [uatToAccount, setUatToAccount] = useState('');
  const [uatAmount, setUatAmount] = useState(0);

  const [ucToCoinFromAccount, setUcToCoinFromAccount] = useState('CookieCoin');
  const [ucToCoinToAccount, setUcToCoinToAccount] = useState('');
  const [ucToCoinAmount, setUcToCoinAmount] = useState(0);

  const cookies = new Cookie();
  const cookie = cookies.get('account');

  // eslint-disable-next-line no-undef
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/account/balances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId: cookie })
    }).then(res => res.json())
    .then(res => {
      setBalances(res.balances);
    });

    fetch(`${BASE_URL}/api/coins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId: cookie })
    }).then(res => res.json())
    .then(res => {
      setCoins(res.coins);
      setBoughtCoins(res.boughtCoins);
    });
  }, []);

  useEffect(() => {
    if (balanceFromAccount === 'cash' && balances.cash <= balanceAmount) {
      setBalanceAmount(balances.cash);
    } else if (balanceFromAccount === 'bank' && balances.bank <= balanceAmount) {
      setBalanceAmount(balances.bank);
    }
  });
    
  const transfer = async () => {
    let body = {}
    setButtonLoading(true);

    setTimeout(() => {
      setButtonLoading(false);
    }, 3000);

    if (transferType === 'balance-to-balance') {
      body = {
        accountId: cookie,
        type: 'balance-to-balance',
        data: {
          from: balanceFromAccount,
          to: balanceFromAccount === 'cash' ? 'bank' : 'cash',
          amount: balanceAmount
        }
      }
    } else if (transferType === 'user:account-to-user:account') {
      body = {
        accountId: cookie,
        type: 'user:account-to-user:account',
        data: {
          from: uatFromAccount,
          to: uatToAccount,
          amount: uatAmount
        }
      }
    } else if (transferType === 'user:coin-to-user:coin') {
      body = {
        accountId: cookie,
        type: 'user:coin-to-user:coin',
        data: {
          from: ucToCoinFromAccount,
          to: ucToCoinToAccount,
          amount: ucToCoinAmount
        }
      }
    }

    const req = await fetch(`${BASE_URL}/api/portfolio/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const res = await req.json();

    if (res.success) {
      setAlertMessage('Successfully transferred funds.');
      setAlertShow(true);
      setAlertType('success');

      setBalanceAmount(0);
      setUatAmount(0);
      setUatToAccount('');

      setBalances(res.account.balances);

      setTimeout(() => {
        setAlertShow(false);
      }, 3000);

      fetch(`${BASE_URL}/api/account/balances`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: cookie })
      }).then(res => res.json())
      .then(res => {
        setBalances(res.balances);
      });
  
      fetch(`${BASE_URL}/api/coins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: cookie })
      }).then(res => res.json())
      .then(res => {
        setCoins(res.coins);
        setBoughtCoins(res.boughtCoins);
      });
    } else {
      setAlertMessage(res.message.charAt(0).toUpperCase() + res.message.slice(1));
      setAlertShow(true);
      setAlertType('danger');

      setTimeout(() => {
        setAlertShow(false);
      }, 3000);
    }
  }

  return (
    <>
      { 
        alertShow && (
          <Alert style={{ marginBottom: '24px' }} message={alertMessage} type={alertType} />
        )
      }
      <label style={{ fontSize: '16px' }}>Transfer Type: </label>
        <select value={transferType} onChange={(e) => setTransferType(e.target.value)} className='form-select custom-select select-style'>
          <option disabled>Select Transfer Type</option>
          <option value='balance-to-balance'>Account Balance to Account Balance</option>
          <option value='user:account-to-user:account'>Account to Another Users Account</option>
          <option value='user:coin-to-user:coin'>Coin to Another Users Coin</option>
        </select>  
        <br />
        {
          transferType === 'balance-to-balance' ? (
            <>
              <label style={{ fontSize: '16px' }}>From Account: </label>
              <select value={balanceFromAccount} onChange={(e) => setBalanceFromAccount(e.target.value)} className='form-select custom-select select-style'>
                <option disabled>Select Account 👨🏽‍💻</option>
                <option value='cash'>Cash: { format(balances.cash) }</option>
                <option value='bank'>Bank: { format(balances.bank) }</option>
              </select>
              <br />
              <label style={{ fontSize: '16px' }}>To Account: </label>
              {
                balanceFromAccount === 'cash' ? (
                  <p style={{ fontSize: '18px' }}>
                    Bank: { format(balances.bank) }
                  </p>
                ) : (
                  <p style={{ fontSize: '18px' }}>
                    Cash: { format(balances.cash) }
                  </p>
                )
              }
              <label style={{ fontSize: '16px' }}>Amount: </label>
              <div className='form-group'>
                <input value={balanceAmount} onChange={(e) => setBalanceAmount(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value ))} type='number' className='form-style' placeholder='Amount' min={0} />
                <i className='input-icon fa-solid fa-tags' />
              </div>
              <br />
            </>
          ) : transferType === 'user:account-to-user:account' ? (
            <>
              <label style={{ fontSize: '16px' }}>From Account: </label>
              <select value={uatFromAccount} onChange={(e) => setUatFromAccount(e.target.value)} className='form-select custom-select select-style'>
                <option disabled>Select Account 👨🏽‍💻</option>
                <option value='cash'>Cash: { format(balances.cash) }</option>
                <option value='bank'>Bank: { format(balances.bank) }</option>
              </select>
              <br />
              <label style={{ fontSize: '16px' }}>To Account: </label>
              <div className='form-group'>
                <input value={uatToAccount} onChange={(e) => setUatToAccount(e.target.value)} type='text' className='form-style' placeholder='Username'/>
                <i className='input-icon fa-solid fa-user' />
              </div>
              <br />
              <label style={{ fontSize: '16px' }}>Amount ($): </label>
              <div className='form-group'>
                <input value={uatAmount} onChange={(e) => setUatAmount(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value ))} type='number' className='form-style' placeholder='Amount' min={0} />
                <i className='input-icon fa-solid fa-tags' />
              </div>
              <br />
            </>

          ) : transferType === 'user:coin-to-user:coin' && (
            <>
              <label style={{ fontSize: '16px' }}>From Coin: </label>
              <select value={ucToCoinFromAccount} onChange={(e) => setUcToCoinFromAccount(e.target.value)} className='form-select custom-select select-style'>
                <option disabled>Select Coin 💵</option>
                {
                  coins.map((coin, index) => (
                    boughtCoins.map((boughtCoin) => (
                      boughtCoin.name === coin.name && (
                        boughtCoin.amount > 0 && (
                          <option key={index} value={coin.name}>{ coin.name }: { boughtCoin.amount.toFixed(6) }</option>
                        )
                      )
                    ))
                  ))
                }
              </select>
              <br />
              <label style={{ fontSize: '16px' }}>To Wallet: </label>
              <div className='form-group'>
                <input value={ucToCoinToAccount} onChange={(e) => setUcToCoinToAccount(e.target.value)} type='text' className='form-style' placeholder='Wallet'/>
                <i className='input-icon fa-solid fa-wallet' />
              </div>
              <br />
              <label style={{ fontSize: '16px' }}>Amount ($): </label>
              <div className='form-group'>
                <input value={ucToCoinAmount} onChange={(e) => setUcToCoinAmount(isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value ))} type='number' className='form-style' placeholder='Amount' min={0} />
                <i className='input-icon fa-solid fa-tags' />
              </div>
              <br />
            </>
          )
        }
        {
          buttonLoading ? (
            <button disabled onClick={transfer} className='btn btn-purple shadow-none' style={{ width: '100%', fontSize: '20px', marginTop: '10px' }}>
              Transfer <i className='fa-solid fa-circle-notch fa-spin' />
            </button>
          ) : (
            <button onClick={transfer} className='btn btn-purple shadow-none' style={{ width: '100%', fontSize: '20px', marginTop: '10px' }}>
              Transfer <i className='fa-solid fa-arrow-right-arrow-left' />
            </button>
          )
        }
    </>
  );
}

export default Transfer;