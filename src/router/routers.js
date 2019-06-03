import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [{
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [{
      path: '/home',
      name: 'home',
      meta: {
        hideInMenu: true,
        title: '首页',
        notCache: true,
        icon: 'md-home'
      },
      component: () => import('@/view/single-page/home')
    }]
  },
  {
    path: '/userManage',
    name: 'usermanage',
    meta: {
      icon: 'md-person',
      title: '用户管理'
    },
    component: Main,
    children: [{
        path: 'users',
        name: 'usermanage-users',
        meta: {
          icon: 'md-construct',
          title: '用户管理'
        },
        component: parentView,
        children: [{
            path: 'index',
            name: 'usermanage-users-index',
            meta: {
              icon: 'md-person',
              title: '用户管理'
            },
            component: () => import('@/view/user-manage/users/index.vue')
          }
        ]
      },
      {
        path: 'walletLogs/:user_id',
        name: 'usermanage-walletLogs',
        meta: {
          hideInMenu: true,
          icon: 'md-cash',
          title: '钱包日志'
        },
        component: () => import('@/view/user-manage/wallet-logs/index.vue'),
      },
      {
        path: 'walletApplys',
        name: 'usermanage-walletapplys',
        meta: {
          icon: 'md-cash',
          title: '提现申请'
        },
        component: parentView,
        children: [{
            path: 'index',
            name: 'usermanage-walletapplys-index',
            meta: {
              icon: 'md-cash',
              title: '提现申请'
            },
            component: () => import('@/view/user-manage/wallet-applys/index.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/salesmanManage',
    name: 'salesmanmanage',
    meta: {
      icon: 'md-person',
      title: '业务员管理'
    },
    component: Main,
    children: [{
        path: 'salesmans/index',
        name: 'salesmanmanage-salesmans-index',
        meta: {
          icon: 'md-person',
          title: '业务员管理'
        },
        component: () => import('@/view/salesman-manage/salesmans/index.vue')
      },
      {
        path: 'salesmans/add',
        name: 'salesmanmanage-salesmans-add',
        meta: {
          icon: 'md-person',
          title: '业务员添加'
        },
        component: () => import('@/view/salesman-manage/salesmans/add-edit.vue')
      },
      {
        path: 'salesmans/edit/:id',
        name: 'salesmanmanage-salesmans-edit',
        meta: {
          hideInMenu: true,
          icon: 'md-person',
          title: '业务员编辑'
        },
        component: () => import('@/view/salesman-manage/salesmans/add-edit.vue')
      },
      {
        path: 'salesmans/resetPassword/:id',
        name: 'salesmanmanage-salesmans-resetpassword',
        meta: {
          hideInMenu: true,
          icon: 'md-person',
          title: '重置密码'
        },
        component: () => import('@/view/salesman-manage/salesmans/reset-password.vue')
      }
    ]
  },
  {
    path: '/recoverManage',
    name: 'recovermanage',
    meta: {
      icon: 'md-construct',
      title: '回收管理'
    },
    component: Main,
    children: [{
        path: 'recovers',
        name: 'recovermanage-recovers',
        meta: {
          icon: 'md-construct',
          title: '类目内容管理'
        },
        component: parentView,
        children: [{
            path: 'index',
            name: 'recovermanage-recovers-index',
            meta: {
              icon: 'md-construct',
              title: '类目内容管理',
            },
            component: () => import('@/view/recover-manage/recovers/index.vue')
          },
          {
            path: 'add',
            name: 'recovermanage-recovers-add',
            meta: {
              hideInMenu: true,
              icon: 'md-add',
              title: '类目内容添加',
            },
            component: () => import('@/view/recover-manage/recovers/add-edit.vue')
          },
          {
            path: 'edit/:id',
            name: 'recovermanage-recovers-edit',
            meta: {
              hideInMenu: true,
              icon: 'md-brush',
              title: '类目内容编辑',
            },
            component: () => import('@/view/recover-manage/recovers/add-edit.vue')
          },
        ]
      },
      {
        path: 'recoverCats',
        name: 'recovermanage-recovercats',
        meta: {
          icon: 'md-document',
          title: '类目管理'
        },
        component: parentView,
        children: [{
            path: 'index',
            name: 'recovermanage-recovercats-index',
            meta: {
              icon: 'md-document',
              title: '类目管理',
            },
            component: () => import('@/view/recover-manage/recovercats/index.vue')
          },
          {
            path: 'add',
            name: 'recovermanage-recovercats-add',
            meta: {
              hideInMenu: true,
              icon: 'md-add',
              title: '类目添加',
            },
            component: () => import('@/view/recover-manage/recovercats/add-edit.vue')
          },
          {
            path: 'edit/:id',
            name: 'recovermanage-recovercats-edit',
            meta: {
              hideInMenu: true,
              icon: 'md-brush',
              title: '类目编辑',
            },
            component: () => import('@/view/recover-manage/recovercats/add-edit.vue')
          },
        ]
      }
    ]
  },
  {
    path: '/orderManage',
    name: 'ordermanage',
    meta: {
      icon: 'md-albums',
      title: '订单管理'
    },
    component: Main,
    children: [{
        path: 'orders/index',
        name: 'ordermanage-orders-index',
        meta: {
          icon: 'md-albums',
          title: '订单管理'
        },
        component: () => import('@/view/order-manage/orders/index.vue'),
      },
      // {
      //   path: 'show/:id',
      //   name: 'ordermanage-orders-show',
      //   meta: {
      //     hideInMenu: true,
      //     icon: 'md-document',
      //     title: '订单详情',
      //   },
      //   component: () => import('@/view/order-manage/orders/show.vue')
      // }
    ]
  },
  {
    path: '/feedbackManage',
    name: 'feedbackmanage',
    meta: {
      icon: 'md-chatboxes',
      title: '意见反馈'
    },
    component: Main,
    children: [{
        path: 'feedbacks/index',
        name: 'feedbackmanage-feedbacks-index',
        meta: {
          icon: 'md-chatboxes',
          title: '意见反馈'
        },
        component: () => import('@/view/feedback-manage/feedbacks/index.vue'),
      }
    ]
  },
  {
    path: '/articleManage',
    name: 'articlemanage',
    meta: {
      icon: 'md-document',
      title: '文章管理'
    },
    component: Main,
    children: [{
        path: 'articles',
        name: 'articlemanage-articles',
        meta: {
          icon: 'md-document',
          title: '文章管理'
        },
        component: parentView,
        children: [{
            path: 'index',
            name: 'articlemanage-articles-index',
            meta: {
              icon: 'md-document',
              title: '文章管理',
            },
            component: () => import('@/view/article-manage/articles/index.vue')
          },
          {
            path: 'add',
            name: 'articlemanage-articles-add',
            meta: {
              hideInMenu: true,
              icon: 'md-add',
              title: '文章添加',
            },
            component: () => import('@/view/article-manage/articles/add-edit.vue')
          },
          {
            path: 'edit/:id',
            name: 'articlemanage-articles-edit',
            meta: {
              hideInMenu: true,
              icon: 'md-brush',
              title: '文章编辑',
            },
            component: () => import('@/view/article-manage/articles/add-edit.vue')
          },
        ]
      },
      {
        path: 'articleCats',
        name: 'articlemanage-articlecats',
        meta: {
          icon: 'md-browsers',
          title: '分类管理'
        },
        component: parentView,
        children: [{
            path: 'index',
            name: 'articlemanage-articlecats-index',
            meta: {
              icon: 'md-browsers',
              title: '分类管理',
            },
            component: () => import('@/view/article-manage/articlecats/index.vue')
          },
          {
            path: 'add',
            name: 'articlemanage-articlecats-add',
            meta: {
              hideInMenu: true,
              icon: 'md-add',
              title: '分类添加',
            },
            component: () => import('@/view/article-manage/articlecats/add-edit.vue')
          },
          {
            path: 'edit/:id',
            name: 'articlemanage-articlecats-edit',
            meta: {
              hideInMenu: true,
              icon: 'md-brush',
              title: '分类编辑',
            },
            component: () => import('@/view/article-manage/articlecats/add-edit.vue')
          },
        ]
      }
    ]
  },
  {
    path: '/adManage',
    name: 'admanage',
    meta: {
      icon: 'md-basket',
      title: '广告管理'
    },
    component: Main,
    children: [{
        path: 'ads',
        name: 'admanage-ads',
        meta: {
          icon: 'md-basket',
          title: '广告管理'
        },
        component: parentView,
        children: [{
            path: 'index',
            name: 'admanage-ads-index',
            meta: {
              icon: 'md-basket',
              title: '广告管理',
            },
            component: () => import('@/view/ad-manage/ads/index.vue')
          },
          {
            path: 'add',
            name: 'admanage-ads-add',
            meta: {
              hideInMenu: true,
              icon: 'md-add',
              title: '广告添加',
            },
            component: () => import('@/view/ad-manage/ads/add-edit.vue')
          },
          {
            path: 'edit/:id',
            name: 'admanage-ads-edit',
            meta: {
              hideInMenu: true,
              icon: 'md-brush',
              title: '广告编辑',
            },
            component: () => import('@/view/ad-manage/ads/add-edit.vue')
          },
        ]
      },
      {
        path: 'adPositions',
        name: 'admanage-adpositions',
        meta: {
          icon: 'md-basket',
          title: '广告位管理'
        },
        component: parentView,
        children: [{
            path: 'index',
            name: 'admanage-adpositions-index',
            meta: {
              icon: 'md-basket',
              title: '广告位管理',
            },
            component: () => import('@/view/ad-manage/adpositions/index.vue')
          },
          {
            path: 'add',
            name: 'admanage-adpositions-add',
            meta: {
              hideInMenu: true,
              icon: 'md-add',
              title: '广告位添加',
            },
            component: () => import('@/view/ad-manage/adpositions/add-edit.vue')
          },
          {
            path: 'edit/:id',
            name: 'admanage-adpositions-edit',
            meta: {
              hideInMenu: true,
              icon: 'md-brush',
              title: '广告位编辑',
            },
            component: () => import('@/view/ad-manage/adpositions/add-edit.vue')
          },
        ]
      }
    ]
  },
  {
    path: '/settingManage',
    name: 'settingmanage',
    meta: {
      icon: 'md-settings',
      title: '设置管理'
    },
    component: Main,
    children: [{
        path: 'settings',
        name: 'settingmanage-settings',
        meta: {
          icon: 'md-settings',
          title: '设置管理'
        },
        component: () => import('@/view/setting-manage/settings/index.vue')
      }
    ]
  },
  {
    path: '/adminManage',
    name: 'adminmanage',
    meta: {
      icon: 'md-cog',
      title: '管理设置'
    },
    component: Main,
    children: [{
        path: 'admins',
        name: 'adminmanage-admins',
        meta: {
          icon: 'md-person',
          title: '管理员管理'
        },
        component: parentView,
        children: [{
            path: 'index',
            name: 'adminmanage-admins-index',
            meta: {
              icon: 'md-person',
              title: '管理员管理',
              // access: ['admins_view']
            },
            component: () => import('@/view/admin-manage/admins/index.vue')
          },
          {
            path: 'add',
            name: 'adminmanage-admins-add',
            meta: {
              hideInMenu: true,
              icon: 'md-person-add',
              title: '管理员添加',
              // access: ['admins_edit']
            },
            component: () => import('@/view/admin-manage/admins/add-edit.vue')
          },
          {
            path: 'edit/:id',
            name: 'adminmanage-admins-edit',
            meta: {
              hideInMenu: true,
              icon: 'md-person-add',
              title: '管理员编辑',
              // access: ['admins_edit']
            },
            component: () => import('@/view/admin-manage/admins/add-edit.vue')
          },
          {
            path: 'resetPassword/:id',
            name: 'adminmanage-admins-resetpassword',
            meta: {
              hideInMenu: true,
              icon: 'ios-build',
              title: '管理员重置密码',
              // access: ['admins_edit']
            },
            component: () => import('@/view/admin-manage/admins/reset-password.vue')
          },
          // {
          //   path: 'setRole/:id',
          //   name: 'adminmanage-admins-setrole',
          //   meta: {
          //     hideInMenu: true,
          //     icon: 'ios-build',
          //     title: '设置角色',
          //     // access: ['admins_roles']
          //   },
          //   component: () => import('@/view/admin-manage/admins/set-role.vue')
          // },
        ]
      },
      // {
      //   path: 'roles',
      //   name: 'adminmanage-roles',
      //   meta: {
      //     icon: 'md-person',
      //     title: '角色管理'
      //   },
      //   component: parentView,
      //   children: [{
      //       path: 'index',
      //       name: 'adminmanage-roles-index',
      //       meta: {
      //         icon: 'md-person',
      //         title: '角色管理',
      //         // access: ['roles_view']
      //       },
      //       component: () => import('@/view/admin-manage/roles/index.vue')
      //     },
      //     {
      //       path: 'add',
      //       name: 'adminmanage-roles-add',
      //       meta: {
      //         hideInMenu: true,
      //         icon: 'md-person-add',
      //         title: '角色添加',
      //         // access: ['roles_edit']
      //       },
      //       component: () => import('@/view/admin-manage/roles/add-edit.vue')
      //     },
      //     {
      //       path: 'edit/:id',
      //       name: 'adminmanage-roles-edit',
      //       meta: {
      //         hideInMenu: true,
      //         icon: 'md-person-add',
      //         title: '角色编辑',
      //         // access: ['roles_edit']
      //       },
      //       component: () => import('@/view/admin-manage/roles/add-edit.vue')
      //     },
      //     {
      //       path: 'givePerm/:id',
      //       name: 'adminmanage-roles-giveperm',
      //       meta: {
      //         hideInMenu: true,
      //         icon: 'md-settings',
      //         title: '分配权限',
      //         // access: ['roles_permission']
      //       },
      //       component: () => import('@/view/admin-manage/roles/give-perm.vue')
      //     },
      //   ]
      // },
      // {
      //   path: 'permissions',
      //   name: 'adminmanage-permissions',
      //   meta: {
      //     icon: 'md-list-box',
      //     title: '权限管理'
      //   },
      //   component: parentView,
      //   children: [{
      //       path: 'index',
      //       name: 'adminmanage-permissions-index',
      //       meta: {
      //         icon: 'md-list-box',
      //         title: '权限管理',
      //         // access: ['permissions_oper']
      //       },
      //       component: () => import('@/view/admin-manage/permissions/index.vue')
      //     },
      //     {
      //       path: 'add',
      //       name: 'adminmanage-permissions-add',
      //       meta: {
      //         hideInMenu: true,
      //         icon: 'md-person-add',
      //         title: '权限添加',
      //         // access: ['permissions_oper']
      //       },
      //       component: () => import('@/view/admin-manage/permissions/add-edit.vue')
      //     },
      //     {
      //       path: 'edit/:id',
      //       name: 'adminmanage-permissions-edit',
      //       meta: {
      //         hideInMenu: true,
      //         icon: 'md-person-add',
      //         title: '权限编辑',
      //         // access: ['permissions_oper']
      //       },
      //       component: () => import('@/view/admin-manage/permissions/add-edit.vue')
      //     },
      //   ]
      // },
      {
        path: 'adminLogs',
        name: 'adminmanage-adminlogs',
        meta: {
          icon: 'md-list-box',
          title: '操作日志'
        },
        component: parentView,
        children: [{
          path: 'index',
          name: 'adminmanage-adminlogs-index',
          meta: {
            icon: 'md-list-box',
            title: '操作日志',
            // access: ['adminLogs_view']
          },
          component: () => import('@/view/admin-manage/admin-logs/index.vue')
        }, ]
      },
      {
        path: 'cronLogs',
        name: 'adminmanage-cronlogs',
        meta: {
          icon: 'md-list-box',
          title: '计划任务'
        },
        component: parentView,
        children: [{
          path: 'index',
          name: 'adminmanage-cronlogs-index',
          meta: {
            icon: 'md-list-box',
            title: '计划任务',
            // access: ['cronLogs_view']
          },
          component: () => import('@/view/admin-manage/cron-logs/index.vue')
        }, ]
      }
    ]
  },

  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
