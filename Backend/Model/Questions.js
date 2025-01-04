const mongoose = require("mongoose");
const UserDetail = require("./UserDetails");
const Quiz = require("./Quiz");


const QuestionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserDetail', 
        required: true,
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz', 
        required: true,
    },
    text: {
        type: String,
        required: true,
        trim: true, 
    },
    options: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return v.length === 4; 
            },
            message: 'There must be exactly 4 options.'
        }
    },
    correctOption: {
        type: Number, 
        required: true,
        min: 0, 
        max: 3
    }
});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;

