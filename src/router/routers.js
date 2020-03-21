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
    path: '/manageStaticsManage',
    name: 'managestaticsmanage',
    meta: {
      access: ['manage_statics:user_manage', 
                'manage_statics:pay_manage', 
                'manage_statics:coupon_manage',
                'manage_statics:income_manage'
              ],
      icon: 'md-stats',
      title: '运营统计'
    },
    component: Main,
    children: [{
        path: 'userManage',
        name: 'managestaticsmanage-usermanage',
        meta: {
          access: ['manage_statics:user_manage'],
          icon: 'md-stats',
          title: '运营统计'
        },
        component: () => import('@/view/manage-statics-manage/usermanage.vue'),
      },
      {
        path: 'payManage',
        name: 'managestaticsmanage-paymanage',
        meta: {
          access: ['manage_statics:pay_manage'],
          icon: 'md-stats',
          title: '付费统计'
        },
        component: () => import('@/view/manage-statics-manage/paymanage.vue'),
      },
      {
        path: 'couponManage',
        name: 'managestaticsmanage-couponmanage',
        meta: {
          access: ['manage_statics:coupon_manage'],
          icon: 'md-stats',
          title: '优惠券统计'
        },
        component: () => import('@/view/manage-statics-manage/couponmanage.vue'),
      },
      {
        path: 'statics/index',
        name: 'managestaticsmanage-statics-index',
        meta: {
          access: ['manage_statics:income_manage'],
          icon: 'md-stats',
          title: '收入统计'
        },
        component: () => import('@/view/statics-manage/statics/index.vue'),
      },
    ]
  },
  {
    path: '/userManage',
    name: 'usermanage',
    meta: {
      access: ['user:view'],
      icon: 'md-person',
      title: '用户管理'
    },
    component: Main,
    children: [{
        path: 'index',
        name: 'usermanage-users-index',
        meta: {
          access: ['user:view'],
          icon: 'md-person',
          title: '用户管理'
        },
        component: () => import('@/view/user-manage/users/index.vue')
      },
      {
        path: 'walletLogs/:user_id',
        name: 'usermanage-walletLogs',
        meta: {
          access: ['user:wallet_logs'],
          hideInMenu: true,
          icon: 'md-cash',
          title: '钱包日志'
        },
        component: () => import('@/view/user-manage/wallet-logs/index.vue'),
      }
    ]
  },
  {
    path: '/partnerManage',
    name: 'partnermanage',
    meta: {
      access: ['partner:view', 'partner:statics', 'partner_wallet_apply:view'],
      icon: 'md-person',
      title: '合伙人管理'
    },
    component: Main,
    children: [{
        path: 'index',
        name: 'partnermanage-partners-index',
        meta: {
          access: ['partner:view'],
          icon: 'md-person',
          title: '合伙人管理'
        },
        component: () => import('@/view/partner-manage/partners/index.vue')
      },
      {
        path: 'walletLogs/:user_id',
        name: 'partnermanage-walletLogs',
        meta: {
          access: ['partner:wallet_logs'],
          hideInMenu: true,
          icon: 'md-cash',
          title: '钱包日志'
        },
        component: () => import('@/view/partner-manage/wallet-logs/index.vue'),
      },
      {
        path: 'statics',
        name: 'partnermanage-statics',
        meta: {
          access: ['partner:statics'],
          icon: 'md-cash',
          title: '合伙人统计'
        },
        component: () => import('@/view/partner-manage/partners/statics.vue')
      },
      {
        path: 'walletApplys',
        name: 'partnermanage-walletapplys-index',
        meta: {
          access: ['partner_wallet_apply:view'],
          icon: 'md-cash',
          title: '合伙人提现管理'
        },
        component: () => import('@/view/partner-manage/wallet-applys/index.vue')
      }
    ]
  },
  {
    path: '/activityManage',
    name: 'activitymanage',
    meta: {
      access: ['activity:view', 'activity:edit'],
      icon: 'md-book',
      title: '薪活动管理'
    },
    component: Main,
    children: [{
        path: 'index',
        name: 'activitymanage-activities-index',
        meta: {
          access: ['activity:view'],
          icon: 'md-book',
          title: '薪活动管理',
        },
        component: () => import('@/view/activity-manage/activities/index.vue')
      },
      {
        path: 'add',
        name: 'activitymanage-activities-add',
        meta: {
          access: ['activity:edit'],
          icon: 'md-add',
          title: '薪活动添加',
        },
        component: () => import('@/view/activity-manage/activities/add-edit.vue')
      },
      {
        path: 'edit/:id',
        name: 'activitymanage-activities-edit',
        meta: {
          access: ['activity:edit'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '薪活动编辑',
        },
        component: () => import('@/view/activity-manage/activities/add-edit.vue')
      },
      {
        path: 'user/:id',
        name: 'activitymanage-activities-user',
        meta: {
          access: ['activity_user:view'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '薪活动用户',
        },
        component: () => import('@/view/activity-manage/activities/user.vue')
      },
    ]
  },
  {
    path: '/businessManage',
    name: 'businessmanage',
    meta: {
      access: ['business:view', 'business:edit', 'tag:view'],
      icon: 'md-bookmarks',
      title: '薪商学管理'
    },
    component: Main,
    children: [{
        path: 'index',
        name: 'businessmanage-business-index',
        meta: {
          access: ['business:view'],
          icon: 'md-bookmarks',
          title: '薪商学管理',
        },
        component: () => import('@/view/business-manage/business/index.vue')
      },
      {
        path: 'add',
        name: 'businessmanage-business-add',
        meta: {
          access: ['business:edit'],
          icon: 'md-add',
          title: '薪商学添加',
        },
        component: () => import('@/view/business-manage/business/add-edit.vue')
      },
      {
        path: 'edit/:id',
        name: 'businessmanage-business-edit',
        meta: {
          access: ['business:edit'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '薪商学编辑',
        },
        component: () => import('@/view/business-manage/business/add-edit.vue')
      },
      {
        path: 'user/:id',
        name: 'businessmanage-business-user',
        meta: {
          access: ['business_user:view'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '薪商学用户',
        },
        component: () => import('@/view/business-manage/business/user.vue')
      },
      {
        path: 'tags/business',
        name: 'businessmanage-tags-index',
        meta: {
          access: ['tag:view'],
          icon: 'md-pricetag',
          title: '商学标签管理',
        },
        component: () => import('@/view/tag-manage/tags/index.vue')
      },
    ]
  },
  {
    path: '/classroomManage',
    name: 'classroommanage',
    meta: {
      access: ['classroom:view', 'classroom:edit', 'classroom_comment:view', 'tag:view'],
      icon: 'md-bookmark',
      title: '薪课堂管理'
    },
    component: Main,
    children: [{
        path: 'index',
        name: 'classroommanage-classrooms-index',
        meta: {
          access: ['classroom:view'],
          icon: 'md-bookmark',
          title: '薪课堂管理',
        },
        component: () => import('@/view/classroom-manage/classrooms/index.vue')
      },
      {
        path: 'add',
        name: 'classroommanage-classrooms-add',
        meta: {
          access: ['classroom:edit'],
          icon: 'md-add',
          title: '薪课堂添加',
        },
        component: () => import('@/view/classroom-manage/classrooms/add-edit.vue')
      },
      {
        path: 'edit/:id',
        name: 'classroommanage-classrooms-edit',
        meta: {
          access: ['classroom:edit'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '薪课堂编辑',
        },
        component: () => import('@/view/classroom-manage/classrooms/add-edit.vue')
      },
      {
        path: 'user/:id',
        name: 'classroommanage-classrooms-user',
        meta: {
          access: ['classroom_user:view'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '薪课堂用户',
        },
        component: () => import('@/view/classroom-manage/classrooms/user.vue')
      },
      {
        path: 'classroomContents/:classroom_id',
        name: 'classroommanage-classroomcontents-index',
        meta: {
          access: ['classroom_content:view'],
          hideInMenu: true,
          icon: 'md-construct',
          title: '薪课堂课时',
        },
        component: () => import('@/view/classroom-manage/classroom-contents/index.vue')
      },
      {
        path: 'classroomContents/add/:classroom_id',
        name: 'classroommanage-classroomcontents-add',
        meta: {
          access: ['classroom_content:edit'],
          hideInMenu: true,
          icon: 'md-add',
          title: '课时添加',
        },
        component: () => import('@/view/classroom-manage/classroom-contents/add-edit.vue')
      },
      {
        path: 'classroomContents/edit/:classroom_id/:id',
        name: 'classroommanage-classroomcontents-edit',
        meta: {
          access: ['classroom_content:edit'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '课时编辑',
        },
        component: () => import('@/view/classroom-manage/classroom-contents/add-edit.vue')
      },
      {
        path: 'classroomComments',
        name: 'classroommanage-classroomComments-index',
        meta: {
          access: ['classroom_comment:view'],
          icon: 'md-chatboxes',
          title: '薪课堂留言',
        },
        component: () => import('@/view/classroom-manage/classroom-comments/index.vue')
      },
      {
        path: 'classroomComments/:classroom_id/:classroom_content_id',
        name: 'classroommanage-classroomComments-index-params',
        meta: {
          access: ['classroom_comment:view'],
          hideInMenu: true,
          icon: 'md-add',
          title: '新课堂留言',
        },
        component: () => import('@/view/classroom-manage/classroom-comments/index.vue')
      },
      {
        path: 'classroomTeachComments/:classroom_id',
        name: 'classroommanage-classroomTeachComments-index-classroom',
        meta: {
          access: ['classroom_teach_comment:view'],
          hideInMenu: true,
          icon: 'md-add',
          title: '讲师评价',
        },
        component: () => import('@/view/classroom-manage/classroom-teach-comments/index.vue')
      },
      {
        path: 'classroomTeachComments/:classroom_id/:classroom_content_id',
        name: 'classroommanage-classroomTeachComments-index-params',
        meta: {
          access: ['classroom_teach_comment:view'],
          hideInMenu: true,
          icon: 'md-add',
          title: '讲师评价',
        },
        component: () => import('@/view/classroom-manage/classroom-teach-comments/index.vue')
      },
      {
        path: 'tags/classroom',
        name: 'classroommanage-tags-index',
        meta: {
          access: ['tag:view'],
          icon: 'md-pricetag',
          title: '课堂标签管理',
        },
        component: () => import('@/view/tag-manage/tags/index.vue')
      },
    ]
  },
  {
    path: '/soundManage',
    name: 'soundmanage',
    meta: {
      access: ['sound:view', 'sound:edit', 'tag:view'],
      icon: 'md-microphone',
      title: '薪声管理'
    },
    component: Main,
    children: [{
        path: 'index',
        name: 'soundmanage-sounds-index',
        meta: {
          access: ['sound:view'],
          icon: 'md-microphone',
          title: '薪声管理',
        },
        component: () => import('@/view/sound-manage/sounds/index.vue')
      },
      {
        path: 'add',
        name: 'soundmanage-sounds-add',
        meta: {
          access: ['sound:edit'],
          icon: 'md-add',
          title: '薪声添加',
        },
        component: () => import('@/view/sound-manage/sounds/add-edit.vue')
      },
      {
        path: 'edit/:id',
        name: 'soundmanage-sounds-edit',
        meta: {
          access: ['sound:edit'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '薪声编辑',
        },
        component: () => import('@/view/sound-manage/sounds/add-edit.vue')
      },
      {
        path: 'tags/sound',
        name: 'soundmanage-tags-index',
        meta: {
          access: ['tag:view'],
          icon: 'md-pricetag',
          title: '薪声标签管理',
        },
        component: () => import('@/view/tag-manage/tags/index.vue')
      },
      {
        path: 'soundComments/:sound_id',
        name: 'soundmanage-soundComments-index',
        meta: {
          access: ['sound_comment:view'],
          hideInMenu: true,
          icon: 'md-chatboxes',
          title: '薪声留言',
        },
        component: () => import('@/view/sound-manage/sound-comments/index.vue')
      },
    ]
  },
  {
    path: '/giftLogManage',
    name: 'giftlogmanage',
    meta: {
      access: ['gift_log:view'],
      icon: 'md-cash',
      title: '兑换码管理'
    },
    component: Main,
    children: [{
        path: 'index',
        name: 'giftlogmanage-giftlogs-index',
        meta: {
          access: ['gift_log:view', 'gift_log:add'],
          icon: 'md-microphone',
          title: '兑换码管理',
        },
        component: () => import('@/view/gift-log-manage/gift-logs/index.vue')
      },
      {
        path: 'add',
        name: 'giftlogmanage-giftlogs-add',
        meta: {
          access: ['gift_log:add'],
          icon: 'md-add',
          title: '生成兑换码',
        },
        component: () => import('@/view/gift-log-manage/gift-logs/add-edit.vue')
      },
      {
        path: 'userGift/:gift_log_id',
        name: 'giftlogmanage-usergift-index',
        meta: {
          access: ['gift_log:view'],
          hideInMenu: true,
          icon: 'md-chatboxes',
          title: '兑换码详情',
        },
        component: () => import('@/view/gift-log-manage/user-gifts/index.vue')
      },
    ]
  },
  {
    path: '/tagManage',
    name: 'tagmanage',
    meta: {
      access: ['tag:edit'],
      hideInMenu: true,
      icon: 'md-pricetag',
      title: '标签管理'
    },
    component: Main,
    children: [{
        path: 'add/:type',
        name: 'tagManage-tags-add',
        meta: {
          hideInMenu: true,
          icon: 'md-add',
          title: '标签添加',
        },
        component: () => import('@/view/tag-manage/tags/add-edit.vue')
      },
      {
        path: 'edit/:type/:id',
        name: 'tagManage-tags-edit',
        meta: {
          hideInMenu: true,
          icon: 'md-brush',
          title: '标签编辑',
        },
        component: () => import('@/view/tag-manage/tags/add-edit.vue')
      },
    ]
  },
  {
    path: '/couponManage',
    name: 'couponmanage',
    meta: {
      access: ['coupon_type:view', 'coupon_type:edit'],
      icon: 'md-card',
      title: '优惠券管理'
    },
    component: Main,
    children: [{
        path: 'index',
        name: 'couponmanage-coupontypes-index',
        meta: {
          access: ['coupon_type:view'],
          icon: 'md-card',
          title: '优惠券管理',
        },
        component: () => import('@/view/coupon-manage/coupon-types/index.vue')
      },
      {
        path: 'add',
        name: 'couponmanage-coupontypes-add',
        meta: {
          access: ['coupon_type:edit'],
          icon: 'md-add',
          title: '优惠券添加',
        },
        component: () => import('@/view/coupon-manage/coupon-types/add-edit.vue')
      },
      {
        path: 'edit/:id',
        name: 'couponmanage-coupontypes-edit',
        meta: {
          access: ['coupon_type:edit'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '优惠券编辑',
        },
        component: () => import('@/view/coupon-manage/coupon-types/add-edit.vue')
      },
      {
        path: 'coupons/:coupon_type_id',
        name: 'couponmanage-coupons-index',
        meta: {
          access: ['coupon:view'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '优惠券记录',
        },
        component: () => import('@/view/coupon-manage/coupons/index.vue')
      },
    ]
  },
  {
    path: '/orderManage',
    name: 'ordermanage',
    meta: {
      access: ['order:view'],
      icon: 'md-albums',
      title: '订单管理'
    },
    component: Main,
    children: [{
        path: 'orders/index',
        name: 'ordermanage-orders-index',
        meta: {
          access: ['order:view'],
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
    path: '/walletApplys',
    name: 'walletapplys',
    meta: {
      access: ['wallet_apply:view'],
      icon: 'md-cash',
      title: '提现管理'
    },
    component: Main,
    children: [{
        path: 'index',
        name: 'walletapplys-index',
        meta: {
          access: ['wallet_apply:view'],
          icon: 'md-cash',
          title: '提现管理'
        },
        component: () => import('@/view/user-manage/wallet-applys/index.vue')
      }
    ]
  },
  {
    path: '/invoiceManage',
    name: 'invoices',
    meta: {
      access: ['invoice:view'],
      icon: 'md-cash',
      title: '开票管理'
    },
    component: Main,
    children: [{
        path: 'invoices/index',
        name: 'invoices-index',
        meta: {
          access: ['invoice:view'],
          icon: 'md-cash',
          title: '开票管理'
        },
        component: () => import('@/view/invoice-manage/invoices/index.vue')
      }
    ]
  },
  // {
  //   path: '/feedbackManage',
  //   name: 'feedbackmanage',
  //   meta: {
  //     access: ['feedback:view'],
  //     icon: 'md-chatboxes',
  //     title: '意见反馈'
  //   },
  //   component: Main,
  //   children: [{
  //       path: 'feedbacks/index',
  //       name: 'feedbackmanage-feedbacks-index',
  //       meta: {
  //         access: ['feedback:view'],
  //         icon: 'md-chatboxes',
  //         title: '意见反馈'
  //       },
  //       component: () => import('@/view/feedback-manage/feedbacks/index.vue'),
  //     }
  //   ]
  // },
  {
    path: '/articleManage',
    name: 'articlemanage',
    meta: {
      access: ['article:view', 'article_cat:view'],
      icon: 'md-document',
      title: '文章管理'
    },
    component: Main,
    children: [{
      path: 'articles/index',
        name: 'articlemanage-articles-index',
        meta: {
          access: ['article:view'],
          icon: 'md-document',
          title: '文章管理',
        },
        component: () => import('@/view/article-manage/articles/index.vue')
      },
      {
        path: 'articles/add',
        name: 'articlemanage-articles-add',
        meta: {
          access: ['article:edit'],
          hideInMenu: true,
          icon: 'md-add',
          title: '文章添加',
        },
        component: () => import('@/view/article-manage/articles/add-edit.vue')
      },
      {
        path: 'articles/edit/:id',
        name: 'articlemanage-articles-edit',
        meta: {
          access: ['article:edit'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '文章编辑',
        },
        component: () => import('@/view/article-manage/articles/add-edit.vue')
      },
      {
        path: 'articlecats/index',
        name: 'articlemanage-articlecats-index',
        meta: {
          access: ['article_cat:view'],
          icon: 'md-browsers',
          title: '分类管理',
        },
        component: () => import('@/view/article-manage/articlecats/index.vue')
      },
      {
        path: 'articlecats/add',
        name: 'articlemanage-articlecats-add',
        meta: {
          access: ['article_cat:edit'],
          hideInMenu: true,
          icon: 'md-add',
          title: '分类添加',
        },
        component: () => import('@/view/article-manage/articlecats/add-edit.vue')
      },
      {
        path: 'articlecats/edit/:id',
        name: 'articlemanage-articlecats-edit',
        meta: {
          access: ['article_cat:edit'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '分类编辑',
        },
        component: () => import('@/view/article-manage/articlecats/add-edit.vue')
      },
    ]
  },
  {
    path: '/adManage',
    name: 'admanage',
    meta: {
      access: ['ad:view', 'ad_position:view'],
      icon: 'md-basket',
      title: '广告管理'
    },
    component: Main,
    children: [{
        path: 'ads/index',
        name: 'admanage-ads-index',
        meta: {
          access: ['ad:view'],
          icon: 'md-basket',
          title: '广告管理',
        },
        component: () => import('@/view/ad-manage/ads/index.vue')
      },
      {
        path: 'ads/add',
        name: 'admanage-ads-add',
        meta: {
          access: ['ad:edit'],
          hideInMenu: true,
          icon: 'md-add',
          title: '广告添加',
        },
        component: () => import('@/view/ad-manage/ads/add-edit.vue')
      },
      {
        path: 'ads/edit/:id',
        name: 'admanage-ads-edit',
        meta: {
          access: ['ad:edit'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '广告编辑',
        },
        component: () => import('@/view/ad-manage/ads/add-edit.vue')
      },
      {
        path: 'adPositions/index',
        name: 'admanage-adpositions-index',
        meta: {
          access: ['ad_position:view'],
          icon: 'md-basket',
          title: '广告位管理',
        },
        component: () => import('@/view/ad-manage/adpositions/index.vue')
      },
      {
        path: 'adPositions/add',
        name: 'admanage-adpositions-add',
        meta: {
          access: ['ad_position:edit'],
          hideInMenu: true,
          icon: 'md-add',
          title: '广告位添加',
        },
        component: () => import('@/view/ad-manage/adpositions/add-edit.vue')
      },
      {
        path: 'adPositions/edit/:id',
        name: 'admanage-adpositions-edit',
        meta: {
          access: ['ad_position:edit'],
          hideInMenu: true,
          icon: 'md-brush',
          title: '广告位编辑',
        },
        component: () => import('@/view/ad-manage/adpositions/add-edit.vue')
      },
    ]
  },
  {
    path: '/settingManage',
    name: 'settingmanage',
    meta: {
      access: ['setting:view'],
      icon: 'md-settings',
      title: '设置管理'
    },
    component: Main,
    children: [{
        path: 'settings',
        name: 'settingmanage-settings',
        meta: {
          access: ['setting:view'],
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
      access: ['admin:view', 'role:view', 'admin_log:view'],
      icon: 'md-cog',
      title: '管理设置'
    },
    component: Main,
    children: [{
      path: 'admins/index',
        name: 'adminmanage-admins-index',
        meta: {
          access: ['admin:view'],
          icon: 'md-person',
          title: '管理员管理',
        },
        component: () => import('@/view/admin-manage/admins/index.vue')
      },
      {
        path: 'admins/add',
        name: 'adminmanage-admins-add',
        meta: {
          access: ['admin:edit'],
          hideInMenu: true,
          icon: 'md-person-add',
          title: '管理员添加',
        },
        component: () => import('@/view/admin-manage/admins/add-edit.vue')
      },
      {
        path: 'admins/edit/:id',
        name: 'adminmanage-admins-edit',
        meta: {
          access: ['admin:edit'],
          hideInMenu: true,
          icon: 'md-person-add',
          title: '管理员编辑',
          // access: ['admins_edit']
        },
        component: () => import('@/view/admin-manage/admins/add-edit.vue')
      },
      {
        path: 'admins/resetPassword/:id',
        name: 'adminmanage-admins-resetpassword',
        meta: {
          access: ['admin:password'],
          hideInMenu: true,
          icon: 'ios-build',
          title: '管理员重置密码',
        },
        component: () => import('@/view/admin-manage/admins/reset-password.vue')
      },
      {
        path: 'admins/setRole/:id',
        name: 'adminmanage-admins-setrole',
        meta: {
          access: ['admin:role'],
          hideInMenu: true,
          icon: 'ios-build',
          title: '设置角色',
          // access: ['admins_roles']
        },
        component: () => import('@/view/admin-manage/admins/set-role.vue')
      },
      {
        path: 'roles/index',
        name: 'adminmanage-roles-index',
        meta: {
          access: ['role:view'],
          icon: 'md-contacts',
          title: '角色管理',
        },
        component: () => import('@/view/admin-manage/roles/index.vue')
      },
      {
        path: 'roles/add',
        name: 'adminmanage-roles-add',
        meta: {
          access: ['role:edit'],
          hideInMenu: true,
          icon: 'md-person-add',
          title: '角色添加',
          // access: ['roles_edit']
        },
        component: () => import('@/view/admin-manage/roles/add-edit.vue')
      },
      {
        path: 'roles/edit/:id',
        name: 'adminmanage-roles-edit',
        meta: {
          access: ['role:edit'],
          hideInMenu: true,
          icon: 'md-person-add',
          title: '角色编辑',
          // access: ['roles_edit']
        },
        component: () => import('@/view/admin-manage/roles/add-edit.vue')
      },
      {
        path: 'roles/givePerm/:id',
        name: 'adminmanage-roles-giveperm',
        meta: {
          access: ['role:permission'],
          hideInMenu: true,
          icon: 'md-settings',
          title: '分配权限',
          // access: ['roles_permission']
        },
        component: () => import('@/view/admin-manage/roles/give-perm.vue')
      },
      {
        path: 'adminLogs/index',
        name: 'adminmanage-adminlogs-index',
        meta: {
          access: ['admin_log:view'],
          icon: 'md-list-box',
          title: '操作日志',
        },
        component: () => import('@/view/admin-manage/admin-logs/index.vue')
      }
    ]

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
      // {
      //   path: 'cronLogs',
      //   name: 'adminmanage-cronlogs',
      //   meta: {
      //     icon: 'md-list-box',
      //     title: '计划任务'
      //   },
      //   component: parentView,
      //   children: [{
      //     path: 'index',
      //     name: 'adminmanage-cronlogs-index',
      //     meta: {
      //       icon: 'md-list-box',
      //       title: '计划任务',
      //       // access: ['cronLogs_view']
      //     },
      //     component: () => import('@/view/admin-manage/cron-logs/index.vue')
      //   }, ]
      // }
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
