import Vue from 'vue'
import runtimeForm from './components/runtimeForm.vue'

import './styles/cover.scss'
import './styles/index.scss'

runtimeForm.install = function (Vue) {
  Vue.component(runtimeForm.name, runtimeForm)
}

const components = [
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
  runtimeForm
}

export default {
  install,
  runtimeForm
}
