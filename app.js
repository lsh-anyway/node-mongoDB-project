const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const serveStatic = require('serve-static')
const session = require('express-session')
const mongoose = require('mongoose')
const morgan = require('morgan')
const mongoStore = require('connect-mongo')(session)
const port = process.env.PORT || 3000
const app = express()
const dbUrl = 'mongodb://localhost/imooc'
const multipart = require('connect-multiparty')

mongoose.Promise = global.Promise
mongoose.connect(dbUrl,{useMongoClient: true})

// models loading
let models_path = __dirname + '/app/models'
let walk = function(path) {
  fs
    .readdirSync(path)
    .forEach(function(file) {
      let newPath = path + '/' + file
      let stat = fs.statSync(newPath)

      if (stat.isFile()) {
        if (/(.*)\.(js|coffee)/.test(file)) {
          require(newPath)
        }
      }
      else if (stat.isDirectory()) {
        walk(newPath)
      }
    })
}
walk(models_path)

app.set('views', './app/views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(multipart())
app.use(session({
  secret: 'imooc',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}))

if ('development' === app.get('env')) {
   app.set('showStackError', true)
   app.use(morgan(':method :url :status'))
   app.locals.pretty = true
   mongoose.set('debug', true)
}

require('./config/routes')(app)

app.listen(port)
app.locals.moment = require('moment')
app.use(serveStatic(path.join(__dirname, 'public')))

console.log('server started on port ' + port)
