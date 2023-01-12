import { createStore } from 'vuex'
import auth from '@/service/auth'
import fair from '@/service/fair'
import fairParticipant from '@/service/fairParticipant'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    toasts: [],
    isLoggedIn: false,
    // Disables the route to login when u put the page name here when checking the token
    disabledLoginRoutePageNames: [
      'Login Admin',
      'Register Participant Admin',
      'Register Participant',
    ],
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
    downloadPDF(state, { data = null, pdfName = null }) {
      const url = window.URL.createObjectURL(
        new Blob([data], { type: 'application/pdf' }),
      )
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', pdfName ? pdfName + '.pdf' : 'report.pdf')
      document.body.appendChild(link)
      link.click()
    },
  },
  modules: {
    auth,
    fair,
    fairParticipant,
  },
})
