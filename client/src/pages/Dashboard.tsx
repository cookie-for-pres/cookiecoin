import React from 'react'
import { Helmet } from 'react-helmet'

import Navbar from '../components/Navbar'

const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>CookieCoin • Dashboard</title>
      </Helmet>

      <Navbar page='dashboard' />
    </>
  )
}

export default Dashboard;