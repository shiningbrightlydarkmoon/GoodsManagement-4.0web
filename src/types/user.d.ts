import { BaseResponse } from "./api"

// 用户信息参数
export interface UserInfo {
  id: number
  userId: number
  name: string
  phone: string
  avatar: string
  email: string
  qrCode: string
  regTime: string
  token: string
  refreshToken: string
  expireTime: string
}

// 获取用户信息响应
export type UserInfoResponse = BaseResponse<UserInfo>
