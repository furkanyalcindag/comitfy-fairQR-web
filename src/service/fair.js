import fairDTO from '@/models/fairDTO'
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getFairs(state, page) {
      // CHECK IF USER LOGGED IN ALREADY

      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY -----------IMPORTANT
      var axios = require('axios')
      let filterBy = page.filter ?? []
      var data = JSON.stringify({
        filters: filterBy,
        pageNumber: page.page - 1,
        pageSize: page.rowsPerPage,
      })
      var config = {
        method: 'post',
        url: 'fair/get-all-by-filter',
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
    async addFair(state, fairData) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY --------------IMPORTANT
      var axios = require('axios')
      var data = JSON.stringify(fairData)
      console.log(data)
      var config = {
        method: 'post',
        url: 'fair/',
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
    async updateFair(state, fairData) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY --------IMPORTANT
      var axios = require('axios')
      var data = fairDTO.createFromJson(JSON.parse(JSON.stringify(fairData)))
      console.log(data)
      var config = {
        method: 'put',
        url: 'fair/' + fairData.uuid,
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
    async deleteFair(state, uuid) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      var axios = require('axios')
      var config = {
        method: 'delete',
        url: 'fair/' + uuid,
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
    async getFair(state, uuid) {
      // CHECK IF USER LOGGED IN ALREADY

      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY -----------IMPORTANT
      var axios = require('axios')
      var config = {
        method: 'get',
        url: 'fair/' + uuid,
        headers: {
          'Content-Type': 'application/json',
        },
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
  },
  getters: {},
}
