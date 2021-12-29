import React from 'react';
import Friend from './Friend';

const Friends = ({ friends }: any) => {
  return (
    <>
     <ul className="list-group list-group-flush">
        {
          friends.length >= 1 ? (
              friends.map(friend => (
                <Friend username={friend.username} url={`/friend/${friend._id}`} profilePicture={friend.profilePicture} />
              ))
          ) : (
            <p className='text-muted' style={{ textAlign: 'center', fontSize: '20px' }}>You have no friends <i className="fa-solid fa-face-frown" /></p>
          )
        }
      </ul> 
    </>
  );
}

export default Friends;
