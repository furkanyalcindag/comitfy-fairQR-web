/* eslint-disable */
import router from '@/router'
import store from '@/store/'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getLanguages(state, page, filter) {
      // CHECK IF USER LOGGED IN ALREADY
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')
        let filterBy = filter ? filter : []
        var data = JSON.stringify({
          filters: filterBy,
          pageNumber: page.page - 1,
          pageSize: page.rowsPerPage,
        })

        var config = {
          method: 'post',
          url: 'language/get-all-by-filter',
          headers: {
            'Content-Type': 'application/json',
          },
          data: data,
        }

        const response = await axios(config)
          .then(function (response) {
            return response.data
          })
          .catch(function (error) {
            console.log(error)
            return null
          })
        return response
      } else {
        // ROLE CHECK IS NEEDED HERE
        router.push({ name: 'Login Admin' })
      }
    },
  },
  getters: {},
}
