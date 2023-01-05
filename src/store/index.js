import { createStore } from 'vuex'
import auth from '@/service/auth'
import role from '@/service/role'
import category from '@/service/category'
import language from '@/service/language'
import comment from '@/service/comment'
import contract from '@/service/contract'

import article from '@/service/article'
import user from '@/service/user'

import doctor from '@/service/Doctor'
import academicInfo from '@/service/AcademicInfo'
import certificate from '@/service/Certificate'
import experience from '@/service/Experience'
import settings from '@/service/Settings'
import notification from '@/service/Notification'
import tag from '@/service/Tag'
import chatRoom from '@/service/ChatRoom'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    toasts: [],
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
    updateToasts(state, toast) {
      state.toasts.push({
        content: toast.content,
        color: toast.color,
        autohide: toast.isautoHided,
        classes: toast.classes,
        delay: toast.delay,
      })
    },
  },
  actions: {
    createToast({ commit }, toast) {
      commit('updateToasts', toast)
    },
    invokeSendButtonDelay() {
      return new Promise((resolve) => setTimeout(resolve, 2000)) // wait 2 sec
    },
  },
  modules: {
    auth,
    role,
    category,
    language,
    article,
    user,
    comment,
    contract,
    doctor,
    academicInfo,
    certificate,
    experience,
    settings,
    notification,
    tag,
    chatRoom,
  },
})
