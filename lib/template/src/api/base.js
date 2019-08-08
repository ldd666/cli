import axios from 'axios'
import qs from 'qs'

axios.defaults.withCredentials = true
axios.defaults.baseURL = ''

axios.interceptors.request.use(function (config) {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function (response) {
  <%if(presets.features.indexOf('com-domain-login')>-1){%>
  if (response.data.errno === 1) {
    window.location.href = `https://login.ops.qihoo.net:4430/sec/login?ref=${window.location.origin}`
    return false
  }
  <%}%>
  if (response.data.errno !== 0) {
    return Promise.reject(response)
  }
  return response
}, function (error) {
  return Promise.reject(error)
})
export default axios
