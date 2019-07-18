import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入总的css样式
import '../src/styles/index.less'
import router from '@/router'
import axios from '@/api/axios'
// 导入组件
import components from '@/components'
Vue.prototype.$http = axios
// 注册组件
Vue.use(components)

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
