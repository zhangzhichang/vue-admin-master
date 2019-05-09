import {postRequest ,getRequest } from '../request/http.js'
const base_url = '/configApi/config/manager'
export const getApplicationList = param =>{return getRequest(base_url + '/queryApplication' , param);}

export const getProfileList = param =>{return getRequest(base_url + '/queryProfile/' + param.application );}

export const getConfigList = param =>{return getRequest(base_url + '/query/' + param.application + '/' + param.profile);}

export const publishConfig = param =>{return postRequest(base_url + '/publish/' + param.application + '/' + param.profile);}

export const deleteConfig = param =>{return postRequest(base_url + '/deleted/' + param.id);}

export const submitConfig = param =>{return postRequest(base_url + '/saveOrModify' , param);}