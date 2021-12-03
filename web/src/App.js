import './App.css'
import React, { Component } from 'react'
import Login from './Login'
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom'
import Dashboard from './Dashboard'
import ProfileTemplate from './ProfileTemplate'
import Auth from './Auth'
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      me: {},
      auth: new Auth(),
    }
  }

  componentDidMount = () => {}

  render() {
    return (
      <div className='App'>
        <Router>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/home' element={<Dashboard />} />
            <Route
              path='/profile'
              element={
                this.state.auth.isAuthenticated() ? (
                  <ProfileTemplate />
                ) : (
                  <Navigate to='/' replace={true} />
                )
              }
            />
          </Routes>
        </Router>
      </div>
    )
  }
}

export default App
