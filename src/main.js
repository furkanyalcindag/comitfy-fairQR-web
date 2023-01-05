import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsCallout from '@/components/DocsCallout'
import DocsExample from '@/components/DocsExample'
import '@/interceptor/axios'
import { LightEditor, LightEditorPlugin } from '@hannanmiah/light-editor'
import '@hannanmiah/light-editor/dist/style.css'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(LightEditorPlugin)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsCallout', DocsCallout)
app.component('DocsExample', DocsExample)
app.component('EasyDataTable', Vue3EasyDataTable)
app.component(LightEditor)
app.component('v-select', vSelect)
app.component('VueCtkDateTimePicker', VueCtkDateTimePicker)

// CHECK IF USER LOGGED IN ALREADY
if (store.getters['auth/checkIfLoggedIn']) {
  // ROLE CHECK IS NEEDED HERE
  // router.push({ name: 'Home' })
} else {
  // ROLE CHECK IS NEEDED HERE
  router.push({ name: 'Login Admin' })
}

app.mount('#app')
