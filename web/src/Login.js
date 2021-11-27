import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { loginUrl } from './spotify'

const useStyles = makeStyles({
  login: {
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
function Login() {
  const classes = useStyles()
  return (
    <div className={classes.login}>
      <div>
        <h1>Twitch-Radio</h1>
        <a href={loginUrl}>LOGIN WITH SPOTIFY</a>
      </div>
    </div>
  )
}

export default Login
