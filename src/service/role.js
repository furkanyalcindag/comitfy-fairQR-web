export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getRoles(state, page) {
      // CHECK IF USER LOGGED IN ALREADY

      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      var axios = require('axios')
      console.log(page)
      let filterBy = page.filter ? page.filter : []
      var data = JSON.stringify({
        filters: filterBy,
        pageNumber: page.page - 1,
        pageSize: page.rowsPerPage,
        language: page.language,
      })
      var config = {
        method: 'post',
        url: 'user-api/role/get-all-by-filter',
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
    },
    async deleteRole(state, uuid) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      var axios = require('axios')
      var config = {
        method: 'delete',
        url: 'user-api/role/' + uuid,
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const response = await axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data))
          return true
        })
        .catch(function (error) {
          console.log(error)
          return false
        })
      return response
    },
    async addRole(state, roleData) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      var axios = require('axios')
      var data = JSON.stringify(roleData)
      var config = {
        method: 'post',
        url: 'user-api/role/',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }
      const response = await axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data.name))
          return true
        })
        .catch(function (error) {
          console.log(error)
          return false
        })
      return response
    },
    // eslint-disable-next-line
    async updateRole(state, roleData) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      var axios = require('axios')
      var data = JSON.stringify({
        language: roleData.language,
        name: roleData.name,
      })
      var config = {
        method: 'put',
        url: 'user-api/role/' + roleData.uuid,
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }
      const response = axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data))
          return true
        })
        .catch(function (error) {
          console.log(error)
          return false
        })
      return response
    },
  },
  getters: {},
}
