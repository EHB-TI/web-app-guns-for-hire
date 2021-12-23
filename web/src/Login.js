import React, { Component } from 'react'
import Auth from './Auth'
import { loginUrl } from './spotify'
import Footer from './Footer'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: new Auth(),
    }
  }
  componentDidMount = async () => {
    const authenticated = await this.state.auth.isAuthenticated()
    if (authenticated === true) {
      window.location.href = '/profile'
    }
  }
  render = () => {
    return (
      <div className='main-wrapper center'>
        <div className='cool-card center flex-column'>
          <h1>Twitch Radio</h1>
          <a className='login-btn' href={loginUrl}>
            LOGIN WITH SPOTIFY
          </a>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Login
