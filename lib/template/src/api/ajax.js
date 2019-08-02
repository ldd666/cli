<%if(presets.selectFeatures.indexOf('axios')>-1){%>
import api from './base'
<%}%>
export const getList = (params) => {
  return api.get('/test', params)
}