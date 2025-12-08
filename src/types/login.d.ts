import { BaseResponse } from './api'

// 登录参数
export interface LoginParams {
  account: string
  password: string
  identity: string
}

// 登录响应数据
export interface LoginDate {
  id: number
  token: string
  refreshToken: string
  expireTime: string
}

// 登录响应
export type LoginResponse = BaseResponse<LoginDate>
