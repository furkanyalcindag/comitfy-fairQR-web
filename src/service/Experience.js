import router from '@/router'
import store from '@/store/'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getExperienceByDoctor(state, pageAndData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        var axios = require('axios')

        let pageNumber = pageAndData.page - 1
        console.log(pageNumber)
        var data = await JSON.parse(
          JSON.stringify({
            filters: [],
            pageNumber: pageAndData.page - 1,
            pageSize: pageAndData.rowsPerPage,
          }),
        )
        console.log(data)
        var config = {
          method: 'get',
          url:
            'experience/doctor/user-api/' +
            '?pageNumber=' +
            data.pageNumber +
            '&pageSize=' +
            data.pageSize,

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
    async updateExperience(state, newExperienceData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')
        var data = JSON.stringify({
          title: newExperienceData.title,
          workedPlace: newExperienceData.workedPlace,
          description: newExperienceData.description,
          startDate: newExperienceData.startDate,
          endDate: newExperienceData.endDate,
        })

        var config = {
          method: 'put',
          url: 'experience/user-api/' + newExperienceData.uuid,
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
    async addExperience(state, experienceData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')
        var data = JSON.stringify(experienceData)
        var config = {
          method: 'post',
          url: 'experience/doctor-api',
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
    async deleteExperience(state, uuid) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')

        var config = {
          method: 'delete',
          url: 'experience/' + uuid,
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
