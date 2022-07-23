import axios from "axios";
const service = axios.create({})

service.interceptors.request.use(
    config =>{
        console.log(config)
        return config
    }
)
// http response拦截器
service.interceptors.response.use(
    response => {
        return response
    },
    error => {
        return Promise.reject(error)
    }
)

export default service
