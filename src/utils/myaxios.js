import axios from 'axios'
// 设置接口基准地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 暴露
export default axios
