import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store.js'
import '@/assets/global.css'

Vue.config.productionTip = false
<%if(presets.selectFeatures.indexOf('element')>-1){%>
  import ElementUI from 'element-ui'
  import './element-variables.scss'
  Vue.use(ElementUI);
<%}%>
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
