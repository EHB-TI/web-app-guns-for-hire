import React, { Component } from 'react'
import axios from 'axios'
import useAuth from './useAuth'
import { makeStyles } from '@material-ui/core/styles'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Me: {},
      code: null,
      streamers: [{}],
      streamer:"",
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount = () => {
    this.setState({ code: new URLSearchParams(window.location.search).get('code') }, ()=>{
      if (this.state.code !== null) {
        axios
          .post('http://localhost:3001/auth/spotify', {code: this.state.code })
          .then((response) => {
            localStorage.setItem('access_token', response.data.data.accessToken)
          })
          .catch((err) => {
            console.log(err)
          })
      }
    })
    axios.get('http://localhost:3001/twitch/findAllStreamers',
    { headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') } })
      .then((response) => {
        console.log(response.data.data)
        this.setState({streamers: response.data.data.users})
      })
      .catch((err) => {
        console.log(err)
      })
  }
  handleChange(event) {
    this.setState({streamer: event.target.value});
  }
  handleSubmit(event) {
    event.preventDefault();
    axios.post('http://localhost:3001/twitch/findStreamer', {streamer: this.state.streamer },
    { headers: { Authorization: 'Bearer ' + localStorage.getItem('access_token') } })
      .then((response) => {
        console.log(response.data.data)
        //go to profile page with spotify id
      })
      .catch((err) => {
        console.log(err)
      })
  }
  render = () => {
    const classes = makeStyles({
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

    return (
      <div className={classes.dashboard}>
        <div>
          <a href='/profile'>Stream music</a>
          <form onSubmit={this.handleSubmit}>
        <label>
          Twitch name:
          <input type="text" value={this.state.streamer} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
        </div>
      </div>
    )
  }
  
}

export default Dashboard
