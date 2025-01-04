const mongoose = require("mongoose");

const UserDetailsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true, 
    },
    name: {
        type: String,
        required: true,
        trim: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Valid email regex
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[A-Z]).{8,}$/.test(v); 
                // At least one letter, one digit, one capital letter, and minimum 8 characters
            },
            message: 'Password must contain at least one letter, one number, and one capital letter, and be at least 8 characters long.'
        }
    }
});


const UserDetail = new mongoose.model("UserDetail",UserDetailsSchema);

module.exports = UserDetail;