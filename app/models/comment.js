const mongoose = require('mongoose')
const CommentSchema = require('../schemas/Comment')

// 生成Comment模型
let Comment = mongoose.model(
  'Comment',
  CommentSchema
)

module.exports = Comment