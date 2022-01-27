import React from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navbar = ({ page }) => {
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
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/admin/dashboard'>
                      Dashboard <i className='fa-solid fa-chart-line' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/admin/dashboard'>
                      Dashboard <i className='fa-solid fa-chart-line' />
                    </Link>
                  )
                }
              </li>
              <li className='nav-item'>
                {
                  page === 'news' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/admin/news'>
                      News <i className='fa-solid fa-newspaper' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/admin/news'>
                      News <i className='fa-solid fa-newspaper' />
                    </Link>
                  )
                }
              </li>
              <li className='nav-item'>
                {
                  page === 'users' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/admin/users'>
                      Users <i className='fa-solid fa-users' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/admin/users'>
                      Users <i className='fa-solid fa-users' />
                    </Link>
                  )
                }
              </li>
              <li className='nav-item'>
                {
                  page === 'games' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/admin/games'>
                      Games <i className='fa-solid fa-dice' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/admin/games'>
                      Games <i className='fa-solid fa-dice' />
                    </Link>
                  )
                }
              </li>
              <li className='nav-item'>
                {
                  page === 'logs' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/admin/logs'>
                      Logs <i className='fa-solid fa-clipboard-list' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/admin/logs'>
                      Logs <i className='fa-solid fa-clipboard-list' />
                    </Link>
                  )
                }
              </li>
              <li className='nav-item'>
                {
                  page === 'protocols' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/admin/protocols'>
                      Protocols <i className='fa-solid fa-radiation' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/admin/protocols'>
                      Protocols <i className='fa-solid fa-radiation' />
                    </Link>
                  )
                }
              </li>
              <li className='nav-item'>
                {
                  page === 'chat' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/admin/chat'>
                      Chat <i className='fa-solid fa-message' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/admin/chat'>
                      Chat <i className='fa-solid fa-message' />
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