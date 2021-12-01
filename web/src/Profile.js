import React, { Component } from 'react'
import axios from 'axios'
import { loginUrl } from './twitch'
class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Me: {},
      code: null,
      twitchLinked: false,
    }
  }

  componentDidMount = () => {
    this.setState({ code: new URLSearchParams(window.location.search).get('code') })
    if (this.state.code !== null) {
      axios
        .post(
          `http://localhost:3001/auth/twitch`,
          { code: this.state.code },
          { headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') } }
        )
        .then((response) => {
          console.log('linked')
          this.setState({ twitchLinked: true })
        })
        .catch((error) => {
          console.log(error)
        })
    }
    axios
      .get('http://localhost:3001/auth/me', {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') },
      })
      .then((response) => {
        this.setState({ Me: response.data.data })
      })
      .catch((error) => console.log(error))
  }

  render = () => {
    if (this.state.code === null) {
      return <a href={loginUrl}>link twitch</a>
    } else {
      if (this.state.twitchLinked === false) {
        return <p>Failed to link twitch</p>
      }
      return <p>Successfully linked twitch</p>
    }
  }
}

export default Profile
