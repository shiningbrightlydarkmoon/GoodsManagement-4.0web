import axios from 'axios'
import { ElMessage } from 'element-plus'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import router from '@/router'

// 后端提供的默认 RefreshToken (当用户未登录或无缓存时使用)
const DEFAULT_REFRESH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGl0eSI6ImRlZXJ1bjk5dDlhZSIsImlkIjoiMTEiLCJleHAiOjE3NTQ0NjQ3Mzd9.XISPdae2LphLW79s2rMpQ1fmEs5-zzyVNtkfg9SgiwY'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000, // 设置超时时间为 10s
})

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 1. 获取 Token
    const token = localStorage.getItem('token')

    // 2. 获取 RefreshToken logic:
    // 优先使用登录后保存的个人 refreshToken，如果没有，则使用后端给的默认值
    const localRefreshToken = localStorage.getItem('refreshToken')
    const refreshToken = localRefreshToken || DEFAULT_REFRESH_TOKEN

    // 3. 获取设备 ID (UUID)
    // 注意：在 login.ts 中你存储的 key 是 'deviceIdentity'，这里必须保持一致
    // 我们优先取 'deviceIdentity'，同时也兼容旧的 'uuid' key
    const uuid = localStorage.getItem('deviceIdentity') || localStorage.getItem('uuid') || 'unknown_device'

    // 4. 设置请求头
    if (config.headers) {
      if (token) {
        config.headers['token'] = token
      }

      // 始终带上 refreshToken
      config.headers['refreshToken'] = refreshToken

      if (uuid) {
        config.headers['uuid'] = uuid
      }

      // 设置默认 Content-Type
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json'
      }
    }

    // 开发调试：打印请求信息 (生产环境可注释掉)
    // console.log(`📡 [Request] ${config.method?.toUpperCase()} ${config.url}`, {
    //   headers: config.headers,
    //   params: config.params,
    //   data: config.data
    // })

    return config
  },
  (error) => {
    console.error('❌ [Request Error]:', error)
    return Promise.reject(error)
  }
)


// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data

    // 调试日志
    // console.log(`✅ [Response] ${response.config.url}`, res)

    // 业务逻辑判断：假设 code === 200 为成功
    if (res.code === 200) {
      return res
    } else {
      // 业务错误 (如密码错误等)，弹出提示
      ElMessage.error(res.msg || '请求异常')
      return Promise.reject(new Error(res.msg || 'Error'))
    }
  },
  (error) => {
    console.error('❌ [Response Error Detail]:', error)

    // 处理 HTTP 状态码错误
    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 401:
          // Token 过期或未授权
          ElMessage.error('登录已过期，请重新登录')
          // 清除所有本地缓存
          localStorage.clear()
          // 强制跳转回登录页
          router.push('/webLogin')
          break
        case 403:
          ElMessage.error('拒绝访问：权限不足')
          break
        case 404:
          ElMessage.error('请求资源不存在 (404)')
          break
        case 405:
          ElMessage.error('请求方法不允许 (405)')
          break
        case 500:
          ElMessage.error('服务器内部错误 (500)')
          break
        case 502:
          ElMessage.error('网关错误 (502)')
          break
        default:
          ElMessage.error(`连接错误: ${error.response.statusText || '未知错误'}`)
      }
    } else if (error.message.includes('timeout')) {
      ElMessage.error('请求超时，请检查网络')
    } else {
      ElMessage.error('网络连接失败，请检查网络')
    }

    return Promise.reject(error)
  }
)

export default service
