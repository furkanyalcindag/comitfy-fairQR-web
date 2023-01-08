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
      // ROLE CHECK IS NEEDED HERE --------IMPORTANT
      router.push({ name: 'Login Admin' })
    },
  },
  actions: {
    async signIn(_, credentials) {
      var axios = require('axios')
      var data = JSON.stringify(credentials)

      var config = {
        method: 'post',
        url: process.env.VUE_APP_API_BASE_URL + 'auth/login',
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

    async attemptLogOut() {
      store.dispatch('auth/attemptRestore')
    },

    async attempt({ commit }, data) {
      commit('LOG_IN', data)
    },

    async attemptRestore({ commit }) {
      commit('LOG_OUT')
    },

    checkIfLoggedIn() {
      if (localStorage.getItem('token')) {
        store.state.isLoggedIn = true
      } else {
        store.state.isLoggedIn = false
        if (
          !store.state.disabledLoginRoutePageNames.includes(
            router.currentRoute.value.name,
          )
        )
          router.push({ name: 'Login Admin' })
      }
    },
  },

  getters: {},
}
