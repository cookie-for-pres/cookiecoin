import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';

const Navbar = ({ page }) => {
  const cookies = new Cookies();
  const cookie = cookies.get('account');

  // eslint-disable-next-line no-undef
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/auth/token`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ token: cookie })
    }).then((res) => res.json())
    .then((res) => {
      if (!res.success) {
        cookies.remove('account');
        window.location.reload();
      }
    });
  }, [page]);

  return (
    <>
      <nav className='navbar navbar-expand-lg navbar-light ' style={{ backgroundColor: 'var(--grey)' }}>
        <div className='container-fluid'>
          <a className='navbar-brand'>
						<img src='/logo512.png' alt='' width='30' height='30' className='d-inline-block align-text-top' />
					</a>
          <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
						<i style={{ color: 'var(--light)', border: '0' }} className='fa-solid fa-plus' />
					</button>
          <div className='collapse navbar-collapse' id='navbarNav' style={{ alignItems: 'center', textAlign: 'center' }}>
            <ul className='navbar-nav ml-auto' style={{ marginLeft: 'auto' }}>
              <li className='nav-item'>
                {
                  page === 'dashboard' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/dashboard'>
                      Dashboard <i className='fa-solid fa-chart-line' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/dashboard'>
                      Dashboard <i className='fa-solid fa-chart-line' />
                    </Link>
                  )
                }
              </li>
              <li className='nav-item'>
                {
                  page === 'games' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/games'>
                      Games <i className='fa-solid fa-dice' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/games'>
                      Games <i className='fa-solid fa-dice' />
                    </Link>
                  )
                }
              </li>
              <li className='nav-item'>
                {
                  page === 'coins' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/coins'>
                      Coins <i className='fa-solid fa-coins' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/coins'>
                      Coins <i className='fa-solid fa-coins' />
                    </Link>
                  )
                }
              </li>
              <li className='nav-item'>
                {
                  page === 'portfolio' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/portfolio'>
                      Portfolio <i className='fa-solid fa-piggy-bank' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/portfolio'>
                      Portfolio <i className='fa-solid fa-piggy-bank' />
                    </Link>
                  )
                }
              </li>
              <li className='nav-item'>
                {
                  page === 'friends' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/friends'>
                      Friends <i className='fa-solid fa-user-group' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/friends'>
                      Friends <i className='fa-solid fa-user-group' />
                    </Link>
                  )
                }
              </li>
              <li className='nav-item'>
                {
                  page === 'settings' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/settings'>
                      Settings <i className='fa-solid fa-gears' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/settings'>
                      Settings <i className='fa-solid fa-gears' />
                    </Link>
                  )
                }
              </li>
              <li className='nav-item'>
                {
                  page === 'logout' ? (
                    <a className='nav-link' style={{ color: 'var(--purple)' }} href='/logout'>
                      Logout <i className='fa-solid fa-power-off' />
                    </a>
                  ) : (
                    <a className='nav-link' style={{ color: 'var(--light)' }} href='/logout'>
                      Logout <i className='fa-solid fa-power-off' />
                    </a>
                  )
                }
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <br />
    </>
  )
}

Navbar.propTypes = {
  page: PropTypes.string.isRequired
}

export default Navbar;