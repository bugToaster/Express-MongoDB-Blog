const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String,
    // other tag fields
});

module.exports = mongoose.model('Category', categorySchema);
