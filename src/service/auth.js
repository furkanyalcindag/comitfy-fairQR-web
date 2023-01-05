import router from '@/router'
import store from '@/store/'
export default {
  namespaced: true,
  state: {},
  mutations: {
    LOG_IN(state, data) {
      localStorage.setItem('token', data['jwt-token'])
    },

    CHECK_ROLES() {},

    LOG_OUT() {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token')
      }
    },
  },
  actions: {
    async signIn(_, credentials) {
      var axios = require('axios')
      var data = JSON.stringify(credentials)

      var config = {
        method: 'post',
        url: 'auth/login',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }

      const response = await axios(config)
        .then((response) => {
          store.dispatch('auth/attemptRestore')
          store.dispatch('auth/attempt', response.data)
          // ROLE CONTROL IS NEEDED HERE
          router.push({ name: 'Home' })
          return { authorized: true, response: response }
        })
        .catch((error) => {
          store.dispatch('auth/attemptRestore')
          return { authorized: false, response: error }
        })

      return response
    },

    async attempt({ commit }, data) {
      commit('LOG_IN', data)
    },

    async attemptRestore({ commit }) {
      commit('LOG_OUT')
    },
  },

  getters: {
    checkIfLoggedIn() {
      return Boolean(localStorage.getItem('token'))
    },
  },
}
