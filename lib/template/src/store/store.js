import Vue from 'vue'
import Vuex from 'vuex'
<%if(presets.features.indexOf('com-domain-login')>-1){%>
import user from './modules/user'
<%}%>

Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    <%if(presets.features.indexOf('com-domain-login')>-1){%>
    user
    <%}%>
  },
  strict: debug
})
