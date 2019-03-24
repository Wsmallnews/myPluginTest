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

export default [
    {
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
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    hideInMenu: true,
                    title: '首页',
                    notCache: true,
                    icon: 'md-home'
                },
                component: () => import('@/view/single-page/home')
            }
        ]
    },
    {
        path: '/productManage',
        name: 'productmanage',
        meta: {
            icon: 'md-apps',
            title: '产品管理'
        },
        component: Main,
        children: [
            // {
            //     path: 'products',
            //     name: 'productmanage-products',
            //     meta: {
            //         icon: 'md-apps',
            //         title: '产品管理'
            //     },
            //     component: parentView,
            //     children: [
            //         {
            //             path: 'index',
            //             name: 'productmanage-products-index',
            //             meta: {
            //                 icon: 'md-apps',
            //                 title: '产品管理',
            //                 access: ['shopProducts_view']
            //             },
            //             component: () => import('@/view/product-manage/products/index.vue')
            //         },
            //         {
            //             path: 'add',
            //             name: 'productmanage-products-add',
            //             meta: {
            //                 hideInMenu: true,
            //                 icon: 'md-add',
            //                 title: '产品添加',
            //                 access: ['shopProducts_edit']
            //             },
            //             component: () => import('@/view/product-manage/products/add-edit.vue')
            //         },
            //         {
            //             path: 'edit/:id',
            //             name: 'productmanage-products-edit',
            //             meta: {
            //                 hideInMenu: true,
            //                 icon: 'md-brush',
            //                 title: '产品编辑',
            //                 access: ['shopProducts_edit']
            //             },
            //             component: () => import('@/view/product-manage/products/add-edit.vue')
            //         },
            //     ]
            // },
            // {
            //     path: 'trash',
            //     name: 'productmanage-trash',
            //     meta: {
            //         icon: 'md-trash',
            //         title: '回收站',
            //         access: ['shopProducts_view']
            //     },
            //     component: () => import('@/view/product-manage/products/index.vue')
            // },
            {
                path: 'categorys',
                name: 'productmanage-categorys',
                meta: {
                    icon: 'md-briefcase',
                    title: '分类管理',
                    access: ['shopProductCategorys_oper']
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'productmanage-categorys-index',
                        meta: {
                            icon: 'md-briefcase',
                            title: '分类列表'
                        },
                        component: () => import('@/view/product-manage/categorys/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'productmanage-categorys-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-add',
                            title: '分类添加'
                        },
                        component: () => import('@/view/product-manage/categorys/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'productmanage-categorys-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-brush',
                            title: '分类编辑'
                        },
                        component: () => import('@/view/product-manage/categorys/add-edit.vue')
                    },
                ]
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
        children: [
            {
                path: 'admins',
                name: 'adminmanage-admins',
                meta: {
                    icon: 'md-person',
                    title: '管理员管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'adminmanage-admins-index',
                        meta: {
                            icon: 'md-person',
                            title: '管理员管理',
                            access: ['admins_view']
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
                            access: ['admins_edit']
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
                            access: ['admins_edit']
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
                            access: ['admins_edit']
                        },
                        component: () => import('@/view/admin-manage/admins/reset-password.vue')
                    },
                    {
                        path: 'setRole/:id',
                        name: 'adminmanage-admins-setrole',
                        meta: {
                            hideInMenu: true,
                            icon: 'ios-build',
                            title: '设置角色',
                            access: ['admins_roles']
                        },
                        component: () => import('@/view/admin-manage/admins/set-role.vue')
                    },
                ]
            },
            {
                path: 'roles',
                name: 'adminmanage-roles',
                meta: {
                    icon: 'md-person',
                    title: '角色管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'adminmanage-roles-index',
                        meta: {
                            icon: 'md-person',
                            title: '角色管理',
                            access: ['roles_view']
                        },
                        component: () => import('@/view/admin-manage/roles/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'adminmanage-roles-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-person-add',
                            title: '角色添加',
                            access: ['roles_edit']
                        },
                        component: () => import('@/view/admin-manage/roles/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'adminmanage-roles-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-person-add',
                            title: '角色编辑',
                            access: ['roles_edit']
                        },
                        component: () => import('@/view/admin-manage/roles/add-edit.vue')
                    },
                    {
                        path: 'givePerm/:id',
                        name: 'adminmanage-roles-giveperm',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-settings',
                            title: '分配权限',
                            access: ['roles_permission']
                        },
                        component: () => import('@/view/admin-manage/roles/give-perm.vue')
                    },
                ]
            },
            {
                path: 'permissions',
                name: 'adminmanage-permissions',
                meta: {
                    icon: 'md-list-box',
                    title: '权限管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'adminmanage-permissions-index',
                        meta: {
                            icon: 'md-list-box',
                            title: '权限管理',
                            access: ['permissions_oper']
                        },
                        component: () => import('@/view/admin-manage/permissions/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'adminmanage-permissions-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-person-add',
                            title: '权限添加',
                            access: ['permissions_oper']
                        },
                        component: () => import('@/view/admin-manage/permissions/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'adminmanage-permissions-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-person-add',
                            title: '权限编辑',
                            access: ['permissions_oper']
                        },
                        component: () => import('@/view/admin-manage/permissions/add-edit.vue')
                    },
                ]
            },
            {
                path: 'adminLogs',
                name: 'adminmanage-adminlogs',
                meta: {
                    icon: 'md-list-box',
                    title: '操作日志'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'adminmanage-adminlogs-index',
                        meta: {
                            icon: 'md-list-box',
                            title: '操作日志',
                            access: ['adminLogs_view']
                        },
                        component: () => import('@/view/admin-manage/admin-logs/index.vue')
                    },
                ]
            },
            {
                path: 'cronLogs',
                name: 'adminmanage-cronlogs',
                meta: {
                    icon: 'md-list-box',
                    title: '计划任务'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'adminmanage-cronlogs-index',
                        meta: {
                            icon: 'md-list-box',
                            title: '计划任务',
                            access: ['cronLogs_view']
                        },
                        component: () => import('@/view/admin-manage/cron-logs/index.vue')
                    },
                ]
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
