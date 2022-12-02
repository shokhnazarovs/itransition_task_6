const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesSchema = new Schema({
    sender: {
        type: String,
        required: true,
        trim: true
    },
    recipient: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        trim: true,
        default: ''
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    time: Date
});

const Messages = mongoose.model('Messages', MessagesSchema);
module.exports = Messages;