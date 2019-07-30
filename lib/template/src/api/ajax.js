import api from './base'
export const getList = (params) => {
  return api.get('/test', params)
}
