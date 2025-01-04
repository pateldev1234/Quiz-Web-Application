
const mongoose = require('mongoose');
const Question = require('./Questions');

const AnswerSchema = new mongoose.Schema({
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question', 
        required: true,
    },
    selected_option: {
        type: Number,
        required: true,
        min: 0, 
        max: 3
    },
    is_correct: {
        type: Boolean,
        required: true,
        default: false 
    }
});

const Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer;


