const User = require('../models/user');
var bcrypt = require('bcrypt');

exports.teacher_list = (req, res, next) => {
    let page = Number(req.query.page) || Number(1);
    User.find({ role: 1, status: 1 }).lean().skip(4 * page - 4).limit(4)
        .exec(function(err, list_teachers) {
            if (err) { return next(err) };
            User.count({ role: 1, status: 1 }, function(err, count) {
                let num = 1 + 4 * (page - 1);
                let num_order = [num];
                let page_number = [1];
                let page_size = Math.ceil(count / 4);
                for (let index = 2; index <= list_teachers.length + num - 1; index++) {
                    num_order.push(index);
                }
                for (let index = 2; index <= page_size; index++) {
                    page_number.push(index);
                }
                res.render('teachers/list-teachers', {
                    title: 'Danh sách giáo viên',
                    num_order: num_order,
                    page: page,
                    page_number: page_number,
                    teacher_list: list_teachers
                });
            })

        });
};

exports.add_teacher = (req, res, next) => {
    res.render('teachers/add-teacher');
};

exports.post_teacher = (req, res, next) => {
    let email = req.body.email;
    let name = req.body.name;
    let username = req.body.username;
    let password = '123456';
    User.findOne({ email: email }, function(err, user) {
        if (user !== null) {
            res.redirect('/list-teachers?error=' + encodeURIComponent('Email already exist'));
        } else {
            User.findOne({ username: username }, function(err, user) {
                if (user !== null) {
                    res.redirect('/list-teachers?error=' + encodeURIComponent('Username already exist'));
                } else {
                    var salt = bcrypt.genSaltSync(10);
                    user = new User({
                        email: email,
                        name: name,
                        username: username,
                        password: bcrypt.hashSync(password, salt),
                        role: 1,
                        status: 1
                    });
                    user.save(function(err, result) {
                        if (err) return next(err);
                    });
                    res.redirect('/list-teachers');
                }
            });
        }
    });
};

exports.detail_teacher = (req, res, next) => {
    const id = req.params.id;
    User.findById(id).lean().exec(function(err, user) {
        if (err) return next(err);
        console.log(user);
        res.render('teachers/edit-teacher', {
            teacher: user
        });
    });
}

exports.edit_teacher = (req, res, next) => {
    let email = req.body.email;
    let name = req.body.name;
    let username = req.body.username;
    console.log(username)
    User.findOne({ username: username }, function(err, user) {
        if (user !== null) {
            user.name = name;
            user.email = email;
            user.save(function(err, result) {});
            res.redirect('/list-teachers');
        } else {
            res.render('teachers/edit-teacher', { message: 'User can not found' });
        }
    });
}

exports.delete_teacher = (req, res, next) => {
    let id = req.params.id;
    User.findOne({ _id: id }, function(err, user) {
        if (err) return next(err);
        user.status = 0;
        console.log(user);
        user.save(function(err, result) {});
        res.redirect('/list-teachers');
    })
}