import React from 'react';
import { Link } from 'react-router-dom';

const Friend = ({ username, url, profilePicture }) => {
  return (
    <>
      <li className='list-group-item' style={{ textDecoration: 'none', fontSize: '18px' }}>
        <img width='35px' height='35px' src={profilePicture} className='rounded-circle' alt='profile' style={{ marginRight: '5px' }} />
        { username } 
        <span style={{ float: 'right' }}>
          <Link to={url} className='btn' style={{ color: 'var(--light)', backgroundColor: 'var(--purple)' }}>
            View <i className='fa-solid fa-magnifying-glass' />
          </Link>
        </span>
      </li>
    </>
  );
}

export default Friend;