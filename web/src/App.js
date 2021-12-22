import './App.css'
import React, { Component } from 'react'
import {Helmet} from "react-helmet";
import Login from './Login'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import Dashboard from './Dashboard'
import ProfileTemplate from './ProfileTemplate'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      me: {},
    }
  }

  render() {
    return (
      <div className='App'>
        <Helmet>
          <meta http-equiv="Content-Security-Policy" content="default-src 'self' twitch-radio.xyz *.twitch-radio.xyz"/>
        </Helmet>
        <Router>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element={<Dashboard />} />
            <Route path='/profile' element={<ProfileTemplate />} />
            <Route path='/streamer' element={<ProfileTemplate />} />
          </Routes>
        </Router>
      </div>
    )
  }
}

export default App
