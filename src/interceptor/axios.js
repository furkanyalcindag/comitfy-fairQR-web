/* eslint-disable no-unused-vars */
// @ts-check
import axios from 'axios'
import router from '@/router'
import store from '@/store'

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL

axios.interceptors.request.use(
  (request) => {
    store.dispatch('auth/checkIfLoggedIn')
    if (store.state.isLoggedIn) {
      request.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
    }
    return request
  },
  (err) => {
    console.log('Request timeout')
    if (err.response.data.errorMessage != null) {
      return Promise.reject(err.response.data.errorMessage)
    }
    return Promise.reject(err.message)
  },
)

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (err) => {
    switch (err.response.status) {
      case 401:
        // Response to successful interception
        console.log('Response interceptor activated. Redirecting to login page')
        store.dispatch('auth/attemptRestore')
        // ROLE CHECK IS NEEDED
        router.push({ name: 'Login Admin' })
        break

      default:
        break
    }

    return Promise.reject(err)
  },
)
