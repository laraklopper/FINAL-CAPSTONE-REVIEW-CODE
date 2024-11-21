// Import necessary modules and packages
const mongoose = require('mongoose'); // Import the Mongoose library

// Define the quizSchema 
const quizSchema = new mongoose.Schema({
    //Field for the name of the quiz
    name: {
        type: String,//Define the data type as a String
        required: true,//Indicate that the quizName as required
        set: (v) => v.toUpperCase(),// Automatically converts the quizName to uppercase before saving
        unique: false,//Specify the unique option as false
        trim: true,// Remove leading and trailing whitespace
    }, 
    //Username of the person who created the quiz
    username: {
        type: String,//Specify the data type as a string
        // Indicate that the username is required and add a custom error message
        required: [true, 'Username is required'],
    },
    //Field for questions containing an array of objects(subdocuments)
    questions: {
        type: [
            {
                //Specify the question text(Question)
                questionText: {
                    type: String,//Specify the data type as a String
                    required: [true, 'Question text is required'],//Indicate the question as required
                    set: (v) => v.toUpperCase(),// Automatically converts the question to uppercase before saving
                    trim: true,// Remove leading and trailing whitespace
                },
                //Specify the correct answer
                correctAnswer: {
                    type: String,//Specify the datatype as a String
                    required: [true, 'Correct answer is required'],//Indicate that the correct answer as required with a custom error message
                    trim: true,// Remove leading and trailing whitespace
                },
                //Specify the answer options or the questions
                options: {
                    type: [String],//Define the data type as an array of Strings
                    required: true,// Mark that the options is required
                    trim: true,// Remove leading and trailing whitespace
                    validate: [arrayLimit, '{PATH} must have exactly 3 options'],//Validate the number of options required
                }
            }
        ],        
        required: [true, 'Questions are required for the quiz'],//Mark the quizQuestion as required
        validate: [arrayLimit5, '{PATH} must have exactly 5 questions'],//Validate the number of questions required
    },   
}, { timestamps: true });
// Automatically adds createdAt and updatedAt fields


/* Custom validation function to ensure each 
question has exactly 3 options*/
function arrayLimit(val) {
    return val.length === 3; 
}

/* Custom validation function to ensure 
each quiz has exactly 5 questions*/
function arrayLimit5(val) {
    return val.length === 5;
}


// Export the mongoose model for 'Quiz' using the defined schema
module.exports = mongoose.model('Quiz', quizSchema);
