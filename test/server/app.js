// Import required modules
const express = require('express');// Import Express Web framework
const mongoose = require('mongoose');//Import the Mongoose library
const cors = require('cors');// Import CORS (Cross-Origin Resource Sharing) middleware
const helmet = require('helmet');
//Import routes
const userRouter = require('./routes/users');
const quizRouter = require('./routes/quiz');
const scoreRouter = require('./routes/scores');
/* Load environment variables from a .env file
using the dotenv package*/
require('dotenv').config()

//Extract Environmental Variables
const port = process.env.PORT || 3001;
const database = process.env.DATABASE_NAME;
const uri = process.env.DATABASE_URL;
console.log(uri)

const app = express();// Create an Express application

//=====CHECK IF ALL THE ENVIRONMENTAL VARIABLES A PRESENT=========
// Conditional rendering to check if the port environmental variable is missing
if (!port) {
    console.error('Error: PORT environment variable is missing');
    process.exit(1);// Exit the process with a failure code
}
// Conditional rendering to check if the database environmental variable is missing
else if(!database){
    console.error('Error: DATABASE_NAME enviromental variable is missing');
    process.exit(1);// Exit the process with a failure code
}
    // Conditional rendering to check if the port environmental variable is missing
else if(!uri){
    console.error('Error: DATABASE_URL enviromental variable is missing');
    process.exit(1)// Exit the process with a failure code
};

//==============CONNECT TO MONGODB===============
//mongoose.Promise = global.Promise; // Use native promises

mongoose.connect(uri, {
    dbName: database,  // Specify the database name
    // useNewUrlParser: true,  // Use the new URL parser
    // useUnifiedTopology: true,  // Use the new connection management engine
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1); // Exit the process with a failure code
    })

//==========MONGODB CONNECTION EVENT HANDLERS==========
// Set up an event listener for the 'error' event on the Mongoose connection
// Function executed when there is an error in the MongoDB connection
mongoose.connection.on('error', (error) => {
    console.error('Could not connection the database. Exiting now...', error);
    process.exit(1);
})
// Set up an event listener for the 'open' event on the Mongoose connection
// Function executed when the MongoDB connection is successfully open
mongoose.connection.once('open', () => {
    console.log('Successfully connected to the database');
});

//===========SETUP MIDDLEWARE==================

app.use(cors());  // Enable CORS for all routes, allowing cross-origin requests
app.use(express.json());  // Enable parsing of JSON bodies in incoming requests
app.use(helmet())
//============ROUTES================
app.use('/users', userRouter);// user-related routes at the '/users' path
app.use('/quiz', quizRouter);// quiz-related routes at the '/quiz' path
app.use('/scores', scoreRouter);//score-related routes at the '/scores' path

//=================START THE SERVER=======================
// Start the server and listen on the specified port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    // Log a message indicating the server is running
} )