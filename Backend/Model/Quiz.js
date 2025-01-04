const mongoose = require('mongoose');
const UserDetail = require("./UserDetails");

const QuizSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetail', 
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 3, 
    }
});


const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;

