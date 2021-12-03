import React from 'react'
import { loginUrl } from './spotify'

function Login() {
  return (
    <div className='main-wrapper center'>
      <div className='card center flex-column'>
        <h1>Twitch Radio</h1>
        <a className='login-btn' href={loginUrl}>
          LOGIN WITH SPOTIFY
        </a>
      </div>
    </div>
  )
}

export default Login
