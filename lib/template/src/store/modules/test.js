import { getList } from '@/api/ajax'
const state = {
  items: []
}
const getters = {}
const actions = {
  getList ({ commit }) {
    getList().then(res => {
      commit('add', res)
    })
  }
}
const mutations = {
  add (state, item) {
    state.items.push(item)
  }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
