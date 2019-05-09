import {postRequest ,getRequest ,putRequest ,deleteRequest} from '../request/http.js'
let base_url = '/utils'
//site
export const getByUuid = param =>{return getRequest(base_url + '/site/select/' + param.uuid);}
export const deletedByUuid = param =>{return deleteRequest(base_url + '/site/deleted/' + param.uuid );}
export const getByKeyword = param =>{return getRequest(base_url + '/site/selectAll' , param);}
export const checkByAppName = param =>{return getRequest(base_url + '/site/check/' + param.appName);}
export const addSite = param =>{return postRequest(base_url + '/site/insert' , param);}
export const modifySite = param =>{return putRequest(base_url + '/site/update' , param);}

//config
export const getConfigValue = param =>{return getRequest(base_url + '/sysconfig/value/'+param.key+'/'+param.siteId);}
export const getConfigValueDefault = param =>{return getRequest(base_url + '/sysconfig/value/'+param.key+'/'+param.siteId + '/'+param.defaultValue);}
export const deletedConfigByKey = param =>{return deleteRequest(base_url + '/sysconfig/delete/'+param.key+'/'+param.siteId);}
export const deletedConfigBatch = param =>{return deleteRequest(base_url + '/sysconfig/deleteBatch/'+param.ids);}
export const getConfigInfoByKey = param =>{return getRequest(base_url + '/sysconfig/select/'+param.key+'/'+param.siteId);}
export const getConfigInfoPage = param =>{return getRequest(base_url + '/sysconfig/selectPage/'+param.siteId+'/'+param.pageNum+'/'+param.pageSize , param);}
export const addConfigInfo = param =>{return postRequest(base_url + '/sysconfig/insert' , param);}
export const modifyConfigInfo = param =>{return putRequest(base_url + '/sysconfig/update' , param);}


