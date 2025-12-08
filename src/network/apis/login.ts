import request from '@/network/request'
import type { LoginParams, LoginResponse } from '@/types/login'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export const loginApi = (data: LoginParams): Promise<LoginResponse> => {
  return request({
    url: '/users/login/simple',
    method: 'POST',
    data
  })
}

/**
 * 获取设备唯一标识
 */
export const getDeviceIdentity = (): string => {
  let identity = localStorage.getItem('deviceIdentity')
  if (!identity) {
    identity = `web_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    localStorage.setItem('deviceIdentity', identity)
  }
  return identity
}
