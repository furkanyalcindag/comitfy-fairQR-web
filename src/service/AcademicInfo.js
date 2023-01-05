import router from '@/router'
import store from '@/store/'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getAcademicInfoByDoctor(state, pageAndData) {
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
            'academicInfo/doctor/user-api/' +
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
    async updateAcademicInfo(state, newAcademicInfoData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')
        var data = JSON.stringify({
          schoolName: newAcademicInfoData.schoolName,
          profession: newAcademicInfoData.profession,
          startYear: newAcademicInfoData.startYear,
          graduateYear: newAcademicInfoData.graduateYear,
        })

        var config = {
          method: 'put',
          url: 'academicInfo/user-api/' + newAcademicInfoData.uuid,
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
    async addAcademicInfo(state, academicInfoData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')
        var data = JSON.stringify(academicInfoData)
        var config = {
          method: 'post',
          url: 'academicInfo/doctor-api',
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
    async deleteAcademicInfo(state, uuid) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')

        var config = {
          method: 'delete',
          url: 'academicInfo/' + uuid,
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
