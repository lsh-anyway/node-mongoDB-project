const Index = require('../app/controllers/index')
const User = require('../app/controllers/user')
const Movie = require('../app/controllers/movie')
const Comment = require('../app/controllers/comment')
const Category = require('../app/controllers/category')

module.exports = function (app) {
  // pre handle user
  app.use((req, res, next) => {
    
    var _user = req.session.user

    app.locals.user = _user

    return next()
  })

  // Index
  // index page
  app.get('/', Index.index)

  // User
  // signup
  app.post('/user/signup', User.signup)
  // signin
  app.post('/user/signin', User.signin)
  // showSignin
  app.get('/signin', User.showSignin)
  // showSignup
  app.get('/signup', User.showSignup)
  // logout
  app.get('/logout', User.logout)
  // userlist page
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)

  // Movie
  // detail page
  app.get('/movie/:id', Movie.detail)
  // admin page
  app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new)
  // admin update movie
  app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update)
  // admin post movie
  app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.savePoster,Movie.save)
  // list page
  app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
  // list delete movie
  app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del)
  
  // Comment
  app.post('/user/comment', User.signinRequired, Comment.save)

  // category
  app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new)
  app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save)
  app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)

  // results
  app.get('/results', Index.search)
}

