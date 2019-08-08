import * as api from '@/api/ajax'
const state = {
  <%if(presets.features.indexOf('com-domain-login')>-1){%>
  userInfo: {}
  <%}%>
}
const getters = {}
const actions = {
  <%if(presets.features.indexOf('com-domain-login')>-1){%>
  getUserInfo ({ commit }, params) {
    api.getUserInfo(params).then(res => {
      commit('setUserInfo', res.data)
    })
  },
  logout ({ commit }, params) {
    return api.logout(params)
  }
  <%}%>
}
const mutations = {
  <%if(presets.features.indexOf('com-domain-login')>-1){%>
  setUserInfo (state, data) {
    state.userInfo = data
  }
  <%}%>
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
