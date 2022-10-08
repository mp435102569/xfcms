import axios from 'axios';
import { ElMessage } from 'element-plus';
import { head } from 'lodash';
import {storage} from  '../assets/utils'
let dev = process.env.NODE_ENV;
/* 创建axios实例 */
const http = axios.create({
    /* 通用前缀 */
    baseURL: dev == 'development'?'http://backend-api-02.newbee.ltd/manage-api/v1':'/api',
    /* 超时时间 */
    timeout: 60000,

   
});
http.interceptors.request.use(config => {
    /* axios请求拦截器 */
        /* 统一携带token */
    if (!config.url.includes('/adminUser/login')) {
        let tk = storage.get('tk',302400000);
        if (tk) {
            config.headers['token'] = tk
        }
    }   
 return config;
});
http.interceptors.response.use(response => {
    return response.data;
}, error => {
    ElMessage.error('当前网络繁忙,请您稍后再试~' );
    return  Promise.reject(error);
})
export default http;