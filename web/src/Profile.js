import React, { useEffect, useState } from 'react'
import linkTwitch from './linkTwitch'
import { loginUrl } from './twitch.js'
import { makeStyles } from '@material-ui/core/styles'
import { verifyAuthenticated } from './helper'
import axios from 'axios'

const useStyles = makeStyles({
  profile: {
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

const GetMe = async () => {
  return await axios.get('http://localhost:3001/auth/me', {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') },
  })
}

const Profile = () => {
  //if clause?
  //https://dev.twitch.tv/docs/authentication/getting-tokens-oauth#oauth-implicit-code-flow
  const code = new URLSearchParams(window.location.search).get('code')
  linkTwitch(code)
  const [auth, setAuth] = useState([])
  const [me, setMe] = useState([])
  useEffect(() => {
    verifyAuthenticated()
      .then((response) => {
        setAuth(response)
      })
      .catch((err) => console.log(err))
  }, [auth])
  useEffect(() => {
    GetMe()
      .then((response) => {
        setMe(response)
      })
      .catch((err) => console.log(err))
  }, [me])

  const classes = useStyles()
  if (auth === true) {
    console.log(me)
    return (
      <div className={classes.profile}>
        <div>
          <a href={loginUrl}>link twitch</a>
        </div>
      </div>
    )
  } else {
    return (
      <div className={classes.profile}>
        <div>Unauthorized</div>
      </div>
    )
  }
}

export default Profile
