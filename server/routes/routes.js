import express from 'express'
const router = express.Router();
import path from 'path'
import passport from 'passport'

import dbConfig from '../db'
import User from '../schema/user'
import BloodPressure from '../schema/bloodPressure'




// router.get('/callback', passport.authenticate('auth0', { failureRedirect: '/login' }), (req, res) => {
  
//   console.log('in callbakc')
//   res.redirect(req.session.returnTo || '/index');
// })


router.post('/register', (req, res) => {
  console.log('in register')
  User.findOne({
    clientID: req.body.clientID
  })
  .then( (user) => {
    if (user) {
      console.log('found user', user)
      user.getPressures()
      .then((bps) => {
        console.log('bps',bps)
        res.json({
          user,
          bps
        })
      })
    }

    console.log('regiestered: ', req.body)
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      clientID: req.body.clientID
    })

    newUser.save();
    res.json({
      user: newUser,
      bps: []
    })
  })
})

// router.get('/auth0', function (req, res) {
//   console.log('req');
//    console.log('user', req.user)
//   res.json({ status : 'auth0'});
// })

router.post('/login', (req, res) => {
  console.log('req', req.body.email)
  User.findOne({
    email: req.body.email,
  })
  .then( (user) => {
    console.log('user', user)
    if (!user) {
      console.log('no user found')
      // res.redirect('/register');
      throw new Error('user does not exist')
    }

    console.log('success')

    user.getPressures()
    .then((bps) => {
      console.log('got bps', bps)
      res.json({
        user,
        bps
      })
    })

    console.log('end of login')
  })
  .catch((err) => {
    console.log(err.message)

    res.status(400).json({
      status: false,
      message: err.message
    })
  })
})

router.post('/BP', (req, res) => {
  User.findOne({
    email: req.body.email,
    clientId: req.body.clientID
  })
  .then((user) => {
    if (!user) {
      throw new Error('no user to add BP to')
    }
    const newBP = new BloodPressure({
      date: req.body.bp.date || new Date(),
      systole: req.body.bp.systole,
      diastole: req.body.bp.diastole
    })

    newBP.save();
    console.log('new bp:', newBP)

    user.addBP(newBP)
    .then( (user) => {
      console.log('add BP complete')
      res.json(user)
    })
    .catch( (e) => {
      console.log('error in adding')
      res.send('error')
    })
  })
  .catch((err) => {
    console.log(err.message)

    res.status(400).json({
      status: false,
      message: err.message
    })
  })
})

router.get('/BP', (req, res) => {
  console.log('req.query', req.query)

  res.send('got a query')
})

router.get('/', (req, res) => {
  console.log('in index')
})

export default router
