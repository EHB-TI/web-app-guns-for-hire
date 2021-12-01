import React, { Component } from 'react'
import axios from 'axios'
import { loginUrl } from './twitch'
class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Me: {},
    }
  }

  componentDidMount = () => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code !== null) {
      axios.post(
        `http://localhost:3001/auth/twitch`,
        { code },
        { headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') } }
      )
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
    return <a href={loginUrl}>link twitch</a>
  }
}

export default Profile
