import axios from 'axios'
import React, { Component } from 'react'
import Auth from './Auth'
import logo from './twitch-radio-logo-neg.png'
import { loginUrl } from './twitch'

class ProfileTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      me: null,
      user: null,
      streamers: [],
      auth: new Auth(),
    }
  }

  componentDidMount = async () => {
    const authenticated = await this.state.auth.isAuthenticated()
    console.log(authenticated)
    if (authenticated === false) {
      window.location.href = '/'
    }

    this.setState({ code: new URLSearchParams(window.location.search).get('code') })
    if (this.state.code !== null) {
      axios
        .post(
          `http://localhost:3001/auth/twitch`,
          { code: this.state.code },
          { headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') } }
        )
        .then((response) => {
          if (localStorage.getItem('access_token') !== null) {
            this.state.auth.refreshCurrentToken()
            window.location.href = '/profile'
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const token = localStorage.getItem('access_token')
    const streamer = new URLSearchParams(window.location.search).get('streamer')
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/twitch/findAllStreamers`, {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then((response) => {
        if (response.data.data.found) {
          this.setState({ streamers: response.data.data.users })
        }
      })
      .catch((error) => console.log(error))

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/auth/me`, {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then((response) => {
        this.setState({ me: response.data.data.user })
        if (streamer === null) {
          this.setState({ user: response.data.data.user })
        }
      })
      .catch((error) => {
        console.log(error)
      })

    if (streamer !== null) {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/twitch/findStreamer`,
          { streamer },
          { headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') } }
        )
        .then((response) => {
          this.setState({ user: response.data.data.user })
        })
    }
    console.log(this.state)
  }

  streamMusic = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/spotify/currently-playing`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
      })
      .then((response) => {
        console.log(response)
      })
  }

  render = () => {
    console.log(this.state)
    if (this.state.user !== null) {
      return (
        <>
          <nav>
            <a href='/'>
              <img className='twitch-radio-logo' src={logo} alt='twitch-radio-logo' />
            </a>
            <form className='search-bar' action='/streamer'>
              <input
                list='streamers'
                type='search'
                name='streamer'
                placeholder='Search for a streamer by username'
                id='streamer-search'
              />
              <datalist id='streamers'>
                {/* FOR LOOP OVER STREAMERS FROM DATABASE */}
                {this.state.streamers.map((streamer, index) => {
                  return <option value={streamer} />
                })}
              </datalist>
            </form>
            <ul>
              <li>
                <button onClick={this.state.auth.logout}>Logout</button>
              </li>
            </ul>
          </nav>
          <div className='main-wrapper center'>
            <div className='card'>
              <div className='profile'>
                <div className='profile-pic'>
                  <img
                    src={
                      this.state.user.profileImageUrl !== undefined
                        ? this.state.user.profileImageUrl
                        : ''
                    }
                    alt='profile pic'
                  />
                </div>
                <h2>{this.state.user.name}</h2>
                <p>
                  {this.state.user.twitch.displayName !== undefined
                    ? this.state.user.twitch.displayName
                    : ''}
                </p>
              </div>
              <div className='spotify'>
                {this.state.user.email === this.state.me.email ? (
                  this.state.me.role === 'streamer' ? (
                    <button onClick={this.streamMusic}>stream music</button>
                  ) : (
                    <a href={loginUrl}>
                      <button>link twitch</button>
                    </a>
                  )
                ) : (
                  <>
                    <h3>Currently listening to...</h3>
                    <img
                      className='song-cover'
                      src='https://i.scdn.co/image/ab67616d0000b273a6bbd9d1d796f76d51f00b8c'
                      alt='cover'
                    />
                    <div className='song-info'>
                      <p>artist - song </p>
                    </div>
                    <div className='timeline'>
                      <div className='time'>
                        <span id='current-time'>--:--</span>
                        <span id='total-time'>--:--</span>
                      </div>
                      <div className='slide-container'>
                        <input
                          disabled
                          className='slider'
                          type='range'
                          min='1'
                          max='100'
                          value='50'
                        />
                      </div>
                    </div>
                    <button className='volume'>
                      <span className='material-icons'>volume_off</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )
    }
    return <p>LOADING</p>
  }
}

export default ProfileTemplate
