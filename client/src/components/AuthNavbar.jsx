import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const AuthNavbar = ({ page }) => {
  return (
    <>
      <nav className='navbar navbar-expand-lg navbar-light' style={{ backgroundColor: 'var(--grey)' }}>
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
                  page === 'home' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/home'>
                      Home <i className='fa-solid fa-house' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/home'>
                      Home <i className='fa-solid fa-house' />
                    </Link>
                  )
                }
							</li>
							<li className='nav-item'>
								{
                  page === 'login' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/login'>
                      Login <i className='fa-solid fa-arrow-right-to-bracket' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/login'>
                      Login <i className='fa-solid fa-arrow-right-to-bracket' />
                    </Link>
                  )
                }
							</li>
							<li className='nav-item'>
								{
                  page === 'register' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/register'>
                      Register <i className='fa-solid fa-user-plus' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/register'>
                      Register <i className='fa-solid fa-user-plus' />
                    </Link>
                  )
                }
							</li>
						</ul>
					</div>
				</div>
			</nav>
			<br />
			<br /> 
    </>
  )
}

AuthNavbar.propTypes = {
  page: PropTypes.string.isRequired
}

export default AuthNavbar;