const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

let UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  password: String,
  // 0: normal user
  // 1: verified user
  // 2: professional user

  // >10: admin
  // >50: super admin
  role: {
    type: Number,
    default: 0
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
UserSchema.pre('save', function (next) {
  var user = this

  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
})

UserSchema.methods = {
  comparePassword (_password, cb) {
    bcrypt.compare(_password, this.password, (err, isMatch) => {
      if (err) return cb(err)

      cb(null, isMatch)
    })
  }
}

UserSchema.statics = {
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

module.exports = UserSchema