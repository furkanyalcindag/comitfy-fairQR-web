import FairParticipantDTO from '@/models/fairParticipantDTO'
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async getParticipantsByFair(state, { page = {}, fairUUID = null }) {
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
    },
    /* eslint-disable */
    async addParticipantToFair(state, { participant = null, fairUUID = null }) {
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
    },
    async deleteParticipant(state, { participantUUID = null }) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY ----------IMPORTANT
      var axios = require('axios')
      var config = {
        method: 'delete',
        url: 'fair-participant/' + participantUUID,
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
    async updateParticipant(state, { participantData = null }) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY --------IMPORTANT
      var axios = require('axios')
      var data = FairParticipantDTO.createFromJson(
        JSON.parse(JSON.stringify(participantData)),
      )
      console.log(data)
      var config = {
        method: 'put',
        url: 'fair-participant/' + data.uuid,
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
    async addParticipantToCurrentActiveFair(state, { participantData = null }) {
      // ROLE CHECK IS NEEDED HERE DUE BY SECURITY --------------IMPORTANT
      var axios = require('axios')
      var data = FairParticipantDTO.createFromJson(
        JSON.parse(JSON.stringify(participantData)),
      )
      var config = {
        method: 'post',
        url: '/fair-participant/add-participant-by-fair',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      }
      const response = await axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data.firstName))
          return true
        })
        .catch(function (error) {
          console.log(error)
          return false
        })
      return response
    },
    async getParticipantPDF({ participantUUID }) {
      var axios = require('axios')
      var config = {
        method: 'get',
        url:
          'fair-participant/generate-ticket/' +
          '9adc7311-7658-43e8-89d8-2c75a01c1a08',
        headers: {},
        responseType: 'arraybuffer',
      }

      const response = await axios(config)
        .then(function (response) {
          const url = window.URL.createObjectURL(
            new Blob([response.data], { type: 'application/pdf' }),
          )
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', 'report.pdf')
          document.body.appendChild(link)
          link.click()
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
