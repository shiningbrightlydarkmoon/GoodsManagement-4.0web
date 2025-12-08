import request from '@/network/request'
import type { SpaceListResponse, SearchLogResponse, SearchResponse } from '@/types/space'
import type { PageParams } from '@/types/api'

/**
 * 获取空间列表 (根目录)
 */
export const getSpaceList = (params: PageParams): Promise<SpaceListResponse> => {
  console.log('📡 调用getSpaceList，参数:', params)
  return request({
    url: '/items/rooms',
    method: 'GET',
    params: {
      offset: params.page,
      limit: params.pageSize
    }
  })
}

/**
 * 搜索物品
 */
export const searchItems = (params: {
  offset: number
  limit: number
}, SearchData: {
  name: string
  type: number
  highPrice: number
  lowPrice: number
  dateType: number
  deleted: number
  hide: number
  labelld: number[]
}): Promise<SearchResponse> => {
  console.log(' 调用searchItems，参数:', params, SearchData)

  return request({
    url: 'items/search',
    method: 'POST',
    params: {
      offset: params.offset,
      limit: params.limit
    },
    data: {
      name: SearchData.name,
      type: SearchData.type || -1,
      highPrice: SearchData.highPrice || -1,
      lowPrice: SearchData.lowPrice || -1,
      dateType: SearchData.dateType || -1,
      deleted: SearchData.deleted || 0,
      hide: SearchData.hide || 0,
      labelld: SearchData.labelld || []
    }
  })
}

/**
 * 获取某空间下的所有空间或物品 （进入该空间）
 */
export const getSpaceItems = (itemId: number, params: PageParams): Promise<SpaceListResponse> => {
  console.log(`进入${itemId}空间`, params)
  return request({
    url: `/items/${itemId}/items`,
    method: 'GET',
    params: {
      offset: params.page,
      limit: params.pageSize
    }
  })
}
