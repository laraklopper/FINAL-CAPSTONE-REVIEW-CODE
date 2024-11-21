// Import necessary modules and packages
// Import the Mongoose library
const mongoose = require('mongoose');

//Define the score schema
const scoreSchema = new mongoose.Schema({
    // Field for the name of the quiz taken
    name: {
        type: String,
        required: [true, 'Quiz name is required'],
        set: (v) => v.toUpperCase(),
        unique: false,
    },
    //Field for username of the user who took the quiz
     username: {
        type: String,
        required: [true, 'username is required'],
    },
    //Field for the score
    score: {
        type: Number,// Define the type as Number
        default: 0,
        required: true,
        //Ensure the score is an integer
        set: (v) => Math.floor(v),
        /*Validate to ensure the score is a valid integer*/
        validate: {
            validator: Number.isInteger,
            message: 'Score must be an integer',
        },
    },
    //Field for the number of times the user has attempted the quiz
    attempts: {
        type: Number,  
        default: 1,
        set: (v) => Math.floor(v),
    },
    //Field for the date of the current attempt
    date: {
        type: Date,//Define the dataType as a date
        default: Date.now,
        required: true,
    },
},);



// Export the score model based on the scoreSchema
module.exports = mongoose.model('Score', scoreSchema);
