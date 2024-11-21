// Import necessary modules and packages
const express = require('express'); // Import Express to handle routing
const router = express.Router();  // Create a new router object
const mongoose = require('mongoose');// Import Mongoose for MongoDB interaction
// Import schemas
const Score = require('../models/scoreSchema');//Import the Score model
const User = require('../models/userSchema');// Import the User model
const Quiz = require('../models/quizModel');// Import the Quiz model
const { checkJwtToken } = require('./middleware');//Import Custom middleware

//=============ROUTES=====================
//-------------GET-----------------
// Route to get all quiz scores//
router.get('/findScores',  async (req, res) => {
    try {
        const { username } = req.query;//Fetch the username from the query parameters

        //Conditional rendering to check if the username is a string
        if (username && typeof username !== 'string') {
            // Return 400 (Bad Request) error if the username is invalid
            return res.status(400).json({success: false, message: 'Username must be a string'})
        }

        // Fetch all quiz names from the database to check for existing quizzes
        let quizNames = await Quiz.find({}).select('name').exec()
        let existingQuizNames = quizNames.map(q => q.name); // Extract  quiz names into an array

        // Fetch all usernames from the database to check for existing users
        let userNames = await User.find({}).select('username').exec()
        let existingUsernames = userNames.map(u => u.username)//Extract usernames into an array

        /* Remove any Score documents where the quiz name or username no longer exists in the Quiz or User collection*/
        await Score.deleteMany({ name: { $nin: existingQuizNames }})// Delete scores with quiz names not in existingQuizNames 
        await Score.deleteMany({ username: { $nin: existingUsernames}})// Delete scores with usernames not in existing usernames
        
        console.log(existingQuizNames);//Log the existing quiz names in the console for debugging purposes
        console.log(existingUsernames);//Log the existing usernames in the console for debugging purposes

        // Declare a variable to store the quiz scores
        let userScores 
        
        // Conditional rendering to check if a username is provided
        if (username) {
            // Find all scores for the user based on the username
             userScores = await Score.find({username}).exec(); 
        } else {
            //Find all scores if no username is provided
             userScores = await Score.find(req.body).exec(); 
        }        
        
        console.log(userScores);//Log the fetched scores in the console for debugging puroses

        return res.status(200).json(userScores)   // Return the fetched user scores in JSON format      
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user scores', error });// Return 500 status code for server error
        console.error({ message: 'Error fetching user scores', error });//Log an error message in the console for debugging purposes        
    }
})

// Route to fetch all scores for a single user
router.get('/findScores/:username', async (req, res) => {
    try {
        const { username } = req.params; // Extract username from query parameters

        //Conditional rendering to check if the username field exists
        if (!username) {
            return res.status(400).json({success : false, message: 'username is required'})
        }

        const user = await User.findOne({ username }).exec();// Fetch the user document based on the username

        // Conditional rendering to check if the user exists
        if (!user) { 
            // If no user is found with the given username, return a 404(Not Found) error
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch the user score based on the user id
        const result = await Score.find({ username: user.username })
            .populate('name') // Populate the quiz name reference if it's a relationship
            .sort({ createdAt: -1 })// Sort the scores by creation date (most recent first)
            .exec()//Execute the query

        res.status(200).json({ userScores: result });// Return the fetched user scores in JSON format  
        console.log(result);//Log the results in the console for debugging purposes
    } catch (error) {
        console.error('Error finding user scores:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ success: false, error: error.message });// Return 500 status code for server error
    }
});

//Find userScore for a specific quiz
router.get('/findQuizScores/:quizName/:username', async (req, res) => {
    console.log('route reached');//Log a message in the console for debugging purposes 
    try {
        const { quizName, username } = req.params; // Extract quizName and username from the route parameters

        // Fetch the score for the specified quiz and user
        const quizScore = await Score.findOne({username: username, name: quizName}).exec();//Execute the query

        //Conditional rendering to check if a score is found
        if (!quizScore) {
            // If no score is found, return a 404 error
            return res.status(404).json({ error: 'Score not found' });
        }

        res.status(200).json(quizScore);    // Return the quiz score in JSON format
        console.log(quizScore);    // Log the fetched score in the console for debugging purposes
    } 
    catch (error) {
        console.error('Error finding quiz score:', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: error.message });// Return 500 status code for server error
    }
})

//-----------POST----------------------
//Route to add a new score
router.post('/addScore',  async(req, res) => {
    console.log("req body: ", req.body);//Log the request body in the console for debugging purposes    

    try {
        const { username, name, score } = req.body;// Extract username, quiz name, and score from the request body

        //Conditional rendering
        if (typeof score !== 'number' || score < 0) {
            return res.status(400).json({message: 'Score must be a integer'})
        }
        
        const quiz = await Quiz.findOne({ name }).exec();// Check if the quiz exists

        //Conditional rendering to check if the quiz exists
        if (!quiz) {
            // Return a 404 (Not Found) error if the quiz does not exist
            return res.status(404).json({message: 'Quiz not found'})
        }

        const existingScore = await Score.findOne({ username, name}).exec();//Check if a scire already exists for the quiz      

        // Conditional rendering to Check if a score already exists for the user and the quiz
        if (existingScore && existingScore.score >= score) {
            // If the existing score is higher or equal, don't update
            return res.status(200).json({ message: "New score is not higher than the existing score" });
        } else{
            // If a score exists, update it; otherwise, create a new score        
            const newScore = existingScore
                ? await Score.findByIdAndUpdate(
                    existingScore._id,// Use the ID of the existing score
                    { score, $inc: { attempts: 1 } },// Increment attempts
                    { new: true }// Return the updated score
                )
                : await new Score({ username, name, score }).save();// Create a new score
            res.status(201).json(newScore)// Save the score and return the result in JSON format
        }     
        
        // console.log( newScore);//Log the score in the console for debugging purposes
    } 
    catch (error) {
        console.error('Error saving score:', error);//Log an error message in the console for debugging purposes
        return res.status(500).json({ success: false, error: error.message });// Return a 500 (Internal Server Error) response
    }
})

//----------------PUT--------------------
//Route to edit existing score
router.put('/updateScore/:id', checkJwtToken, async (req, res) => {   
    try { 
        const { id } = req.params; // Extract the score ID from route parameters
        const { score } = req.body; // Extract the new score from the request body

        //Conditional rendering to check that the Id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid score ID.' });
        }
        //Conditional rendering to check if the score is a 0 or a positive number
        if (typeof score !== 'number' || score < 0) {
            //Return a 400 (Bad Request)response if the score is a negative number
            return res.status(400).json(
                { success: false, message: 'Score must be a non-negative number.' });
        }

        const existingScore = await Score.findById(id).exec();// Find existing score by id

        //Conditional rendering to check if the score was found
        if (!existingScore) {
            //If no score is found return a 404 (Not Found) response
            return res.status(404).json({ message: 'Score not found' });
        }

        // Conditional rendering to check if new score is higher
        if (existingScore.score >= score) {
            // If the new score is not higher than the existing score, return early
            return res.status(200).json({ message: 'New score is not higher than the existing score' });
        }
        // Find the score by its ID and update it
        const editedScore = await Score.findByIdAndUpdate(
            id,//Score id
            { score, $inc: { attempts: 1 } },// Increment attempts 
            { new: true } //Return the updated document
        );
        
        console.log(editedScore);//Log the edited score in the console for debugging purposes              
        return res.status(200).json(editedScore); // Return the updated score in JSON format
    } 
    catch (error) {
        res.status(500).json({ message: 'Error updating score' });//Return a 500 (Internal Sarver Error) response
        console.error('Error updating score')//Log an error message in the console for debugging purposes
    }
})

// Export the router to be used in other parts of the application
module.exports = router;
