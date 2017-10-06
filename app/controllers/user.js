const User = require('../models/user')

// signup
// showSignup
exports.showSignup = (req, res) => {
  res.render('signup', {
    title: '注册页面'
  })
}

exports.signup = (req, res) => {
  var _user = req.body.user

  User.findOne({name: _user.name}, function (err, user) {
    if (err) {
      console.log(err)
    }

    if (user) {
      return res.redirect('/signin')
    }
    else {
      var user = new User(_user)
      
      user.save((err, user) => {
        if (err) {
          console.log(err)
        }

        res.redirect('/')
      })
    }
  })
  
}

// signin
// showSignin
exports.showSignin = (req,res) => {
  res.render('signin', {
    title: '登录页面'
  })
}

exports.signin = (req, res) => {
  var _user = req.body.user
  var name = _user.name
  var password = _user.password

  User.findOne({name}, (err, user) => {
    if (err) {
      console.log(err)
    }

    if (!user) {
      return res.redirect('/signup')
    }

    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        console.log(err)
      }

      if (isMatch) {
        req.session.user = user

        return res.redirect('/')
      }
      else {
        console.log('Password is no matched')
        return res.redirect('/signin')
      }
    })
  })
}



// logout
exports.logout = (req, res) => {
  delete req.session.user
  // delete app.locals.user

  res.redirect('/')
}

// userlist page
exports.list = (req, res) => {
  User.fetch((err, users) => {
    if (err) {
      console.log(err)
    }

    res.render('userlist', {
      title: 'imooc 用户列表页',
      users
    })
  })
}

// midware for user
exports.signinRequired = (req, res, next) => {
  var user = req.session.user

  if (!user) {
    return res.redirect('/signin')
  }

  next()
}

exports.adminRequired = (req, res, next) => {
  var user = req.session.user

  if (user.role <= 10) {
    return res.redirect('/signin')
  }

  next()
}