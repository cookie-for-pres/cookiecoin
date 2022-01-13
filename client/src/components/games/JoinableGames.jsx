/* eslint-disable no-unused-vars */

import React from 'react';

import JoinableGame from './JoinableGame';

const JoinableGames = ({ games }) => {
  return (
    <>
      <p className='text-muted' style={{ textAlign: 'center', fontSize: '20px' }}>
        Can't find any joinable game <i className='fa-solid fa-face-frown' />
      </p>
    </>
  );
}

export default JoinableGames;