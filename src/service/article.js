/* eslint-disable */
import router from '@/router'
import store from '@/store/'
import createArticleDTO from '@/models/create_ARTICLE_dto'
import axios from "axios";
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    async addArticle(state, articleData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        articleData.description = articleData.description.substring(
          3,
          articleData.description.length - 4,
        )
        var axios = require('axios')
        var data = JSON.parse(JSON.stringify(articleData))
        //debugger
        var config = {
          method: 'post',
          url: 'article/user-api',
          headers: {
            'Content-Type': 'application/json',
          },
          data: data,
        }

        const response = await axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data.title))
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
    async getArticles(state, pageAndSearchValue) {
      // CHECK IF USER LOGGED IN ALREADY
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')
        let filterBy = pageAndSearchValue.filter
          ? pageAndSearchValue.filter
          : []

        var data = JSON.stringify({
          filters: filterBy,
          pageNumber: pageAndSearchValue.pageOptions.page - 1,
          pageSize: pageAndSearchValue.pageOptions.rowsPerPage,
        })

        var config = {
          method: 'post',
          url: 'article/get-all-by-filter',
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
    async deleteArticle(state, uuid) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        var axios = require('axios')

        var config = {
          method: 'delete',
          url: 'article/' + uuid,
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
    async updateArticle(state, articleData) {
      if (store.getters['auth/checkIfLoggedIn']) {
        // console.log(articleData)
        // ROLE CHECK IS NEEDED HERE DUE BY SECURITY
        /* articleData.tagList =
          articleData.tagListForArticle && articleData.tagListForArticle.length > 0
            ? articleData.tagListForArticle
            : [] */
        // filter the tags DTO CAN BE USED INSTEAD -------------IMPORTANT
        articleData.tagList = articleData.tagList.map((tag) => {
          return tag.uuid
        })

        /* articleData.categoryList =
          articleData.categoryListForArticle &&
          articleData.categoryListForArticle.length > 0
            ? articleData.categoryListForArticle
            : [] */
        // filter the categories DTO CAN BE USED INSTEAD -------------IMPORTANT
        articleData.categoryList = articleData.categoryList.map((category) => {
          return category.uuid
        })
        
        delete articleData.tagListForArticle
        delete articleData.categoryListForArticle

        let updatedArticle = new createArticleDTO(
          articleData.title,
          articleData.language,
          articleData.description,
          articleData.publishedDate,
          articleData.tagList,
          articleData.categoryList,
        )

        var axios = require('axios')
        var data = JSON.stringify(updatedArticle)

        var config = {
          method: 'put',
          url: 'article/' + articleData.uuid,
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
    async getArticleByDoctor(state, pageAndData) {
      if (store.getters['auth/checkIfLoggedIn']) {
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
            'article/user-api/' +
       //     pageAndData.doctorData.uuid +
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
  },
  getters: {},
}
