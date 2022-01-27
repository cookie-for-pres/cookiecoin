import React from 'react';
import moment from 'moment';

const RecentUser = ({ username, lastLogin }) => {
  return (
    <>
      <li className='list-group-item' style={{ textDecoration: 'none', fontSize: '18px' }}>
        { username } <span style={{ float: 'right' }}>{ moment(lastLogin).fromNow() }</span>
      </li>
    </>
  );
};

export default RecentUser;
