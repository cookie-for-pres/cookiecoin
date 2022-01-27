import React from 'react';

import RecentUser from './RecentUser';

const RecentUsers = ({ recentUsers }) => {
  return (
    <>
      <ul className='list-group list-group-flush'>
        {
          recentUsers.map((recentUser) => (
            <RecentUser 
              key={recentUser._id}  
              username={recentUser.username}
              lastLogin={recentUser.updatedAt}
            />
          ))
        }
      </ul>
    </>
  );
};

export default RecentUsers;
