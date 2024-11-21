// Import necessary modules and packages
const mongoose = require('mongoose');


// Define the quizSchema
const quizSchema = new mongoose.Schema({
    //Field for the name of the quiz
    name: {
        type: String,//Define the data type as a String
        required: true,//Indicate that the quizName as required
        set: (v) => v.toUpperCase(),
        unique: false
    },
    //Username of the person who created the quiz
    username: {
        type: String,
        required: true,
    },
    //Field for questions containing an array of objects(subdocuments)
    questions: {
        type: [
            {
                //Specify the question text(Question)
                questionText: {
                    type: String,//Define the data type as a String
                    required: [true, 'Question text is required'],
                    set: (v) => v.toUpperCase(),
                    trim: true,
                },
                //Specify the correct answer
                correctAnswer: {
                    type: String,//Define the datatype as a String
                    required: [true, 'Correct answer is required'],
                    trim: true,
                },
                //Specify the answer options or the questions
                options: {
                    type: [String],//Define the data type as an array of Strings
                    required: true,// Indicate that the correctAnswer is required
                    trim: true,
                    validate: [arrayLimit, '{PATH} must have exactly 3 options'],
                }
            }
        ],
        required: [true, 'Questions are required for the quiz'],
        validate: [arrayLimit5, '{PATH} must have exactly 5 questions'],
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
