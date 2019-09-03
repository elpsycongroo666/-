import axios from '@/utils/myaxios.js'

// 获取所有用户
export const getAllUsers = (params) => {
  return axios({
    url: 'users',
    params
  })
}

// 添加用户
export const addUsers = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}
