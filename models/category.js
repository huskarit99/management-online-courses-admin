const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CategorySchema = new Schema(
    {
        name: { type: String, require: true, max: 50 },
        categories: [{
            name: { type: String, require: true, max: 50 },
            status: { type: Number, require: true }
        }],
        status: { type: Number, require: true }
    });

module.exports = mongoose.model('Category', CategorySchema);