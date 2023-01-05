import fairDTO from '@/models/fairDTO'
import FairParticipantDTO from '@/models/fairParticipantDTO'
import router from '@/router'
import store from '@/store/'
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getParticipantsByFair(state, { page = {}, fairUUID = null }) {
      // CHECK IF USER LOGGED IN ALREADY
      if (store.getters['auth/checkIfLoggedIn']) {
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
          url: 'fair-participant/get-participants-by-fair/' + fairUUID,
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
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY -----------IMPORTANT
        router.push({ name: 'Login Admin' })
      }
    },
    /* eslint-disable */
    async addParticipantToFair(state, { participant = null, fairUUID = null }) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY --------------IMPORTANT
        var axios = require('axios')
        var data = FairParticipantDTO.createFromJson(
          JSON.parse(JSON.stringify(participant)),
        )
        var config = {
          method: 'post',
          url: 'fair-participant/add-participant-by-fair/' + fairUUID,
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
    async updateFair(state, fairData) {
      if (store.getters['auth/checkIfLoggedIn']) {
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
      } else {
        // ROLE CHECK IS NEEDED HERE
        router.push({ name: 'Login Admin' })
      }
    },
    async deleteFair(state, uuid) {
      if (store.getters['auth/checkIfLoggedIn']) {
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
      } else {
        // ROLE CHECK IS NEEDED HERE
        router.push({ name: 'Login Admin' })
      }
    },
    async getFair(state, uuid) {
      // CHECK IF USER LOGGED IN ALREADY
      if (store.getters['auth/checkIfLoggedIn']) {
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
      } else {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY -----------IMPORTANT
        router.push({ name: 'Login Admin' })
      }
    },
  },
  getters: {},
}
