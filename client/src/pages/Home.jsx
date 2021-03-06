import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';

import AuthNavbar from '../components/AuthNavbar';

const format = (amount) => {
  return (amount).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }); 
}

const Home = () => {
	const [leaderboard, setLeaderboard] = useState([]);

	// eslint-disable-next-line no-undef
	const BASE_URL = process.env.REACT_APP_API_BASE_URL;

	useEffect(() => {
		axios.post(`${BASE_URL}/api/leaderboard`, {}, { headers: { 'Content-Type': 'application/json' } })
		.then(res => {
			if (res.data.success) {
				setLeaderboard(res.data.leaderboard);
			}
		});
	}, []);

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
						<div className='card' style={{ height: '83%' }}>
							<div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)'}}>
								<ul className='list-group list-group-flush'>
									<li className='list-group-item'>
										<div className='row'>
											<div className='col-sm-6'>
												Coinflip • <span className='text-muted'>1 Player <i className='fa-solid fa-user' /></span>
											</div>
											<div className='col-sm-6'>
												<Link className='btn btn-purple shadow-none' style={{ float: 'right', width: '32%' }} to='/games/coinflip'>
													Play <i className='fa-solid fa-play' />
												</Link>
											</div>
										</div>
									</li>
									<li className='list-group-item'>
										<div className='row'>
											<div className='col-sm-6'>
												Blackjack • <span className='text-muted'>1 Player <i className='fa-solid fa-user' /></span>
											</div>
											<div className='col-sm-6'>
												<Link className='btn btn-purple shadow-none' style={{ float: 'right', width: '32%' }} to='/games/blackjack'>
													Play <i className='fa-solid fa-play' />
												</Link>
											</div>
										</div>
									</li>
									<li className='list-group-item'>
										Rock Paper Scissors • <span className='text-muted'>1-2 Players <i className='fa-solid fa-user' /></span>
										<Link className='btn btn-purple shadow-none disabled' style={{ float: 'right', width: '15%' }} to='/rock-paper-scissors'>
											Play <i className='fa-solid fa-play' />
										</Link>
									</li>
									<li className='list-group-item'>
										Crash • <span className='text-muted'>1-10 Players <i className='fa-solid fa-user' /></span>
										<Link className='btn btn-purple shadow-none disabled' style={{ float: 'right', width: '15%' }} to='/crash'>
											Play <i className='fa-solid fa-play' />
										</Link>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className='col-sm-6'>
						<h1 style={{ textAlign: 'center' }}>Leaderboard</h1>
						<br />
						<div className='card' style={{ height: '83%' }}>
							<div className='card-body' style={{ color: 'var(--light)', backgroundColor: 'var(--grey)' }}>
								<ul className='list-group list-group-flush'>
									{
										leaderboard.length > 0 ? (
											leaderboard.map((account) => (
												<li className='list-group-item' key={account.username}>
													{ account.username }
													<span style={{ float: 'right' }}>
														{ format(account.balance) }
													</span>
												</li>
											))
										) : (
          						<p style={{ textAlign: 'center', fontSize: '105.5px' }}><i className='fa-solid fa-circle-notch fa-spin' /></p>	
										)

									}
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