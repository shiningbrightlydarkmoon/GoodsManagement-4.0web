import { BaseResponse, PageParams, PageResponse } from './api'

// 空间信息
export interface SpaceInfo {
  id: number
  privacy: number
  type: number
  name: string
  cover: string
  address: string | null
  date: string | null
  itemCover: string[] | null
  userId: number
  userName: string
  fatherId?: number
  layer?: number
  path?: PathNode[]
}

// 空间列表响应数据结构
export interface SpaceListData {
  current: number
  size: number
  effectiveSize: number
  total: number
  pages: number
  records: SpaceInfo[]
}

// 空间列表响应
export type SpaceListResponse = BaseResponse<SpaceListData>

// 路径节点
export interface PathNode {
  id : number
  name: string
  fatherId: number
  layer: number
}

// 搜索请求参数
export interface SearchParams extends PageParams {
  name: string
  type: string
  highPrice: number
  lowPrice: number
  dateType: number
  deleted: number
  hide: number
  labelld: number[]
}

// 搜索项
export interface SearchItem {
  id: number
  type: number
  privacy: string
  isTemporary: boolean
  name: string
  cover: string
  path: Array<{ id: number; name: string }>
  userId: number
}

// 搜索响应数据
export interface SearchData {
  current: number
  size: number
  effectiveSize: number
  total: number
  pages: number
  records: SearchItem[]
}

// 搜索响应
export type SearchResponse = BaseResponse<SearchData>

// 搜索日志项
export interface SearchLogItem {
  id: number
  privacy: string
  hide: string
  type: string
  name: string
  cover: string
  log?: LogInfo
}

// 日志信息
export interface LogInfo {
  id: number
  username: string
  content: string
  date: string
}

// 搜索响应数据
export interface SearchLogData {
  current: number
  size: number
  effectiveSize: number
  total: number
  pages: number
  records: SearchLogItem[]
}

// 搜索响应
export type SearchLogResponse = BaseResponse<SearchLogData>
