import router from '@/router'
import store from '@/store/'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getCertificateByDoctor(state, pageAndData) {
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
            'certificate/doctor/user-api/' +
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
    async updateCertificate(state, newCertificateData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')
        var data = JSON.stringify({
          name: newCertificateData.name,
          certificateNo: newCertificateData.certificateNo,
          takenFrom: newCertificateData.takenFrom,
          takenDate: newCertificateData.takenDate,
        })
        console.log(data)
        var config = {
          method: 'put',
          url: 'certificate/user-api/' + newCertificateData.uuid,
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
    async addCertificate(state, certificateData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')
        var data = JSON.stringify(certificateData)
        var config = {
          method: 'post',
          url: 'certificate/doctor-api',
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
    async deleteCertificate(state, uuid) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')

        var config = {
          method: 'delete',
          url: 'certificate/' + uuid,
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
