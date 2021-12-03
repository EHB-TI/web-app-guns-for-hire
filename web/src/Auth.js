import axios from 'axios'

export default class Auth {
  isAuthenticated = () => {
    if (localStorage.getItem('access_token') === null) {
      console.log('null')
      return false
    }

    const token = localStorage.getItem('access_token')

    axios.get('token/verify', { headers: { Authorization: 'Bearer ' + token } }).then((res) => {
      const expired = res.data.expired

      return !expired
    })
  }

  refreshCurrentToken = () => {}

  logout = () => {
    console.log('logout')
    if (localStorage.getItem('access_token') !== null) {
      localStorage.removeItem('access_token')
    }
  }
}
