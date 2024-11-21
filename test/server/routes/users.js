// Import necessary modules and packages
const express = require('express');// Import Express to handle routing
const router = express.Router();// Create a new router object
const jwt = require('jsonwebtoken');// Import the jsonwebtoken module for handling JSON Web Tokens
//Schemas
const User = require('../models/userSchema');//Import the user schema
const Score = require('../models/scoreSchema');//Import the score schema
const Quiz = require('../models/quizModel');//Import the quiz Schema
//Import custom middleware
const { checkAge, checkJwtToken, checkPasswordLength} = require('./middleware');
const quizModel = require('../models/quizModel');

//=============ROUTES=====================
/*
|================================================|
| CRUD OPERATION | HTTP VERB | EXPRESS METHOD    |
|================|===========|===================|
|CREATE          | POST      |  router.post()    |
|----------------|-----------|-------------------|
|READ            | GET       |  router.get()     |  
|----------------|-----------|-------------------|     
|UPDATE          | PUT       |  router.put()     |
|----------------|-----------|-------------------|
|DELETE          | DELETE    |  router.delete()  |
|================|===========|===================|
*/
//------------------GET---------------
//Route to handle GET requests to fetch a single user
router.get('/userId',checkJwtToken, async (req, res) => {
    console.log('Finding User');//Log a message in the console for debugging purposes
    try {
        /* Retrieve the user ID from the authenticated token 
        and fetch the user excluding the password field*/
        const user = await User.findById(req.user.userId).select('-password');
        
        //Conditional rendering to check if the user exists
         if (!user) {
             console.error('User not found');//Log an error message in the console for debugging purposes
             // If no user is found, log an error and send a 400 response
             return res.status(400).json({ message: 'User Not Found'})
         }

        res.status(200).json(user); // Return the users in the response
        console.log('User details', user);//Log the user details in the console for debugging purposes
         
    } 
    catch (error) {
        console.error('Error fetching Users', error.message);//Log an error message in the console for debugging purpose
        // Send 500(Internal server error) status code and error message in JSON response
        res.status(500).json({ message: 'Internal Server Error', error: error.message })
    }
})


//Route to GET all users
router.get('/findUsers',  async (req, res) => {
    try {        
        const { username } = req.query;// Extract the username from the query parameters
        // If a username is provided, use it to filter users, otherwise return all users
        const query = username ? { username } : {};
        const users = await User.find(query).select('-password'); // Fetch users based on the query object
    
        // console.log(users);// Log the fetched users for debugging purposes
        res.status(200).json(users);// Send the list of users as the response
    } 
    catch (error) {
        console.error('Error fetching users', error.message);//Log an error message in the console for debugging purpose
        res.status(500).json(// Send 500(Internal server error) status code and error message in JSON response
            { message: 'Internal server Error' }
        );
    }
})

//-------------POST-------------------
//Route to send POST request to login endpoint
router.post('/login', async (req, res) => {
    console.log(req.body);//Log the request body in the console for debugging purposes
    // console.log('User Login');//Log a message in the console for debugging purposes

    try {
        // Extract username and password from the request body
        const { username, password } = req.body;
        // Find the user in the database by username and password
        const user = await User.findOne({ username, password });
        console.log(user); //Log the user in console for debugging purposes
        
        //Conditional rendering to check if the user exists
        if (!user) {
            return res.status(404).json({message: 'User not found'});//Return a 404(Not Found) error message if no user is found
        }
      
        //Conditional rendering to check if the user credentials are valid
        if (password === user.password) {
            // Generate a JWT token for authentication
            const jwtToken = jwt.sign(
                { userId: user._id },// Payload containing user ID
                     'secretKey',/*process.env.JWT_SECRET, */ // Secret key for token signing                    
                        {
                            expiresIn: '12h',// Token expiration time
                            algorithm: 'HS256',// Signing algorithm
                        }
                    );
            // Send the generated JWT token as a JSON response
            res.json({ 'token': jwtToken })//Send the generated token back to the client
        } 
        else {
            console.error('Incorrect user credentials');//Log an error message in the console for debugging purposes
        }
     
    } catch (error) {
        console.error('Login Failed: Username or password are incorrect');//Log an error message in the console for debugging purposes
        //Send a 401 status error message to the client indicating an authentication failure
        res.status(401).json({ message: 'User not authenticated' })
    }
})

//Route to send a POST request the register endpoint
router.post('/register', checkAge, checkPasswordLength, async (req, res) => {
    // console.log(req.body);//Log the request body in the console for debugging purposes
    try {
        // Extract user details from the request body, with 'admin' defaulting to false
        const { username, email, dateOfBirth, password, admin = false } = req.body;
        
      //Conditional rendering to check that all the required fields exist
        if (!username || !email || !dateOfBirth || !password) {
            console.error('Username, email, date of birth, and password are required');//Log a message in the console for debugging purposes
            return res.status(400).json(
                { message: 'Username, email, date of birth, and password are required' });
        }
      
        
        const existingUser = await User.findOne({ username });
        // Conditional rendering to check if a user with the same username already exists
        if (existingUser) {
            return res.status(400).json( { message: 'Username already exists' });
        };

        // Create a new user instance with the provided details
        const newUser = new User({ username, email, dateOfBirth, admin, password});

        const savedUser = await newUser.save();//Save new user to database

        // Generate JWT token for the newly registered user
        const token = jwt.sign(
            { _id: savedUser._id },// Payload containing the user's ID
            'secretKey', // Secret key used to sign the token
            /*process.env.JWT_SECRET,*/
            {
                expiresIn: '12h',// Token expiration time set to 12 hours
                algorithm: 'HS256'// Specify the signing algorithm 
            }
        );
        
        res.status(201).json({ token, user: savedUser });// Send the generated JWT token and saved user details in the response
        console.log(savedUser);//Log the new user in the console for debugging purposes

    } 
    catch (error) {
        console.error('Failed to add User');//Log an error message in the console for debugging purpose
        return res.status(500).json({ error: 'Internal Server Error' })//send a 500 (Internal Server Error) response if something goes wrong
    }
})

//-------------PUT-----------------
//Route to edit a user account
router.put('/editAccount/:id', checkJwtToken, async (req, res) => {
    console.log('updated user:' + req.body);//Log the request body in the console for debugging purposes
    console.log('edit Account');// Log a message in the console for debugging purposes

    try {            
        const { id } = req.params;// Extract the user ID from the request parameters
        const { username, email } = req.body;// Extract the username and email from the request body

        
        // Create an object to hold the fields that will be updated
        const updateUser = {};
        if (username) updateUser.username = username; 
        if (email) updateUser.email = email; 

 
        const existingUser =await User.findById(id);//Find the current user document

        //Conditional rendering to check if the username was changed
        if (username && username !== existingUser.username) {
            // Update the username in the Score collection if username was changed
            await Score.updateMany(
                { username: existingUser.username },// Find by the old username
                { $set: { username } }// Set to the new username
            )

            // Update the username in the quiz collection if username was changed
                await Quiz.updateMany(
                    { username: existingUser.username },// Find by the old username
                    { $set: { username } }// Set to the new username
                )
        }

        // Find the user by ID and update the relevant fields
        const updatedAccount = await User.findByIdAndUpdate(
            id, // The ID of the user to update
            updateUser, // The fields to update
            { new: true } // Return the updated document
        );

        //Conditional rendering to check if the updated user is found
        if (!updatedAccount) {
            // If the updated user is not found send a 404(Not Found) status
            // response and an error message
            return res.status(404).json({ message: 'User not found' })
        }
        
        console.log('Updated User Account:', updatedAccount);//Log the updated user account in the console for debugging purposes
        res.status(201).json({ message: 'User account successfully updated', updatedAccount });// Return success message and updated account
    } 
    catch (error) {
        console.error(`Error occured while updating User Account ${error.message}`);//Log an error message in the console for debugging purposes
        return res.status(500).json({ message: 'Internal server error' })// Send 500(Internal server error) status code and error message in JSON response

    }
})

//---------------DELETE--------------------
//Route to send a DELETE request to the /deleteUser endpoint
router.delete('/deleteUser/:id', async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const { id } = req.params; 
        // Find the user by ID and delete the document
        const removedUser = await User.findByIdAndDelete(id);

        //Conditional rendering to check if the user exists
        if (!removedUser) {                    
            //If the user is not found send a 404(Not Found) status response with an error message
            return res.status(404).json({ message: 'User not found' });
        }
        // console.log(removedUser);//Log the removed user in the console for debugging purposes
        
        res.json({
            message: 'User Successfully deleted',
            deletedUserId: removedUser._id
        })
    } 
    catch (error) {
        console.error('Error deleting user:', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json({ error: 'Failed to delete User' });// Send 500(Internal server error) status code and error message in JSON response
    }
})

// Export the router to be used in other parts of the application
module.exports = router;