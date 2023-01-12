/* eslint-disable */
import FairParticipantDTO from '@/models/fairParticipantDTO'
import store from '@/store/index'
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
        url: 'fair-participant/add-participant-by-active-fair',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
        responseType: 'arraybuffer',
      }
      // It returns the pdf
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
    async getParticipantPDF(state, { participant = null, fair = null }) {
      var axios = require('axios')
      var config = {
        method: 'get',
        // The uuid must be participant ------------IMPORTANT
        url: 'fair-participant/generate-ticket/' + participant.uuid,
        headers: {'content-type': 'application/pdf'},
        responseType: 'arraybuffer',
      }

      const response = await axios(config)
        .then(function (response) {
          store.dispatch('downloadPDF', {
            data: response.data,
            pdfName: fair.name + '_' + participant.email + '_bilet',
          })
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
