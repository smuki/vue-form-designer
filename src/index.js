import Vue from 'vue'
import 'normalize.css/normalize.css'

import MakingForm from './components/Designer.vue'
import runtimeForm from './components/runtimeForm.vue'

import './iconfont/iconfont.css'
import './styles/cover.scss'
import './styles/index.scss'

MakingForm.install = function (Vue) {
  Vue.component(MakingForm.name, MakingForm)
}

runtimeForm.install = function (Vue) {
  Vue.component(runtimeForm.name, runtimeForm)
}

const components = [
  MakingForm,
  runtimeForm
]

const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  install,
  MakingForm,
  runtimeForm
}

export default {
  install,
  MakingForm,
  runtimeForm
}
