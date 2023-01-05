import router from '@/router'
import store from '@/store/'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getNotification(state, page) {
      // CHECK IF USER LOGGED IN ALREADY
      if (store.getters['auth/checkIfLoggedIn']) {
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
          url: 'notification/get-all-by-filter',
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
    async updateNotification(state, newNotificationData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')
        var data = JSON.stringify({
          language: 'TR',
          title: newNotificationData.title,
          message: newNotificationData.message,
          link: newNotificationData.link,
          base64: newNotificationData.base64,
          send: newNotificationData.send,
        })

        var config = {
          method: 'put',
          url: 'notification/user-api/' + newNotificationData.uuid,
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
      } else {
        // ROLE CHECK IS NEEDED HERE
        router.push({ name: 'Login Admin' })
      }
    },
    async addNotification(state, notificationData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')
        var data = JSON.stringify(notificationData)
        var config = {
          method: 'post',
          url: 'notification/user-api',
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
      } else {
        // ROLE CHECK IS NEEDED HERE
        router.push({ name: 'Login Admin' })
      }
    },
    async deleteNotification(state, uuid) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')

        var config = {
          method: 'delete',
          url: 'notification/' + uuid,
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
      } else {
        // ROLE CHECK IS NEEDED HERE
        router.push({ name: 'Login Admin' })
      }
    },
  },
  getters: {},
}
