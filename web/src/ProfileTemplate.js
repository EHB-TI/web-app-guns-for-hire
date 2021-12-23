import axios from 'axios'
import React, { Component } from 'react'
import Auth from './Auth'
import logo from './twitch-radio-logo-neg.png'
import noProfilePic from './no-profile-pic.jpg'
import { loginUrl } from './twitch'
import Footer from './Footer'

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
    if (authenticated === false) {
      window.location.href = '/'
    }

    this.setState({ code: new URLSearchParams(window.location.search).get('code') })
    if (this.state.code !== null) {
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/auth/twitch`,
          { code: this.state.code },
          {
            headers: {
              Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
              Accept: 'application/json',
            },
          }
        )
        .then((response) => {
          if (sessionStorage.getItem('access_token') !== null) {
            this.state.auth.refreshCurrentToken()
            window.location.href = '/profile'
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const token = sessionStorage.getItem('access_token')
    const streamer = new URLSearchParams(window.location.search).get('streamer')
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/twitch/findAllStreamers`, {
        headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' },
      })
      .then((response) => {
        if (response.data.data.found) {
          this.setState({ streamers: response.data.data.users })
        }
      })
      .catch((error) => console.log(error))

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/auth/me`, {
        headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' },
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
          {
            headers: {
              Authorization: 'Bearer ' + sessionStorage.getItem('access_token'),
              Accept: 'application/json',
            },
          }
        )
        .then((response) => {
          this.setState({ user: response.data.data.user })
        })
    }
  }

  streamMusic = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/spotify/currently-playing`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
          Accept: 'application/json',
        },
      })
      .then((response) => {
        window.location.reload()
      })
      .catch((error) => {
        alert(
          'Something went wrong while trying to stream your music. Make sure you are playing music on your spotify account first.'
        )
      })
  }

  copyData = () => {
    navigator.clipboard.writeText(JSON.stringify(this.state.me))
    alert('Data copied successfully')
  }

  deleteAccount = () => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
          Accept: 'application/json',
        },
      })
      .then((response) => {
        sessionStorage.removeItem('access_token')
        sessionStorage.removeItem('refresh_token')
        window.location.reload()
      })
  }

  stopStream = () => {
    axios
      .delete(`${process.env.REACT_APP_BACKEND_URL}/spotify/currently-playing`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('access_token')}`,
          Accept: 'application/json',
        },
      })
      .then((response) => {
        window.location.reload()
      })
  }

  reload = () => {
    this.componentDidMount()
  }

  render = () => {
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
                  return <option key={index} value={streamer} />
                })}
              </datalist>
            </form>
            <div className='dropdown'>
              <a href='/profile'>{this.state.me.name}</a>
              <div className='dropdown-content'>
                <span onClick={this.state.auth.logout}>Logout</span>
              </div>
            </div>
          </nav>
          <div className='main-wrapper center'>
            <div className='cool-card'>
              <div className='profile'>
                <div className='profile-pic'>
                  <img
                    src={
                      this.state.user.profileImageUrl !== undefined
                        ? this.state.user.profileImageUrl
                        : noProfilePic
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
                {this.state.user.email === this.state.me.email ? (
                  <div className='gdpr-buttons'>
                    <button
                      onClick={this.downloadData}
                      data-bs-toggle='modal'
                      data-bs-target='#dataModal'>
                      download my data
                    </button>
                    <button data-bs-toggle='modal' data-bs-target='#deleteAccModal'>
                      remove my account
                    </button>
                  </div>
                ) : (
                  ''
                )}
              </div>
              <div className='spotify'>
                {this.state.user.email === this.state.me.email ? (
                  this.state.me.role === 'streamer' ? (
                    this.state.me.currentlyPlayingTrack ? (
                      <>
                        <button className='stream-button' onClick={this.streamMusic}>
                          stream new music
                        </button>
                        <button className='stream-button' onClick={this.stopStream}>
                          stop streaming
                        </button>
                      </>
                    ) : (
                      <button className='stream-button' onClick={this.streamMusic}>
                        stream music
                      </button>
                    )
                  ) : (
                    <a href={loginUrl}>
                      <button className='twitch-button'>link your twitch</button>
                    </a>
                  )
                ) : this.state.user.currentlyPlayingTrack ? (
                  <>
                    <h3>Currently listening to...</h3>

                    <div className='song-info'>
                      <iframe
                        src={this.state.user.currentlyPlayingTrack.uri}
                        title='this is a unique title'
                        width='300'
                        height='380'
                        frame-border='0'
                        allowtransparency='true'
                        allow='encrypted-media'></iframe>
                    </div>
                    <button className='volume' onClick={this.reload}>
                      refresh
                    </button>
                  </>
                ) : (
                  <>
                    <p class='mt-5'>The streamer is not currently playing a song.</p>
                    <button className='volume' onClick={this.reload}>
                      refresh
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div
            className='modal fade'
            id='dataModal'
            tabIndex='-1'
            aria-labelledby='dataModalLabel'
            aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='dataModalLabel'>
                    My Data
                  </h5>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'></button>
                </div>
                <div className='modal-body'>{JSON.stringify(this.state.me)}</div>
                <div className='modal-footer'>
                  <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                    Close
                  </button>
                  <button type='button' className='btn btn-primary' onClick={this.copyData}>
                    Copy to clipboard
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className='modal fade'
            id='deleteAccModal'
            tabIndex='-1'
            aria-labelledby='deleteAccModalLabel'
            aria-hidden='true'>
            <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
              <div className='modal-content'>
                <div className='modal-header'>
                  <h5 className='modal-title' id='deleteAccModalLabel'>
                    Alert!
                  </h5>
                  <button
                    type='button'
                    className='btn-close'
                    data-bs-dismiss='modal'
                    aria-label='Close'></button>
                </div>
                <div className='modal-body'>
                  Are you sure you want to delete all your data from this account?
                </div>
                <div className='modal-footer'>
                  <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                    No
                  </button>
                  <button type='button' className='btn btn-primary' onClick={this.deleteAccount}>
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </>
      )
    }
    return <p>LOADING</p>
  }
}

export default ProfileTemplate
