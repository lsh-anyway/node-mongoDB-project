const mongoose = require('mongoose')
const CategorySchema = require('../schemas/Category')

// 生成Category模型
let Category = mongoose.model(
  'Category',
  CategorySchema
)

module.exports = Category