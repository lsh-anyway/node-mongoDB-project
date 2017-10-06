const mongoose = require('mongoose')
const UserSchema = require('../schemas/user')

// 生成User模型
let User = mongoose.model(
  'User',
  UserSchema
)

module.exports = User