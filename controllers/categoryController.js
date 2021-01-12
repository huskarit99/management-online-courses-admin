const Category = require('../models/category');
const Course = require('../models/course');
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
    const page = Number(req.query.page) || Number(1);
    const tmpError = messageError;
    messageError = "";
    Category.find({ status: 1 })
        .lean()
        .exec((err, listRootCategories) => {
            if (err) {
                next(err);
            }
            var listCategoriesInOnePage = [], page_number = [];
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
}

exports.edit_category = (req, res, next) => {
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
}

exports.post_category = (req, res, next) => {
    const newName = req.body.name;
    Category.findOne({ _id: rootId }, (err, rootCategory) => {
        if (err) {
            next(err);
        }
        if (childId) {
            for (let i = 0; i < rootCategory.categories.length; i++) {
                if (rootCategory.categories[i]._id == childId) {
                    const tmp = rootCategory.categories[i];
                    tmp.name = newName;
                    rootCategory.categories[i] = tmp;
                }
            }
        } else {
            rootCategory.name = newName;
        }
        rootCategory.save((err, result) => { });
        res.redirect('/list-root-categories');
    });
}


exports.add_category = (req, res, next) => {
    res.render('categories/add-category');
}