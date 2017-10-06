const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

let MovieSchema = new Schema({
  doctor: String,
  title: String,
  language: String,
  country: String,
  summary: String,
  flash: String,
  poster: String,
  year: Number,
  pv: {
    type: Number,
    default: 0
  },
  category: {
    type: ObjectId,
    ref: 'Category'
  },
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
MovieSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  next()
})

MovieSchema.statics = {
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

module.exports = MovieSchema