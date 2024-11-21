// Import necessary modules and packages
const express = require('express');// Import Express to handle routing
const router = express.Router();// Create a new router object
const mongoose = require('mongoose');// Import Mongoose for MongoDB interaction
//Schemas
const Quiz = require('../models/quizModel');// Import the Quiz model
// const Score = require('../models/scoreSchema');//Import the Score model
// const User = require('../models/userSchema');//Import the User model
//Custom middleware
const { checkJwtToken } = require('./middleware');//Import Custom middleware

//=======SETUP MIDDLEWARE===========
// Setup middleware
mongoose.set('strictPopulate', false); // Disable strict population checks in Mongoose

//===================ROUTES====================

//------------------GET---------------
//Route to GET a specific quiz using the quiz Id
router.get('/findQuiz/:id', checkJwtToken, async (req, res) => {
    try {
        const { id } = req.params;// Retrieve the quiz ID from the request parameters
       
        /*Conditional rendering to check if the quizId 
        is a valid MongoDB ObjectId*/
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            // Respond with a 400 Bad Request status and an error message
            return res.status(400).json({success: false,
                message: 'Invalid or missing quiz ID'
            });
        }
        // Find the quiz by its ID and populate the 'userId' field with the 'username'
        // Populate the 'userId' field with the associated 'username' from the User collection
        const quiz = await Quiz.findById(id)
            .populate('userId', 'username')// Populate the userId field with the username
            .exec()//Execute the query
        
        //Conditional rendering to check if the quiz is found
        if (!quiz) {
            // If the quiz is not found, respond with a 404 Not Found status and an error message
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json(quiz); // If the quiz is found, send it as the JSON response
        console.log(quiz);// Log the quiz in the console for debugging purposes
    }
    catch (error) {
        console.error('Error finding quiz:', error.message); // Log an error message in the console for debugging purposes
        res.status(500).json({ message: error.message });// Respond with a 500 Internal Server Error status and the error message
    }
});

// Route to fetch all the quizzes from the database
router.get('/findQuizzes',  async (req, res) => {
    try {  
        // Query the database for all quizzes
        // Populate the 'userId' field with the 'username' from the User collection
        const quizzes = await Quiz.find({})
        .populate('userId', 'username')// Populate the 'userId' field with 'username'
            .exec();  //Execute the query

            res.status(200).json({ success: true, quizList: quizzes});
        console.log(quizzes); // Log the quizzes for debugging purposes
    } 
    catch (error) 
    {//Error handling
        console.error('Error finding quizzes:', error.message);// Log an error message in the console for debugging purposes
        res.status(500).json(// Send 500(Internal server error) status code and error message in JSON response
            { message: error.message });
    }
});


//------------POST--------------
//Route to add new quiz
router.post('/addQuiz',  async (req, res) => {
    console.log(req.body);//Log the request body in the console for debugging purpose
    const { name, username, questions } = req.body;// Extract the quiz details from the request body

    // Conditional rendering to check that the quiz has a name and exactly 5 questions
    if (!name || !questions || questions.length !== 5) {
        // Respond with a 400 Bad Request status and an error message
        return res.status(400).json({message: 'Quiz name and exactly 5 questions are required'});
    }

    try {           
        // Conditional rendering to check if a quiz with the same name already exists
        const existingQuiz = await Quiz.findOne({ name });

        if (existingQuiz) {
            //Return a 400(Bad request) response status if the quiz name already exists
            return res.status(400).json({message: 'Quiz name already exists'})
        }        
        
        // Create a new Quiz document with the provided details
        const newQuiz = new Quiz({
            name ,         // The name of the quiz
            username,     //Username of the user who created the quiz
            questions,    // Array of questions for the quiz          
        });

    // Save the new quiz to the database
        const savedQuiz = await newQuiz.save();
        
        res.status(201).json(savedQuiz);// Send the saved quiz as a response with a 201 Created status
        console.log(savedQuiz);;//Log the saved quiz in the console for debugging purposes
    } 
    catch (error) {
        console.error('Error occurred while adding new quiz:', error);//Log an error message in the console for debugging purposes
        res.status(500).json({ error: error.message });// Respond with a 500 Internal Server Error status and the error message
    }
})


//-------------------PUT--------------------------
// Route to edit a quiz
router.put('/editQuiz/:id',  checkJwtToken, async (req, res) => {   
    console.log(req.body);//Log the request body in the console for debugging purposes       
    const { id } = req.params; // Extract quiz ID from the request parameters
    const { name, questions ,username} = req.body;// Extract name and questions from the request body

 
    try {    
        const quiz = await Quiz.findById(id)// Find the quiz by ID


        //Conditional rendering to check that the quiz exists
        if (!quiz) {
            // If the quiz doesn't exist, return a 404 response
            return res.status(404).json({ message: 'Quiz not found' });
        }

        /*Conditional rendering to check if the user editing 
        the quiz is the user who created the quiz*/
        if (username !== quiz.username) {
            console.error('Unauthorised');//Log an error message in the console for debugging purposes
            return res.status(403).json({ message: 'Access denied. You do not have permission edit to this quiz.' })
        }

        
        //Create the updated quiz object
        const updatedQuiz = {}
   
        //Conditional rendering to check if the name is provided
        if (name) {
            // Only update the name if provided
           updatedQuiz.name =name 
        }
        // Conditional rendering to check that the questions are properly provided
        if (questions && Array.isArray(questions) && questions.length === 5) {
            updatedQuiz.questions = questions
        } else {
            // Return a 400 (Bad Request)
            return res.status(400).json({message: 'No valid fields to update'})
        }

        // Update the quiz
        const editedQuiz = await Quiz.findByIdAndUpdate(
           id, // ID of the quiz to update
            {$set : updatedQuiz},
            { new: true}// Return the updated document
        );
 
 
        // Respond with the updated quiz 
         res.status(200).json({ success: true, editedQuiz});
        console.log(editedQuiz);//Log the updated quiz in the console for debugging purposes      
           }   
    catch (error) {
        console.error('Error editing quiz:', error);//Log an error message in the console for debugging purposes
        // Return a 500 (Internal Server Error )error response with the error message
        return res.status(500).json({success: false, error: error.message });
    };
});


//--------DELETE---------------
// Route to delete a quiz
router.delete('/deleteQuiz/:id' ,checkJwtToken,  async (req, res) => {
    const { id } = req.params;// Extract quiz ID from the request parameters
    
    try {
        // Find the quiz by its ID and delete it from the database
        const deletedQuiz = await Quiz.findByIdAndDelete(id);
        

      //Conditional rendering to check if the quiz is found
        if (!deletedQuiz) {
            /* If the quiz is not found, respond with a 
            404 (Not Found) status and an error message*/
            return res.status(404).json({ message: 'Quiz not found' });
        }

        
        console.log('Deleted Quiz:', deletedQuiz);// Log the deleted quiz in the console for debugging purposes
        res.status(200).json({ success: true, message: 'Quiz successfully deleted' });//Return a 200 OK status with a JSON object containing a success message
    } 
    catch (error) {
        //Error handling
        console.error('Error deleting quiz:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ success: false, error: error.message });// Respond with a 500 (Internal Server Error) status
    }
});



// Export the router to be used in other parts of the application
module.exports = router; 