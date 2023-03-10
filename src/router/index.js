import { h, resolveComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/fair/list',
    children: [
      {
        path: '/fair',
        name: 'Fair',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/fair/list',
        children: [
          {
            path: '/fair/client-list/:uuid',
            name: 'FairClientList',
            component: () =>
              import('@/views/fairParticipant/ListSpecificFairClients.vue'),
            props: true,
          },
          {
            path: '/fair/list',
            name: 'FairList',
            component: () => import('@/views/fair/ListFair.vue'),
          },
        ],
      },
    ],
  },
  // Full size pages(Without navbar or other things. Just page itself)
  // decide deletion --------------IMPORTANT
  {
    path: '/pages',
    name: 'Pages',
    redirect: '/pages/404',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
    ],
  },
  {
    path: '/admin',
    name: 'Login Admin',
    redirect: '/admin/login-admin',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '/admin/login-admin',
        name: 'Login Admin',
        component: () => import('@/views/fair/LoginAdmin.vue'),
      },
      {
        path: '/admin/register-participant',
        name: 'Register Participant Admin',
        component: () =>
          import('@/views/fairParticipant/RegisterParticipant.vue'),
      },
      /* {
            path: 'login-doctor',
            name: 'Login Doctor',
            component: () => import('@/views/doctor/LoginDoctor.vue'),
          },
          {
            path: 'register-doctor',
            name: 'Register Doctor',
            component: () => import('@/views/doctor/RegisterDoctor.vue'),
          }, */
    ],
  },
  {
    path: '/participant',
    name: 'Register Participant',
    redirect: '/participant/register',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    children: [
      {
        path: '/participant/register',
        name: 'Register Participant',
        component: () =>
          import('@/views/fairParticipant/RegisterParticipant.vue'),
      },
    ],
  },
  {
    path: '/404',
    name: 'Notfound404',
    component: () => import('@/views/pages/Page404'),
  },
  {
    path: '/:catchAll(.*)',
    name: 'Notfound',
    redirect: '/404',
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

export default router
