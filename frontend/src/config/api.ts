/**
 * API 配置
 * 使用环境变量配置 API 地址，支持开发和生产环境
 */

// 从环境变量获取 API 地址，如果没有配置则使用默认值
const getApiBase = () => {
  // Vite 环境变量在构建时注入
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL
  }
  
  // 开发环境默认值
  if (import.meta.env.DEV) {
    return 'http://localhost:3001/api'
  }
  
  // 生产环境使用相对路径（通过 nginx 代理）
  return '/api'
}

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL
  }
  
  if (import.meta.env.DEV) {
    return 'http://localhost:3001'
  }
  
  // 生产环境使用当前域名
  return window.location.origin
}

export const API_BASE = getApiBase()
export const SOCKET_URL = getSocketUrl()
export const COLLABORATE_API_BASE = `${API_BASE}/collaborate`

console.log('🔧 API 配置:', {
  API_BASE,
  SOCKET_URL,
  COLLABORATE_API_BASE,
  mode: import.meta.env.MODE
})

