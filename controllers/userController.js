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