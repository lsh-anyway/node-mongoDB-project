const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

let CategorySchema = new Schema({
  name: String,
  movies: [{
    type: ObjectId,
    ref: 'Movie'
  }],
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// 每次存储数据时调用此方法
CategorySchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

CategorySchema.statics = {
  fetch(cb) {
    return this
    .find({})
    .sort('meta.updateAt')
    .exec(cb)
  },
  findById(id, cb) {
    return this
    .findOne({_id: id})
    .exec(cb)
  }
}

module.exports = CategorySchema