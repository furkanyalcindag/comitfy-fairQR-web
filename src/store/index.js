import { createStore } from 'vuex'
import auth from '@/service/auth'
import role from '@/service/role'

import user from '@/service/user'

import settings from '@/service/Settings'
import fair from '@/service/fair'
import fairParticipant from '@/service/fairParticipant'

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
    user,
    settings,
    fair,
    fairParticipant,
  },
})
