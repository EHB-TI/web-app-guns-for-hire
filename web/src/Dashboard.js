import React, { Component } from 'react'
import axios from 'axios'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      code: null,
    }
  }

  componentDidMount = () => {
    this.setState({ code: new URLSearchParams(window.location.search).get('code') }, () => {
      if (this.state.code !== null && this.state.code !== '') {
        axios
          .post(
            `${process.env.REACT_APP_BACKEND_URL}/auth/spotify`,
            { code: this.state.code },
            { headers: { Accept: 'application/json' } }
          )
          .then((response) => {
            sessionStorage.setItem('access_token', response.data.data.accessToken)
            sessionStorage.setItem('refresh_token', response.data.data.refreshToken)
            window.location.href = '/profile'
          })
          .catch((err) => {
            alert(err)
            window.location.href = '/'
          })
      } else {
        window.location.href = '/'
      }
    })
  }

  render = () => {
    return <div>LOADING...</div>
  }
}

export default Dashboard
