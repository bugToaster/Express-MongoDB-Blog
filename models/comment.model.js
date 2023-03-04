const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: 'Article'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);
