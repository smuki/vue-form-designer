import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'

import ViewUI from 'view-design';
Vue.use(ViewUI);

import 'view-design/dist/styles/iview.css';

import FormMaking from './index'
Vue.use(FormMaking)

Vue.config.productionTip = false

Vue.use(ElementUI, { size: 'small' })

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
