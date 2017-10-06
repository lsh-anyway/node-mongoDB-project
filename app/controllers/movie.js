const Movie = require('../models/movie')
const Category = require('../models/category')
const Comment = require('../models/comment')
const _ = require('underscore')
const fs = require('fs')
const path = require('path')

// detail page
exports.detail = (req,res) => {
  let id = req.params.id
    
  Movie.update({_id: id}, {$inc: {pv: 1}}, (err) => {
    if (err) {
      console.log(err)
    }
  })

  Movie.findById(id, (err, movie) => {
    Comment
      .find({movie: id})
      .populate('from', 'name')
      .populate('reply.from reply.to', 'name')
      .exec((err, comments) => {
        console.log(comments)
        res.render('detail', {
          title: 'imooc' + movie.title,
          movie,
          comments
        })
      })
  })
}

// admin page
exports.new = (req,res) => {
  Category.find({}, (err, categories) => {
    res.render('admin', {
      title: 'imooc后台录入页',
      categories,
      movie: {}
    })
  })
}

// admin update movie
exports.update = (req, res) => {
  let id = req.params.id

  if (id) {
    Movie.findById(id, (err, movie) => {
      Category.find({}, (err, categories) => {
        res.render('admin', {
          title: 'imooc 后台更新页',
          movie,
          categories
        })
      })
    })
  }
}

// admin poster
exports.savePoster = (req, res, next) => {
  let posterData = req.files.uploadPoster
  let filePath = posterData.path
  let originalFilename = posterData.originalFilename

  if (originalFilename) {
    fs.readFile(filePath, (err, data) => {
      let timestamp = Date.now()
      let type = posterData.type.split('/')[1]
      let poster = timestamp + '.' + type
      let newPath = path.join(__dirname, '../../', '/public/upload/' + poster)

      fs.writeFile(newPath, data, (err) => {
        req.poster = poster
        next()
      })
    })
  }
  else {
    next()
  }
}

// admin post movie
exports.save = (req, res) => {
  let id = req.body.movie._id
  let movieObj = req.body.movie
  let _movie

  if (req.poster) {
    movieObj.poster = req.poster
  }

  if (id) {
    Movie.findById(id, (err, movie) => {
      if (err) {
        console.log(err)
      }

      _movie = _.extend(movie, movieObj)

      _movie.save((err, movie) => {
        if (err) {
          console.log(err)
        }
        
        res.redirect(`/movie/${movie._id}`)
      })
    })
  } else {
    _movie = new Movie(movieObj)

    let categoryId = movieObj.category
    let categoryName = movieObj.categoryName
    
    _movie.save((err, movie) => {
      if (err) {
        console.log(err)
      }
      if (categoryId) {
        Category.findById(categoryId, function(err, category) {
          category.movies.push(movie._id)

          category.save(function(err, category) {
            res.redirect(`/movie/${movie._id}`)
          })
        })
      }
      else if (categoryName) {
        let category = new Category({
          name: categoryName,
          movies: [movie._id]
        })

        category.save((err, category) => {
          movie.category = category._id
          movie.save((err, movie) => {
            res.redirect(`/movie/${movie._id}`)
          })
        })
      }
    })
  }
}

// list page
exports.list = (req,res) => {
  Movie.fetch((err, movies) => {
    if (err) {
      console.log(err)
    }

    res.render('list', {
      title: 'imooc 列表页',
      movies
    })
  })
}

// list delete movie
exports.del = (req, res) => {
  let id = req.query.id

  if (id) {
    Movie.remove({_id: id}, (err, movie) => {
      if (err) {
        console.log(err)
      }else{
        res.json({success: 1})
      }
    })
  }
}