// Import necessary modules and packages
const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens
const Quiz = require('../models/quizModel')// Import the Quiz model
const User = require('../models/userSchema')// Import the User model
const Score = require('../models/scoreSchema')//Import the score model


// Middleware to verify JWT and extract user info
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];// Extract the authorization header
    const token = authHeader && authHeader.split(' ')[1];// Extract the token from the header
    if (token == null) return res.sendStatus(401);// If no token, return unauthorized

    // Verify the token using a secret key
    jwt.verify(token, 
        'secretKey', //SecretKey for signing the token
        /*process.env.JWT_SECRET,*///secret key used for signing the token stored in enviromental variables
        (err, user) => {
            if (err) return res.sendStatus(403);// If token invalid, return forbidden
            req.user = user;// Attach user info to request object
            // req.userId = decoded.userId;
            next();// Proceed to the next middleware or route handler
    });
};

const checkJwtToken = (req, res, next) => {
    // Retrieve the authorization header from the request
    const authHeader = req.headers.authorization

    //Conditional rendering to check if the Authorization header is missing or does not start with 'Bearer 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];// Extract the authorization header

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(
            token,
            /*Secret key used for signing the token
            stored in enviromental variables*/
            'secretKey'
            /*process.env.JWT_SECRET*/
        );
        req.user = decoded;// Attach decoded user information to the request object
        console.log('Token provided');//Log a message in the console for debugging purposes

        next();// Call the next middleware or route handler
    }
    catch (error) {
        //Error handling
        console.error('No token attatched to the request');//Log an error message in the console for debugging purposes
        res.status(400).json({ message: 'Invalid token.' });// Respond with a 400 (Bad Request) status
    }
}


//Middleware function to check that admin user is 18 years or older
const checkAge = (req, res, next) => {
    const { dateOfBirth } = req.body;// Extract the date of birth from the request body

    // Conditional rendering to check if the date of birth is provided in the request body
    if (!dateOfBirth) {
        console.error('Date of Birth is required');//Log an error message in the console for debugging purposes
        return res.status(400).json(// Respond with a 400 (Bad Request) status code if missing
            { error: 'Date of Birth is required' }
        );
    }
    // Calculate the user's age based on the date of birth
    const dob = new Date(dateOfBirth);// Convert the date of birth from string to Date object
    const age = Math.floor((Date.now() - dob) / 31557600000);// Calculate age in years

    // Conditional rendering to check if the calculated age is less than 18
    if (age < 18) {
        console.error('Admin Users must be older than 18 years old');//Log an error message in the console for debugging purposes
        return res.status(400).json({ error: 'Admin users must be above 18 years old' });// Respond with a 400 (Bad Request) status if underage
    }

    next();// Call the next middleware or route handler
};

//Middleware to check if the user created the quiz
const quizAuthorisation = async (req, res, next) => {
    const { id } = req.params // Extract quiz ID from the request parameters
    const userId = req.user.id

    try {
        const quiz = await Quiz.findById(id) // Get the quiz by ID
   

        //Conditional rendering to check if the quiz exists
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        const user = await User.findById(userId); // Get the logged-in user based on token

        // Conditional rendering to check if the user is the created the quiz or an is an admin user
        if (quiz.username !== user.username && !user.admin) {
            return res.status(403).json({message: 'Unauthorised'});
        }
        next();//Call the next middleware function 

    } catch (error) {
        console.error('Error verifying quiz ownership:', error.message);//Log an error message in the console for debugging purposes
        res.status(500).json({ message: 'Internal Server Error' });
    }
};



//Export middleware to be used in other parts of the application
module.exports = { authenticateToken, checkJwtToken, checkAge, quizAuthorisation}