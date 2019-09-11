import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import { get, post } from './lib/axios.js'
import { message } from './lib/util.js'
import vuescroll from 'vuescroll/dist/vuescroll-native'
import Scroll from '@/components/Scroll'
import 'vuescroll/dist/vuescroll.css'

Vue.config.productionTip = false

Vue.use(vuescroll)
Vue.component('Scroll', Scroll)
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$msg = message

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
