const Category = require('../models/category');
var Course = require('../models/course');
var rootId = "";
var childId = "";
var messageError = "";

function processChildCategory(childCategories) {
    var newChildCategories = [];
    if (childCategories) {
        let i = 0;
        for (let _i = 0; _i < childCategories.length; _i++) {
            if (childCategories[_i].status === 0) continue;
            var tmp = childCategories[_i];
            tmp['page'] = i + 1;
            i++;
            newChildCategories.push(tmp);
        }
    }
    return newChildCategories;
}

exports.list_root_categories = (req, res, next) => {
    if (req.session.userSession) {
        const page = Number(req.query.page) || Number(1);
        const tmpError = messageError;
        messageError = "";
        Category.find()
            .lean()
            .exec((err, listRootCategories) => {
                if (err) {
                    next(err);
                }
                var listCategoriesInOnePage = [],
                    page_number = [];
                for (let i = 0; i < listRootCategories.length; i++) {
                    if (Math.floor(i / 4) == page - 1) {
                        var data = listRootCategories[i];
                        data['page'] = i + 1;
                        data.categories = processChildCategory(data.categories);
                        listCategoriesInOnePage.push(data);
                    }
                    if (i / 4 == Math.floor(i / 4)) {
                        page_number.push((i / 4) + 1);
                    }
                }
                res.render('categories/list-root-categories', {
                    messageError: tmpError,
                    currentPage: page,
                    page_number: page_number,
                    listCategoriesInOnePage: listCategoriesInOnePage
                });
            });
    } else {
        res.redirect('/login');
    }

}

exports.edit_category = (req, res, next) => {
    if (req.session.userSession) {
        rootId = "";
        childId = "";
        rootId = req.query.rootid;
        if (req.query.childid) {
            childId = req.query.childid;
            Category.findById(rootId)
                .lean()
                .exec((err, rootCategory) => {
                    if (err) {
                        next(err);
                    }
                    for (let i = 0; i < rootCategory.categories.length; i++) {
                        if (rootCategory.categories[i]._id == childId) {
                            childCategory = rootCategory.categories[i];
                        }
                    }
                    res.render('categories/edit-category', {
                        name: childCategory.name
                    });
                });
        } else {
            Category.findById(rootId)
                .lean()
                .exec((err, rootCategory) => {
                    if (err) {
                        next(err);
                    }
                    res.render('categories/edit-category', {
                        name: rootCategory.name
                    });
                });
        }
    } else {
        res.redirect('/login');
    }

}

async function doesChildCategoryBelongToAnyCourse(categoryChildName) {
    var isError = false;
    await Course.find({ categoryChildName: categoryChildName }, (err, course) => {
        if (err) next(err);
        isError = true;
    });
    return isError;
}

exports.delete_category = (req, res, next) => {
    if (req.session.userSession) {
        messageError = "";
        rootId = "";
        childId = "";
        rootId = req.query.rootid;
        if (req.query.childid) {
            childId = req.query.childid;
        }
        var isError = false;
        Category.findById(rootId, async (err, rootCategory) => {
            if (err) {
                next(err);
            }
            if (childId === "") {
                for (let i = 0; i < rootCategory.categories.length; i++) {
                    if (await (doesChildCategoryBelongToAnyCourse(rootCategory.categories[i].categoryChildName)) === true) {
                        isError = true;
                    }
                }
                if (isError === false) {
                    rootCategory.status = 0;
                } else {
                    messageError = "DelCategory";
                }
            } else {
                var i;
                for (i = 0; i < rootCategory.categories.length; i++) {
                    if (rootCategory.categories[i]._id == childId) {
                        isError = await (doesChildCategoryBelongToAnyCourse(rootCategory.categories[i].categoryChildName));
                        break;
                    }
                }
                if (isError === false) {
                    var tmp = rootCategory.categories[i];
                    tmp.status = 0;
                    rootCategory.categories[i] = tmp;
                } else {
                    messageError = "DelCategory";
                }
            }
            rootCategory.save((err, result) => { });
            res.redirect('/list-root-categories');
        });
    } else {
        res.redirect('/login')
    }

}

exports.post_category = (req, res, next) => {
    const newName = req.body.name;
    var oldName;
    Category.findOne({ _id: rootId }, async (err, rootCategory) => {
        if (err) return next(err);
        if (childId) {
            for (let i = 0; i < rootCategory.categories.length; i++) {
                if (rootCategory.categories[i]._id == childId) {
                    const tmp = rootCategory.categories[i];
                    oldName = tmp.name;
                    tmp.name = newName;
                    rootCategory.categories[i] = tmp;
                }
            }
        } else {
            oldName = rootCategory.name;
            rootCategory.name = newName;
        }
        await rootCategory.save((err, result) => { });
        await Course.updateMany({ categoryChildName: oldName, categoryRootId: rootId }, { $set: { categoryChildName: newName } });
        res.redirect('/list-root-categories');
    });
}

exports.add_one_child_category = (req, res, next) => {
    const rootid = req.query.rootid;
    const name = req.body.name;
    Category.findById(rootid, (err, rootCategory) => {
        if (err) return next(err);
        rootCategory.categories.add();
    });
}

exports.add_one_root_category = (req, res, next) => {

}


exports.add_category = (req, res, next) => {
    if (req.session.userSession) {
        res.render('categories/add-category');
    } else {
        res.redirect('/login');
    }

}