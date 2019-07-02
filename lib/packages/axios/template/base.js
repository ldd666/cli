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
  if (response.data.errno !== 0) {
    return Promise.reject(response)
  }
  return response
}, function (error) {
  return Promise.reject(error)
})
export default axios