// Vercel Serverless Function 入口
// 将 Express app 包装为 Vercel serverless handler

// 设置 Vercel 环境标识
process.env.VERCEL = '1'

const app = require('../backend/src/index.js')

module.exports = app
