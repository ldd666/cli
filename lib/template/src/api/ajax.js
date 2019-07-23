import api from './base'
export default {
  getList (params) {
    return api.get('/test', params)
  }
}
