// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ViewUI from 'view-design';
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import 'view-design/dist/styles/iview.css';
import './index.less'
import '@/assets/icons/iconfont.css'
import Sm from './plugin'
import VueClipboards from 'vue-clipboard2'

// 复制剪贴板
Vue.use(VueClipboards);

Vue.use(Sm);

// 实际打包时应该不引入mock
/* eslint-disable */
// if (process.env.NODE_ENV !== 'production') require('@/mock')

Vue.use(ViewUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
