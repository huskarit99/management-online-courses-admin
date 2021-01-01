const User = require('../models/user');

exports.teacher_list = (req, res, next) => {
    User.find({ role: 1 }).lean().exec(function(err, list_teachers) {
        if (err) { return next(err) };
        console.log(list_teachers);
        res.render('teachers/list-teachers', {
            title: 'Danh sách giáo viên',
            teacher_list: list_teachers
        });
    });
};