import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { getToken, setToken, canTurnTo } from '@/libs/util'
import config from '@/config'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'hash'
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next, is_super) => {
  if (is_super) {
    // 超级管理员，不验证权限
    next()
  } else {
    if (canTurnTo(to.name, access, routes)){
      next() // 有权限，可访问
    } else {
      next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
    }
  }
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()

  if (process.env.NODE_ENV === 'development' && config.mock) {
    setToken(config.mockToken);
  }
  
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    if (store.state.user.hasGetInfo) {
      // turnTo(to, store.state.user.access, next)
      turnTo(to, store.state.user.access, next, store.state.user.superAdmin)
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        // turnTo(to, user.access, next)
        turnTo(to, user.access, next, user.is_super)
      }).catch(() => {
        store.dispatch('handleLogOut').then(() => {
          next({
            name: 'login'
          })
        })
      })
    }
  }
})

router.afterEach(to => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router
