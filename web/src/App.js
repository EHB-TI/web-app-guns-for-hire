import './App.css'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import Login from './Login'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import Dashboard from './Dashboard'
import ProfileTemplate from './ProfileTemplate'
import PrivacyPolicy from './PrivacyPolicy'
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
          <meta
            http-equiv='Content-Security-Policy'
            content="default-src 'self' twitch-radio.xyz *.twitch-radio.xyz localhost:3001 *.spotify.com; script-src cdn.jsdelivr.net 'unsafe-inline' 'sha256-B2yPHKaXnvFWtRChIbabYmUBFZdVfKKXHbWtWidDVF8='; img-src *; script-src-elem cdn.jsdelivr.net; frame-src *.spotify.com"
          />
          <link
            href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css'
            rel='stylesheet'
            integrity='sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3'
            crossorigin='anonymous'></link>
          <script
            src='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js'
            integrity='sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p'
            crossorigin='anonymous'></script>
        </Helmet>
        <Router>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element={<Dashboard />} />
            <Route path='/profile' element={<ProfileTemplate />} />
            <Route path='/streamer' element={<ProfileTemplate />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
          </Routes>
        </Router>
      </div>
    )
  }
}

export default App
