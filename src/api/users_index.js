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

// 编辑用户
export const editUsers = (data) => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}

// 分配用户角色
export const allotUserRole = (data) => {
  return axios({
    url: `users/${data.id}/role`,
    method: 'put',
    data
  })
}

// 根据id删除用户
export const delUserById = (id) => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}
