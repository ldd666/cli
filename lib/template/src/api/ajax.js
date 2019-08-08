import api from './base'
export const getTestList = (params) => {
  return api.get('/getTest', params)
}
<%if(presets.features.indexOf('com-domain-login')>-1){%>
/**
 * 用户信息
 */
export const getUserInfo = (params) => {
  return api.get('/getUser', params)
}
/**
 * 退出登录
 */
export const logout = (params) => {
  return api.get(`/user/logout`, { params })
}
<%}%>