var User = require('../models/user');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// show login view

exports.login = (req, res, next) => {
    res.render('users/login');
}

passport.use(new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'username',
        passwordField: 'password'
    },
    function(req, usernameField, passwordField, done) {
        User.findOne({ username: usernameField, role: 0 }, function(err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!bcrypt.compareSync(passwordField, user.password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            req.session.userSession = user;

            return done(null, user);
        });
    }));

passport.serializeUser((user, done) => done(null, user));

exports.user_login = passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }),
    function(req, res) {
        res.redirect('/');
    }
exports.user_info = (req, res, next) => {
    res.render('users/user-info');
}

exports.edit_info = (req, res, next) => {
    let email = req.body.email;
    let name = req.body.name;
    let username = req.body.username;
    User.findOne({ username: username }, function(err, user) {
        if (user !== null) {
            if (user.name !== name) {
                user.name = name;
                if (user.email !== email) {
                    User.findOne({ email: email }, function(err, user_email) {
                        if (user_email !== null) {
                            res.redirect('/user-info?error=' + encodeURIComponent('Email already exist'));
                        } else {
                            user.email = email;
                            req.session.userSession = user;
                            user.save(function(err, result) {});
                            res.redirect('/user-info');
                        }
                    });
                } else {
                    req.session.userSession = user;
                    user.save(function(err, result) {});
                    res.redirect('/user-info');
                }
            } else {
                if (user.email !== email) {
                    User.findOne({ email: email }, function(err, user_email) {
                        if (user_email !== null) {
                            res.redirect('/user-info?error=' + encodeURIComponent('Email already exist'));
                        } else {
                            user.email = email;
                            req.session.userSession = user;
                            user.save(function(err, result) {});
                            res.redirect('/user-info');
                        }
                    });
                } else {
                    res.redirect('/user-info');
                }
            }
        } else {
            res.redirect('/user-info?error=' + encodeURIComponent('User can not found'));
        }
    });
}