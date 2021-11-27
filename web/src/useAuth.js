import { useEffect, useState } from 'react'
import axios from 'axios'

export default function useAuth(code) {
  useEffect(() => {
    axios
      .post('http://localhost:3001/auth/spotify', { code })
      .then((response) => {
        localStorage.setItem('access_token', response.data.data.accessToken)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [code])
}
