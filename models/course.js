const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CourseSchema = new Schema({
    name: { type: String, require: true, max: 50 },
    image: { type: String, require: true, max: 100 },
    description: { type: String, require: true, max: 200 },
    detail: { type: String, require: true, max: 10000 },
    price: { type: Number, require: true },
    discount: { type: Number, require: true },
    ownerId: { type: String, require: true, max: 50 },
    categoryRootId: { type: Schema.Types.ObjectId, ref: 'Category' },
    categoryChildCId: { type: String, require: true, max: 50 }
});

module.exports = mongoose.model('Course', CoureseSchema);