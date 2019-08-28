import axios from 'axios'
// 设置接口基准地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 添加全局拦截器
axios.interceptors.request.use(function (config) {
//   console.log(config)
  // 获取token
  let mytoken = localStorage.getItem('35_token')
  //   console.log(mytoken)
  // 如果又token值在设置进请求头
  if (mytoken) {
    config.headers.Authorization = mytoken
  }
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})
// 暴露
export default axios
