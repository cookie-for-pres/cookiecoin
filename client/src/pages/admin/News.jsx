import React from 'react';
import { Helmet } from 'react-helmet';

import Navbar from '../../components/admin/Navbar';

const News = () => {
  return (
    <>
      <Helmet>
        <title>CookieCoin • Admin News</title>
      </Helmet>

      <Navbar page='news' />
    </>
  );
};

export default News;