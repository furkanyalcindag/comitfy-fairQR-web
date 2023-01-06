export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getSettings(state, page) {
      // CHECK IF USER LOGGED IN ALREADY

      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      var axios = require('axios')
      var data = JSON.stringify({
        filters: [],
        pageNumber: page.page - 1,
        pageSize: page.rowsPerPage,
        language: page.language,
      })
      var config = {
        method: 'post',
        url: 'settings/get-all-by-filter',
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
    async updateSettings(state, newSettingsData) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      var axios = require('axios')
      var data = JSON.stringify({
        language: 'TR',
        key: newSettingsData.key,
        value: newSettingsData.value,
        current: newSettingsData.current,
      })

      var config = {
        method: 'put',
        url: 'settings/user-api/' + newSettingsData.uuid,
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
    async addSettings(state, settingsData) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      var axios = require('axios')
      var data = JSON.stringify(settingsData)
      var config = {
        method: 'post',
        url: 'settings/user-api',
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
    async deleteSettings(state, uuid) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      var axios = require('axios')

      var config = {
        method: 'delete',
        url: 'settings/' + uuid,
        headers: {},
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
  },
  getters: {},
}
