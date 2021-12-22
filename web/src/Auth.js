import axios from 'axios'

export default class Auth {
  isAuthenticated = async () => {
    if (sessionStorage.getItem('access_token') === null) {
      return false
    }

    const token = sessionStorage.getItem('access_token')

    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/token/verify`, {
        headers: { Authorization: 'Bearer ' + token },
      })
      return true
    } catch (error) {
      return false
    }
  }

  refreshCurrentToken = async () => {
    const token = sessionStorage.getItem('access_token')
    const refreshToken = sessionStorage.getItem('refresh_token')
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/token/refresh`,
        { refresh_token: refreshToken },
        {
          headers: { Authorization: 'Bearer ' + token },
        }
      )
      sessionStorage.setItem('access_token', response.data.data.access_token)
    } catch (error) {
      console.log(error)
    }
  }

  logout = () => {
    console.log('logout')
    if (sessionStorage.getItem('access_token') !== null) {
      sessionStorage.removeItem('access_token')
      window.location.href = '/'
    }
  }
}
