import React, { useEffect } from 'react'
import useAuth from './useAuth'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  dashboard: {
    display: 'grid',
    placeItems: 'center',
    height: '100vh',
    backgroundColor: '#333',

    '& h1': {
      color: '#eee',
    },

    '& a': {
      padding: '20px',
      borderRadius: '99px',
      backgroundColor: '#1db954',
      fontWeight: 600,
      color: 'white',
      textDecoration: 'none',
    },

    '& a:hover': {
      backgroundColor: ' white',
      borderColor: '#1db954',
      color: '#1db954',
    },
  },
})

const Dashboard = () => {
  const code = new URLSearchParams(window.location.search).get('code')
  useAuth(code)
  const classes = useStyles()
  return (
    <div className={classes.dashboard}>
      <div>
        <a href='/profile'>Stream music</a>
        <form>
          <input type='search' placeholder='Search streamer' />
          <button>Search</button>
        </form>
      </div>
    </div>
  )
}

export default Dashboard
