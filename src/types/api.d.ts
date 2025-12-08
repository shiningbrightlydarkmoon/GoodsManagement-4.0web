// 基础香型接口
export interface BaseResponse<T> {
  msg: string
  code: number
  message: string
  data: T
}

// 分页参数
export interface PageParams {
  page: number
  pageSize: number
}

// 分页响应
export interface PageResponse<T> {
  total: number
  items: T[]
}
