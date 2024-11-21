// Import necessary modules and packages
// Import the Mongoose library
const mongoose = require('mongoose');

// Define the user schema
let userSchema = new mongoose.Schema({
    // Field for username
    username:{
        type: String,//Indicate data type as a string
        required: [true, 'Username is required'],//Mark the username as required
        unique: true,// Ensure the username is unique
        // set: (v) => v.toLowerCase(),
    },
    // Field for user email
    email:{
        type: String,//Indicate data type as a string
        required: [true, 'User email is required'],
        unique: true,// Ensures no duplicate emails in the database
        // Automatically converts the email to lowercase before saving
        set: (v) => v.toLowerCase(),
    },
    //Field for user date of birth
    dateOfBirth: {
        type: Date,//Indicate data type as date
        required: [true, 'date of birth is required'],//Mark the date of birth as required
    },
    //Optional field for admin status
    admin: {
        type: Boolean,//Indicate data type as a boolean     
        required: false,
    },
    //Field for user password
    password: {
        type: String, //Indicate data type as a string
        required: [true, 'User password is required'],//Mark the password as required
    }
}, { timestamps: true });
/* Add timestamps for each document, 
including 'createdAt' and 'updatedAt' fields*/

// Export the users model based on the userSchema
module.exports = mongoose.model('User', userSchema);
