import './App.css'
import Login from './Login'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import Dashboard from './Dashboard'
import Profile from './Profile'

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/home' element={<Dashboard />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
      </Router>
    </div>
  )
  // return <div className='App'>{code ? <Dashboard code={code} /> : <Login />}</div>
}

export default App
