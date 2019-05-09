import axios from 'axios'
import { Message } from 'element-ui';
import { Loading } from 'element-ui';

const service = axios.create({
    timeout: 15000 ,// 请求超时时间
    headers: {'content-type': 'application/json'}
})

axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        debugger
        return Promise.reject(error.response);
    }
);
axios.interceptors.response.use(
    function(response) {
        //请求正常则返回
        return Promise.resolve(response)
    },
    function(error) {
        return Promise.reject(error)
    }
)

export function postRequest(url, data = {}) {
    return new Promise((resolve, reject) => {
        let loadingInstance = Loading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
        });
        axios({
            url: url,
            method: 'post',
            data: data
        })
        .then(res => {
            //成功
            resolve(res.data);
            loadingInstance.close();
        })
        .catch(res => {
            var flag = errorExec(res);
            if(flag){
                reject(res)
            }
            loadingInstance.close();
        })
    })
}

export function getRequest(url, data = {}) {
    return new Promise((resolve, reject) => {
        let loadingInstance = Loading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
        });
        axios.get(url,{params:data})
        /*axios({
            url: url,
            method: 'get',
            data: {params:data}
        })
            */.then(res => {
                //成功
                resolve(res.data)
                loadingInstance.close();
            })
            .catch(res => {
                var flag = errorExec(res);
                if(flag){
                    reject(res)
                }
                loadingInstance.close();
            })
    })
}

export function putRequest(url, data = {}) {
    return new Promise((resolve, reject) => {
        let loadingInstance = Loading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
        });
        axios({
            url: url,
            method: 'put',
            data: data
        })
            .then(res => {
                //成功
                resolve(res.data)
                loadingInstance.close();
            })
            .catch(res => {
                var flag = errorExec(res);
                if(flag){
                    reject(res)
                }
                loadingInstance.close();
            })
    })
}

export function deleteRequest(url, data = {}) {
    return new Promise((resolve, reject) => {
        let loadingInstance = Loading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
        });
        axios({
            url: url,
            method: 'delete',
            data: data
        })
            .then(res => {
                //成功
                resolve(res.data)
                loadingInstance.close();
            })
            .catch(res => {
                var flag = errorExec(res);
                if(flag){
                    reject(res)
                }
                loadingInstance.close();
            })
    })
}

export function commonRequest(url, data = {} , method = 'post') {
    return new Promise((resolve, reject) => {
        let loadingInstance = Loading.service({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.5)'
        });
        axios({
            url: url,
            method: method,
            data: data
        })
            .then(res => {
                //成功
                resolve(res.data)
                loadingInstance.close();
            })
            .catch(res => {
                var flag = errorExec(res);
                if(flag){
                    reject(res)
                }
                loadingInstance.close();
            })
    })
}

function errorExec(error) {
    var flag = false;
    if(error.response.status == 404){
        Message.error({
            showClose: true,
            message: '您所访问的链接不存在！'
        });
    }else if(error.response.status == 500){
        Message.error({
            showClose: true,
            message: '未知错误， 请稍后再试！'
        });
    }else{
        flag = true;
    }
    return flag;
}