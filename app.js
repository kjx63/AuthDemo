 const express = require('express');
 const mongoose = require('mongoose');
 const passport = require('passport');
 const bodyParser = require('body-parser');
 const LocalStrategy = require('passport-local');
 require('dotenv').config();
 //  const passportLocalMongoose = require('passport-local-mongoose');

 const User = require('./models/user');

 const app = express();



 mongoose.connect(`mongodb+srv://KenjiUeyama:${process.env.MONGODB_PASSWORD}@cluster0-fy69z.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() =>
     console.log('Connected to DB')).catch(err => console.log(err));

 app.set('view engine', 'ejs');
 app.use(bodyParser.urlencoded({ extended: true }));
 app.use(require('express-session')({
     secret: "Juke is the best and cutest dog in the world",
     resave: false,
     saveUninitialized: false
 }));
 app.use(passport.initialize());
 app.use(passport.session());

 passport.use(new LocalStrategy(User.authenticate()));
 passport.serializeUser(User.serializeUser());
 passport.deserializeUser(User.deserializeUser());



 app.get('/', (req, res) => {
     res.render('home');
 });

 app.get('/secret', isLoggedIn, (req, res) => {
     res.render('secret');
 });

 // Auth Routes

 //  show register form
 app.get('/register', (req, res) => {
     res.render('register');
 });

 app.post('/register', (req, res) => {
     const username = req.body.username;
     const password = req.body.password;
     // password not stored in the database (out of the User)
     User.register(new User({ username: username }), password, (err, user) => {
         if (err) {
             console.log(err);
             return res.render('register');
         }
         passport.authenticate('local')(req, res, () => {
             res.redirect('/secret');
         });
     });
 });

 // LOGIN ROUTE

 app.get('/login', (req, res) => {
     res.render('login');
 })
 app.post('/login', passport.authenticate('local', {
     successRedirect: '/secret',
     failureRedirect: '/login'

 }), (req, res) => {});


 app.get('/logout', (req, res) => {
     req.logout();
     res.redirect('/');
 });

 function isLoggedIn(req, res, next) {
     if (req.isAuthenticated()) {
         return next();
     }
     res.redirect('/login');
 }

 app.listen(3000, () => {
     console.log('Server Listening on Port 3000');
 });