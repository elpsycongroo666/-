// 引入封装好的axios
import axios from '@/utils/myaxios.js'

// 获取所有角色
export const getALLRoleList = () => {
  return axios({
    url: `roles`
  })
}
