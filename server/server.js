import express from 'express'
import mongoose from 'mongoose'
// import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import path from 'path'

// routes
import routes from './routes/routes.js'
// auth
import session from 'express-session'
import jwt from 'express-jwt'
import dotenv from 'dotenv'
dotenv.config();

import passport from 'passport'
import Auth0Strategy from 'passport-auth0'
import setup, {isAuthenticated} from './passportConfig.js'


// connect db
import connectMongo from 'connect-mongo'
const MongoStore = connectMongo(session);

// import db + schemas
import dbConfig from './db'
import User from './schema/user'
import BloodPressure from './schema/bloodPressure'


// connect mongoDB
mongoose.connect(dbConfig.url)
mongoose.Promise = Promise

// start server
const app = express()
const port = process.env.PORT || 3003

// set dist
// app.use(express.static('dist'));

// start a session for the user, saved in mongo 

app.use(session({
  store: new MongoStore({
    url: dbConfig.url
  }),
  secret: dbConfig.secret,
  resave: false,
  saveUninitialized: false
}))

// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

// auth
// var authenticate = jwt({
//   secret: process.env.CLIENT_SECRET,
//   audience: process.env.CLIENT_ID
// });
// setup(passport);

var strategy = new Auth0Strategy({
    domain:       process.env.DOMAIN,
    clientID:     process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL:  process.env.CALLBACK_URL
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    console.log('in passport')
    console.log('in passport')
    console.log('in passport')
    console.log('in passport')
    console.log('in passport')
    console.log('in passport')
    console.log('in passport')
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

passport.use(strategy);

passport.serializeUser(function(user, done) {
  console.log('in serialize', user)
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('in deserialize', user)
  done(null, user);
});

// add to middleware
app.use(passport.initialize());
app.use(passport.session());
// app.use(isAuthenticated);


// allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3002')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,HEAD,DELETE,OPTIONS'),
  // res.header('Access-Control-Allow-Headers', 'Content-Type', 'Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Authorization, Access-Control-Request-Method, Access-Control-Request-Headers"),

  next()
})

var isLoggedIn = function(req, res, next) {
  console.log('is in auth')
  if (req.isAuthenticated()) {
    console.log('user', req.user)
    return next();
  } else {
    res.redirect('/login')
  }
}

// app.get('/login', (req, res) => {
//   console.log('is in login')
//   res.sendFile(path.join(__dirname, '../dist', 'login.html'))
// });
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'login.html'))
});
app.get('/login.bundle.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'login.bundle.js'))
});

app.get('/callback', passport.authenticate('auth0', {}), (req, res) => {
  console.log(req.url)
  console.log('in callback, loggined in')
  res.redirect('/');
})

// app.use(express.static('dist'))
app.use('/', isLoggedIn, express.static('dist'), routes)

// app.get('/', (req, res) => {
//   console.log(' in homepage')
// })


app.get('/callback', passport.authenticate('auth0', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(req.session.returnTo || '/index');
})

// app.get('/index', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist', 'index.html'))
// })

app.get('*', (req, res) => {
  res.redirect('/')
})

// app.post('/register', (req, res) => {
//   console.log('in register')
//   User.findOne({
//     clientID: req.body.clientID
//   })
//   .then( (user) => {
//     if (user) {
//       console.log('found user', user)
//       user.getPressures()
//       .then((bps) => {
//         console.log('bps',bps)
//         res.json({
//           user,
//           bps
//         })
//       })
//     }

//     console.log('regiestered: ', req.body)
//     const newUser = new User({
//       username: req.body.username,
//       email: req.body.email,
//       clientID: req.body.clientID
//     })

//     newUser.save();
//     res.json({
//       user: newUser,
//       bps: []
//     })
//   })
// })

// // app.get('/auth0', function (req, res) {
// //   console.log('req');
// //    console.log('user', req.user)
// //   res.json({ status : 'auth0'});
// // })

// app.post('/login', (req, res) => {
//   console.log('req', req.body.email)
//   User.findOne({
//     email: req.body.email,
//   })
//   .then( (user) => {
//     console.log('user', user)
//     if (!user) {
//       console.log('no user found')
//       // res.redirect('/register');
//       throw new Error('user does not exist')
//     }

//     console.log('success')

//     user.getPressures()
//     .then((bps) => {
//       console.log('got bps', bps)
//       res.json({
//         user,
//         bps
//       })
//     })

//     console.log('end of login')
//   })
//   .catch((err) => {
//     console.log(err.message)

//     res.status(400).json({
//       status: false,
//       message: err.message
//     })
//   })
// })

// app.post('/BP', (req, res) => {
//   User.findOne({
//     email: req.body.email,
//     clientId: req.body.clientID
//   })
//   .then((user) => {
//     if (!user) {
//       throw new Error('no user to add BP to')
//     }
//     const newBP = new BloodPressure({
//       date: req.body.bp.date || new Date(),
//       systole: req.body.bp.systole,
//       diastole: req.body.bp.diastole
//     })

//     newBP.save();
//     console.log('new bp:', newBP)

//     user.addBP(newBP)
//     .then( (user) => {
//       console.log('add BP complete')
//       res.json(user)
//     })
//     .catch( (e) => {
//       console.log('error in adding')
//       res.send('error')
//     })
//   })
//   .catch((err) => {
//     console.log(err.message)

//     res.status(400).json({
//       status: false,
//       message: err.message
//     })
//   })
// })

// app.get('/BP', (req, res) => {
//   console.log('req.query', req.query)

//   res.send('got a query')
// })



app.listen(port, () => {
  console.log(`Server listening on port ${port}!`)
})
