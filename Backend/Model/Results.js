
const mongoose = require('mongoose');

const UserDetail = require("./UserDetails");
const Quiz = require("./Quiz");
const Question = require('./Questions');


const ResultsSchema = new mongoose.Schema({
    quiz_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Quiz', 
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'UserDetail', 
        required: true,
    },
    score: {
        type: Number,
        required: true,
        min: 0, 
    },
    questions: [{
        question_id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Question', 
            required: true,
        },
        answer: {
            type: String, 
            required: true,
        }
    }]
});

const Results = mongoose.model('Results', ResultsSchema);

module.exports = Results;
