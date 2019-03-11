const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bring in Article Model
let User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const { name, username, email, password, password2 } = req.body;


    req.checkBody('Name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);


    bcrypt.hash(password, 10).then((hash) => {

        const user = new User({
            username,
            name,
            email,
            password: hash
        });

        const promise = user.save();
        promise.then((data) => {
            req.flash('success', 'You are now registered and can log in');
            res.redirect('/users/login');
        }).catch((err) => {
            res.json(err);
        });
    });
});
// Login Form
router.get('/login', function (req, res) {
    res.render('login');
});

// Login Process
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// logout
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});
module.exports = router;