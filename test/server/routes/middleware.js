// Import necessary modules and packages
const jwt = require('jsonwebtoken');// Import the 'jsonwebtoken' library for handling JSON Web Tokens


//Middleware function to check and verify a JWT token from the 'token' header
const checkJwtToken = (req, res, next) => {
    const authHeader = req.headers.authorization// Retrieve the authorization header from the request


    const token = authHeader && authHeader.split(' ')[1];// Extract the authorization header
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' })// Respond with a 401 (Unauthorised) status code
    
    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(
            token,
            /*process.env.JWT_SECRET ||*/'secretKey',//secret key used for signing the token stored in enviromental variables
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


//Middleware to ensure that the password has a minimum of eight characters
const checkPasswordLength = (req, res, next) => {
    const {password} = req.body;//Extract the password from the request body


    // Regular expression to check password length (at least 8 characters)
    const passwordRegex = /^.{8,}$/;
    //Conditional rendering to test the password against the regular expression
    if (!passwordRegex.test(password)) {
        console.error('Invalid password length');//Log an error message in the console for debugging purposes
        // If the password fails the test, respond with a 400 (Bad Request) status and  an error message
        return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }


    next();// Call the next middleware or route handler
}




// Middleware to check if the user is an admin or the owner of the quiz
const quizAuthorization = async (req, res, next) => {
    try {
        
        const { user } = req.params; 


       
        if (!user) {
            return res.status(404).json({ message: 'User not found' })// Respond with 404 if user is not found
        }


        // Conditional rendering to check if the user is authorized to modify the quiz 
        if (quiz.userId.toString() !== user._id.toString() && !user.isAdmin) {
            return res.status(401).json(//Respond with a 401 (Unauthorised) response
                { message: 'Access denied. You do not have permission to modify this quiz.' });
        }
        console.log('authorisation passed')


        // req.user.isAdmin = user.admin; // Add admin status to request object for later use
        next()// Call the next middleware or route handler
    } catch (error) {
        console.error('Authorization error:', error.message); // Log the error for debugging purposes
        res.status(500).json({ message: 'Server error while authorizing user.' });// Respond with a 500 status on server error
    }
}

/*
//Error middleware
// Error-handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message); // Log the error for debugging
    const statusCode = err.statusCode || 500; 
 	const errMsg = err.message || 'Something went wrong';
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Internal Server Error',
    });
};
*/

//Export middleware to be used in other parts of the application
module.exports = {checkJwtToken, checkAge, quizAuthorization, checkPasswordLength}
