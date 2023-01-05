import router from '@/router'
import store from '@/store/'

export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getDoctor() {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')
        var config = {
          method: 'get',
          url: 'doctor/user-api/',
          headers: {},
        }
        const response = await axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data))
            return response.data
          })
          .catch(function (error) {
            console.log(error)
            return null
          })
        return response
      } else {
        router.push({ name: 'Login Admin' })
      }
    },
    async updateDoctorProfilePicture(state, doctorData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        var axios = require('axios')
        var data = await JSON.parse(
          JSON.stringify({
            profileImage: doctorData.profileImage,
          }),
        )
        var config = {
          method: 'put',
          url: 'doctor/profile-image-update',
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
        router.push({ name: 'Login Admin' })
      }
    },
    async updateDoctorTitle(state, doctorData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        var axios = require('axios')
        var data = await JSON.parse(
          JSON.stringify({
            title: doctorData,
          }),
        )
        var config = {
          method: 'put',
          url: 'doctor/title-update/',
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
        router.push({ name: 'Login Admin' })
      }
    },
    async updateDoctorPhone(state, doctorData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        var axios = require('axios')
        console.log(doctorData)
        var data = await JSON.parse(
          JSON.stringify({
            phone: doctorData,
          }),
        )
        var config = {
          method: 'put',
          url: 'doctor/phone-update/',
          headers: { 'Content-Type': 'application/json' },
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
    async updateDoctorAddress(state, doctorData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        var axios = require('axios')
        var data = await JSON.parse(
          JSON.stringify({
            address: doctorData,
          }),
        )
        var config = {
          method: 'put',
          url: 'doctor/address-update/',
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
        router.push({ name: 'Login Admin' })
      }
    },
    async updateDoctorDiplomaNo(state, doctorData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        var axios = require('axios')
        var data = await JSON.parse(
          JSON.stringify({
            diplomaNo: doctorData,
          }),
        )
        var config = {
          method: 'put',
          url: 'doctor/diploma-no-update/',
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
        router.push({ name: 'Login Admin' })
      }
    },
    async updateDoctorClinicName(state, doctorData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        var axios = require('axios')
        var data = await JSON.parse(
          JSON.stringify({
            clinicName: doctorData,
          }),
        )
        var config = {
          method: 'put',
          url: 'doctor/clinic-name-update/',
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
        router.push({ name: 'Login Admin' })
      }
    },
    async updateDoctorBranch(state, doctorData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        var axios = require('axios')
        var data = await JSON.parse(
          JSON.stringify({
            branch: doctorData,
          }),
        )
        var config = {
          method: 'put',
          url: 'doctor/branch-update/',
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
        router.push({ name: 'Login Admin' })
      }
    },

    async updateDoctorAbout(state, doctorData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        var axios = require('axios')
        var data = await JSON.parse(
          JSON.stringify({
            about: doctorData,
          }),
        )
        var config = {
          method: 'put',
          url: 'doctor/about-update/',
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
        router.push({ name: 'Login Admin' })
      }
    },
  },
  getters: {},
}
