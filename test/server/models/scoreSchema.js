// Import necessary modules and packages
const mongoose = require('mongoose');// Import the Mongoose library

//Define the score schema
const scoreSchema = new mongoose.Schema({
    // Field for the name of the quiz taken
    name: {
        type: String,//Specify the data type as a string
        required: [true, 'Quiz name is required'],//Mark the field as required
        set: (v) => v.toUpperCase(),// Automatically convert to uppercase before saving
        trim: true,// Remove leading and trailing whitespace
    },
    //Field for username of the user who took the quiz
     username: {
        type: String,//Specify the data type as a 
        required: [true, 'username is required'],
         trim: true,// Remove leading and trailing whitespace
    },
    //Field for the score
    score: {
        type: Number,// Define the type as Number
        default: 0, // Set default value to 0
        required: true,//Mark the field as required 
        set: (v) => Math.floor(v),//Ensure the score is an integer
        /*Validate to ensure the score is a valid integer*/
        validate: {
            validator: Number.isInteger,// Custom validator to enforce integer values
            message: 'Score must be an integer',// Custom error message for validation failure
        },
    },
    //Field for the number of times the user has attempted the quiz
    attempts: {
        type: Number,  // Define the data type as Number
        default: 1,// Set the default value to 1 for the first attempt
        set: (v) => Math.floor(v),// Ensure attempts are an integer
    },
    //Field for the date of the current attempt
    date: {
        type: Date,//Define the dataType as a date
        default: Date.now, // Set the default to the current date and time
        required: true,// Mark the field as required
    },
}, { timestamps: true });// Add timestamps for createdAt and updatedAt fields


// Export the score model based on the scoreSchema
module.exports = mongoose.model('Score', scoreSchema);
