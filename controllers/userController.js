var User = require('../models/user');
var bcrypt = require('bcrypt');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// show login view

exports.index = (req, res, next) => {
    if (req.session.userSession) {
        res.render('users/index')
    } else {
        res.render('users/login');
    }
}
exports.login = (req, res, next) => {
    if (req.session.userSession) {
        res.render('users/index')
    } else {
        res.render('users/login');
    }

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

exports.change_password = (req, res, next) => {
    let oldpassword = req.body.oldpassword;
    let newpassword = req.body.newpassword;
    let confirmpassword = req.body.confirmpassword;
    User.findOne({ username: req.session.userSession.username }, function(err, user) {
        if (err) { return done(err); }
        if (user !== null) {
            var hash = user.password;
            if (bcrypt.compareSync(oldpassword, hash)) {
                if (oldpassword != newpassword) {
                    if (newpassword == confirmpassword) {
                        user.password = bcrypt.hashSync(newpassword, bcrypt.genSaltSync(10));
                        user.save(function(err, result) {});
                        res.redirect('/user-info');
                    } else {
                        res.redirect('/user-info?error=' + encodeURIComponent('Wrong new password'));
                    }
                } else {
                    res.redirect('/user-info?error=' + encodeURIComponent('Password not change'));
                }

            } else {
                res.redirect('/user-info?error=' + encodeURIComponent('Wrong old password'));
            }
        } else {
            res.redirect('/user-info?error=' + encodeURIComponent('User can not found'));
        }
    });
}
exports.logout = (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
}