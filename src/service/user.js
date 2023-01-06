export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async addUserByRole(state, roleData) {
      //debugger

      var axios = require('axios')
      var data = JSON.stringify(roleData)

      var config = {
        method: 'post',
        // url: `user-api/${userData.uuid}`,
        url: 'user-api/' + roleData.uuid,
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
    async getUserByRole(state, pageAndData) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      //    debugger
      var axios = require('axios')
      console.log(pageAndData.pageOptions)
      let pageNumber = pageAndData.pageOptions.page - 1
      console.log(pageNumber)
      var data = await JSON.parse(
        JSON.stringify({
          filters: [],
          pageNumber: pageAndData.pageOptions.page - 1,
          pageSize: pageAndData.pageOptions.rowsPerPage,
        }),
      )
      console.log(data)
      var config = {
        method: 'get',
        url:
          'user-api/get-all-by-role/' +
          pageAndData.roleData.uuid +
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
    },
    async deleteUser(state, uuid) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      var axios = require('axios')
      var config = {
        method: 'delete',
        // url: 'user-api/user-api/' + uuid,
        url: 'user-api/' + uuid,
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
    async getUsers(state, page) {
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
        url: 'user-api/get-all-by-filter',
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
    async updateUser(state, userData) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      var axios = require('axios')
      var data = await JSON.parse(
        JSON.stringify({
          language: userData.language,
          userName: userData.userName,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          ageRangeEnum: userData.ageRangeEnum,
          genderEnum: userData.genderEnum,
        }),
      )
      var config = {
        method: 'put',
        url: 'user-api/' + userData.uuid,
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
    async addUser(state, userData) {
      var axios = require('axios')
      var data = JSON.stringify(userData)
      var config = {
        method: 'post',
        url: 'user-api/',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
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
    async updateUserName(state, userData) {
      var axios = require('axios')
      var data = await JSON.parse(
        JSON.stringify({
          firstName: userData.firstName,
          lastName: userData.lastName,
        }),
      )
      var config = {
        method: 'put',
        url: 'user-profile/name-update',
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
    async getUserByChatRoom(state, pageAndData) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      //    debugger
      var axios = require('axios')
      console.log(pageAndData.pageOptions)
      let pageNumber = pageAndData.pageOptions.page - 1
      console.log(pageNumber)
      var data = await JSON.parse(
        JSON.stringify({
          filters: [],
          pageNumber: pageAndData.pageOptions.page - 1,
          pageSize: pageAndData.pageOptions.rowsPerPage,
        }),
      )
      console.log(data)
      var config = {
        method: 'get',
        url:
          'user-api/get-users-by-chat-room/' +
          pageAndData.chatRoomData.uuid +
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
    },
    async getApprovedUserByChatRoom(state, pageAndData) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      //    debugger
      var axios = require('axios')
      console.log(pageAndData.pageOptions)
      let pageNumber = pageAndData.pageOptions.page - 1
      console.log(pageNumber)
      var data = await JSON.parse(
        JSON.stringify({
          filters: [],
          pageNumber: pageAndData.pageOptions.page - 1,
          pageSize: pageAndData.pageOptions.rowsPerPage,
        }),
      )
      console.log(data)
      var config = {
        method: 'get',
        url:
          'user-api/get-approved-users-by-chat-room/' +
          pageAndData.chatRoomData.uuid +
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
    },
    async getNonApprovedUserByChatRoom(state, pageAndData) {
      // debugger

      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
      //    debugger
      var axios = require('axios')
      console.log(pageAndData.pageOptions)
      let pageNumber = pageAndData.pageOptions.page - 1
      console.log(pageNumber)
      var data = await JSON.parse(
        JSON.stringify({
          filters: [],
          pageNumber: pageAndData.pageOptions.page - 1,
          pageSize: pageAndData.pageOptions.rowsPerPage,
        }),
      )
      console.log(data)
      var config = {
        method: 'get',
        url:
          'user-api/get-non-approved-users-by-chat-room/' +
          pageAndData.chatRoomData.uuid +
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
    },
  },
  getters: {},
}
