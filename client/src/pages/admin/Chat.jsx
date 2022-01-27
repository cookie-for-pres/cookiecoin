import React from 'react';
import { Helmet } from 'react-helmet';

import Navbar from '../../components/admin/Navbar';

const Chat = () => {
  return (
    <>
      <Helmet>
        <title>CookieCoin • Admin Chat</title>
      </Helmet>

      <Navbar page='chat' />
    </>
  );
};

export default Chat;