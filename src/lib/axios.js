import axios from 'axios'
import router from '@/router.js'
import { message } from '@/lib/util.js'
const Qs = require('qs')
const CancelToken = axios.CancelToken
//axios.defaults.headers.common['valToken'] = localStorage.getItem('token')
axios.defaults.timeout = 10000

function errorHandler(error, source) {
    if (error.response) {
        // 请求已发出，但服务器响应的状态码不在 2xx 范围内
        if(error.response.status == 404) {
            message({type:'error', text: '404 找不到服务器文件!'})
        }else if(error.response.status >= 500) {
            message({type:'error', text: error.response.status + '抱歉，服务器异常!'})
        }else {
            message({type:'error', text: error.response.status + '抱歉，系统异常!'})
        }
    }
    if(/timeout/.test(error.message)) {
        source.cancel('timeout of 10000ms exceeded') //取消请求
        message({type:'error', text: '网络请求超时，请尝试刷新!'})
    }
    console.log('Error', error.message)   
    return {}
}

function callback(response) {
    if (response.status === 200) {
        if(parseInt(response.data.status) === 999007){ //未登录
            router.push('login')
        }
    }
    return response.data
}

export function get(amount) { //get请求
    axios.defaults.headers.common['Authorization'] = 'd46eda04c25a821a9fde3270a2549b'
    const source = CancelToken.source()
    return axios.get( amount.url, { params: amount.data }, {cancelToken: source.token} ).then((response) => {
        return callback(response)
    }).catch((error) => {
        return errorHandler(error, source)
    })
}

export function  post(amount) { //post请求
    axios.defaults.headers.common['Authorization'] = 'd46eda04c25a821a9fde3270a2549b'
    const source = CancelToken.source()
    return axios.post( amount.url, Qs.stringify(amount.data), {cancelToken: source.token} ).then((response) => {
        return callback(response)
    }).catch((error) => {
        return errorHandler(error, source)
    })
}