import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入包含所有less文件的index
import '@/styles/index.less'
import router from '@/router/router.js'
Vue.config.productionTip = false
Vue.use(ElementUI)
// 注册一个导航守卫
router.beforeEach((to, from, next) => {
  // console.log(to)
  // console.log(from)
  // 获取token
  let mytoken = localStorage.getItem('35_token')
  if (mytoken || to.fullPath === '/login') {
    next()
  } else {
    next({ name: 'login' })
  }
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
