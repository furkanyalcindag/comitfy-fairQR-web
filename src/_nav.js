export default [
  {
    component: 'CNavTitle',
    name: 'Management',
  },
  {
    component: 'CNavGroup',
    name: 'Fair',
    to: '/fair/list',
    icon: 'cil-puzzle',
    items: [
      {
        component: 'CNavItem',
        name: 'FairClientList',
        to: '/fair/client-list/:id',
      },
      {
        component: 'CNavItem',
        name: 'FairList',
        to: '/fair/list',
      },
    ],
  },
  /*{
    component: 'CNavTitle',
    name: 'Extras',
  },
  {
    component: 'CNavGroup',
    name: 'Pages',
    to: '/pages',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavItem',
        name: 'Login',
        to: '/pages/login',
      },
      {
        component: 'CNavItem',
        name: 'Register',
        to: '/pages/register',
      },
      {
        component: 'CNavItem',
        name: 'Error 404',
        to: '/pages/404',
      },
      {
        component: 'CNavItem',
        name: 'Error 500',
        to: '/pages/500',
      },
    ],
  }, */
]
