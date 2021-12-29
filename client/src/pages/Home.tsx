/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

import AuthNavbar from '../components/AuthNavbar';

const Home = () => {
	return (
		<>
				<Helmet>
					<title>
						CookieCoin • Home
					</title>
				</Helmet>
			
			<AuthNavbar page='home' />

			<h1 style={{ textAlign: 'center' }}>CookieCoin</h1>
			<br />
			<div className='container'>
				<div className='card'>
					<div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>
						<p style={{ fontSize: '18px' }}>
							Here at CookieCoin you can take the free fake crypto provided to you and do anything with it.
							You can play games, talk to friends, and find a great new community to be around. Enjoy your
							stay - <strong style={{ color: 'var(--purple)'}}>CEO of CookieCoin</strong>.
						</p>
					</div>
				</div>
				<br />
				<br />
				<div className='row'>
					<div className='col-sm-6'>
						<h1 style={{ textAlign: 'center' }}>Games</h1>
						<br />
						<div className='card' style={{ height: '78%' }}>
							<div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>
								<ul className='list-group list-group-flush'>
									<li className='list-group-item'>
										Coinflip • <span className='text-muted'>1 Player <i className='fa-solid fa-user' /></span>
										<Link className='btn btn-purple shadow-none' style={{ float: 'right', width: '15%' }} to='/coinflip'>
											Play
										</Link>
									</li>
									<li className='list-group-item'>
										Blackjack • <span className='text-muted'>1-4 Players <i className='fa-solid fa-user' /></span>
										<Link className='btn btn-purple shadow-none' style={{ float: 'right', width: '15%' }} to='/blackjack'>
											Play
										</Link>
									</li>
									<li className='list-group-item'>
										Rock Paper Scissors • <span className='text-muted'>1-2 Players <i className='fa-solid fa-user' /></span>
										<Link className='btn btn-purple shadow-none' style={{ float: 'right', width: '15%' }} to='/rock-paper-scissors'>
											Play
										</Link>
									</li>
									<li className='list-group-item'>
										Crash • <span className='text-muted'>1-10 Players <i className='fa-solid fa-user' /></span>
										<Link className='btn btn-purple shadow-none' style={{ float: 'right', width: '15%' }} to='/crash'>
											Play
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className='col-sm-6'>
						<h1 style={{ textAlign: 'center' }}>Leaderboard</h1>
						<br />
						<div className='card' style={{ height: '78%' }}>
							<div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
								<ul className='list-group list-group-flush'>
									<li className='list-group-item'>
										----- <span style={{ float: 'right' }}>$0</span>
									</li>
									<li className='list-group-item'>
										----- <span style={{ float: 'right' }}>$0</span>
									</li>
									<li className='list-group-item'>
										----- <span style={{ float: 'right' }}>$0</span>
									</li>
									<li className='list-group-item'>
										----- <span style={{ float: 'right' }}>$0</span>
									</li>
									<li className='list-group-item'>
										----- <span style={{ float: 'right' }}>$0</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Home;