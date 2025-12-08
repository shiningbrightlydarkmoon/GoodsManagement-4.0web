import request from '@/network/request'
import type { UserInfoResponse } from '@/types/user'

/**
 * 获取用户信息
 */
export const getUserInfo = () : Promise<UserInfoResponse> => {
  return request({
    url: '/users',
    method: 'GET'
  })
}
