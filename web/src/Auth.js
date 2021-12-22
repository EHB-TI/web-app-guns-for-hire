import axios from 'axios'

export default class Auth {
  isAuthenticated = async () => {
    if (localStorage.getItem('access_token') === null) {
      return false
    }

    const token = localStorage.getItem('access_token')

    try {
      await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/token/verify`, {
        headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' },
      })
      return true
    } catch (error) {
      return false
    }
  }

  refreshCurrentToken = async () => {
    const token = localStorage.getItem('access_token')
    const refreshToken = localStorage.getItem('refresh_token')
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/token/refresh`,
        { refresh_token: refreshToken },
        {
          headers: { Authorization: 'Bearer ' + token, Accept: 'application/json' },
        }
      )
      localStorage.setItem('access_token', response.data.data.access_token)
    } catch (error) {
      console.log(error)
    }
  }

  logout = () => {
    if (localStorage.getItem('access_token') !== null) {
      localStorage.removeItem('access_token')
      window.location.href = '/'
    }
  }
}
