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
                  page === 'login' ? (
                    <Link className='nav-link' style={{ color: 'var(--purple)' }} to='/admin/login'>
                      Login <i className='fa-solid fa-arrow-right-to-bracket' />
                    </Link>
                  ) : (
                    <Link className='nav-link' style={{ color: 'var(--light)' }} to='/admin/login'>
                      Login <i className='fa-solid fa-arrow-right-to-bracket' />
                    </Link>
                  )
                }
							</li>
							<li className='nav-item'>
								<a className='nav-link' style={{ color: 'var(--light)' }} href='/home'>
                  Back <i className='fa-solid fa-door-open' />
                </a>
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