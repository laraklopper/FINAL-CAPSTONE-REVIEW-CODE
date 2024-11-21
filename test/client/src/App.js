// Import necessary modules and packages
import React, { useEffect, useState, useCallback } from 'react';// Import the React module to use React functionalities
import './App.css';//Import CSS stylesheet
// React Router components
import {  Route, Routes, useNavigate } from 'react-router-dom';
//Bootstrap
import Container from 'react-bootstrap/Container';// Import the Container component from react-bootstrap
//Pages
import Login from './pages/Login';//Import Login (LOGIN)
import Registration from './pages/Registration';//Import Registration (REGISTRATION)
import Page1 from './pages/Page1';//Import Page1 (HOME)
import Page2 from './pages/Page2';//Import Page2 (GAME)
import Page3 from './pages/Page3';//Import Page3 (ADD QUESTIONS)
import Page4 from './pages/Page4';//Import Page4 (USER ACCOUNT)

//App function component
export default function App() {//Export default App function component
  //=======STATE VARIABLES===============
  //User variables
  const [users, setUsers] = useState([]);//State used to store a list of all the users
  const [currentUser, setCurrentUser] = useState(null);  //State to store the user currently loggedIn
  const [userData, setUserData] = useState({  //State to store userData for login
    username: '',        
    email: '',           
    dateOfBirth: '',    
    admin: false,           
    password: '',        
  });
  //Quiz variables
  const [quizList, setQuizList] = useState([]);//State to store the List of all quizzes
  const [questions, setQuestions] = useState([]);  //List of questions in the quiz
  const [quiz, setQuiz] = useState(null);//Currently selected quiz
  const [quizName, setQuizName] = useState(''); //State to store the quizName 
  //Score variables
  const [userScores, setUserScores] = useState({ // State to store the current user's quiz scores
    result: '',
    date: '',
    attemptNumber: ''
  });
  const [scores, setScores] =useState([]);// State to hold scores
  // Event and UI-related states
  const [error, setError] = useState(null); //State to handle errors during data fetching
  const [loggedIn, setLoggedIn] = useState(false);//Boolean to track whether or not the user is currently logged in
  const [selectedQuiz, setSelectedQuiz] = useState(null);// State to store the selected quiz

  //===========Navigation======================
  // Hook to navigate between different routes
  const navigate = useNavigate()
  
  //============USE EFFECT HOOK TO FETCH USERS======================
  //Fetch users when the component mounts or when loggedIn changes
  useEffect(() => {
    //Function to fetch users
    const fetchUsers = async () => {//Define an async function to fetch all users
      try {
        const token = localStorage.getItem('token');// Retrieve the JWT token from localStorage
        if (!token || !loggedIn) return;// If no token is found, exit the function

      // Send a GET request to the server to fetch users
         const response = await fetch('http://localhost:3001/users/findUsers', {
           method: 'GET',//HTTP request method
           mode: 'cors',//Enable Cross-Origin Resource Sharing 
           headers: {
             'Content-Type': 'application/json',// Specify the content type 
             'Authorization': `Bearer ${token}`,//Add the Authorization header 
          }
        });

        /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
        if (!response.ok) {
          throw new Error('Failed to fetch users');//Throw an error message if the GET request is unsuccessful
        }
        
        const fetchedUsers = await response.json();// Parse the JSON data from the response body
        setUsers(fetchedUsers); //Update the state with the usersList
        // console.log(fetchedUsers);//Log the users in the console for debugging purposes
        
      } 
      catch (error) {
        console.error('Error fetching users', error.message);//Log an error message in the console for debugging purposes
        setError('Error fetching users');// Set the error state to display the error in the UI
      }
    };

    //Function to fetch the current user details
    const fetchCurrentUser = async () => {
      try {
        
        const token = localStorage.getItem('token');// Retrieve the JWT token from localStorage
        if (!token) return;// If no token is found, exit the function

        //Send a GET request to the server to fetch the current user id
        const response = await fetch('http://localhost:3001/users/userId', {
          method: 'GET',//HTTP request method
          mode: 'cors',//Enable Cross-Origin resource sharing mode
          headers: {
            'Content-Type': 'application/json',// Specify the content type
            'Authorization': `Bearer ${token}`,// Attach JWT token for authorization
          }
        });
     
        /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
        if (!response.ok) {
          throw new Error('Failed to fetch current user');//Throw an error message if the GET request is unsuccessful
        }

        const fetchedCurrentUser = await response.json(); // Parse and set the current user's details
        setCurrentUser(fetchedCurrentUser);// Update state with fetched user details
        // console.log(fetchedCurrentUser);//Log the current user details in the console for debugging purposes
      }
      catch (error) {
        console.error('Error fetching current user', error.message);//Log an error message in the console for debugging purposes
        setError('Error fetching current user');// Set the error state to display the error in the UI
      }
    };

    //Conditional rendering to check if the user is logged in
    if (loggedIn) {
      /* Call the FetchUsers function to 
      fetch the list of users*/
      fetchUsers();
      /*Call the FetchCurrentUser function to fetch the 
      current user's details*/
      fetchCurrentUser();
    }
  }, [loggedIn,  navigate]);
 
  //==============REQUESTS========================
  //-----------GET-------------------------
  useEffect(() => {
    //Function to fetch all scores
    const fetchScores = async () => {
      try {
        const token = localStorage.getItem('token');// Retrieve the JWT token from localStorage
        if (!token || !loggedIn) return;// If no token is found, exit the function

        //Send a GET request to the server
        const response = await fetch ('http://localhost:3001/scores/findScores', {
          method: 'GET',//HTTP request method
          mode: 'cors',//Enable Cross-Origin Resource Sharing 
          headers: {
            'Content-Type': 'application/json',//Specify the Content-Type in the request payload 
            'Authorization': `Bearer ${token}`// Attach JWT token for authorization
          }
        })

        /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
        if (!response.ok) {
          throw new Error("Failed to fetch user scores");//Throw an error message if the GET request is unsuccessful
        } 
        //Conditional rendering to ensure the data is an array
        const fetchedScores = await response.json();//Parse the response as JSON
        if (fetchedScores && Array.isArray(fetchedScores.scores)) {
                  setScores(fetchedScores.scores)//Update the state
        }
  
        // console.log(fetchedScores);//Log the scores in the console for debugging purposes       
      } catch (error) {
        console.error('Error fetching  scores', error);//Log an error message in the console for debugging purposes
        setError('Error fetching  scores', error)// Set the error state to display the error in the UI       
      }
    }

    //Conditional rendering to check if the user is logged in
    if (loggedIn) {
      fetchScores()//Call the fetchScores function if the user is logged in
    }
  },[loggedIn])

// Function to fetch quizzes
  const fetchQuizzes = useCallback(async () => {
    try {  
      const token = localStorage.getItem('token');// Retrieve the JWT token from localStorage
      
      //Send a GET request to the server to find all quizzes
      const response = await fetch('http://localhost:3001/quiz/findQuizzes', {
        method: 'GET',//HTTP request method
        mode: 'cors',// Enable Cross-Origin Resource Sharing
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type in the payload as JSON
          'Authorization': `Bearer ${token}`,// Attach JWT token to the Authorization header
        }
      });

      /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');//Throw an error message if the GET request is unsuccessful
      }
      
      const quizData = await response.json();// Parse the JSON data from the response body

      //Conditional rendering to ensure the data is an array
      if (quizData && Array.isArray(quizData.quizList)) {       
        setQuizList(quizData.quizList);// Update the quizList state with the fetched quiz data
      } else {    
        throw new Error('Invalid quiz data');// Throw error if the data format is incorrect
      }    
    } 
    catch (error) {
      console.error('Error fetching quizzes:', error);//Log an error message in the console for debugging purposes
      setError('Error fetching quizzes');// Set the error state to display the error in the UI
    }
  },[setQuizList, setError]);


  //Function to fetch scores list from database
const fetchUserScores = useCallback(async () => {
  try {
    const token = localStorage.getItem('token');//Retrieve the JWT token from LocalStorage
    const username = localStorage.getItem('username')//Retrieve the username from localStorage
    //send GET request to server to find scores
    const response = await fetch(`http://localhost:3001/scores/findScores/${username}`, {
      method: 'GET',//HTTP request method
      mode: 'cors',//Enable Cross-Origin Resource Sharing 
      headers: {
        'Content-Type': 'application/json', //Specify the Content-Type in the payload as JSON
        'Authorization': `Bearer ${token}`,//Attatch the token in the Authorization header
      }
    })

    /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
    if (!response.ok) {
      throw new Error('Unable to fetch user scores')//Throw an error message if the GET request is unsuccessful
     }

     const quizScores = await response.json();//Parse JSON response
    
     //Conditional rendering to ensure the data is an array
    if (quizScores && quizScores.userScores && Array.isArray(quizScores.userScores)) {
      setUserScores(quizScores.userScores); // Update state with fetched scores
    }
    else {     
      throw new Error('Invalid data type');//Throw an error message if the data type is invalid
    }
  //  console.log(quizScores);//Log the quizScores in the console for debugging purposes

  } catch (error) {
    console.error('Error fetching userScores', error.message);//Log an error message in the console for debugging purposes
    setError(`Error fetching userScores: ${error.message}`);// Set the error state to display the error in the UI
  }
},[setUserScores, setError]);
//===========EVENT LISTENERS============================
  // Function to handle user logout
  const logout = useCallback (() => {
    //Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('loggedIn');  
    /* Update loggedIn state to reflect that the 
    user is no longer logged in*/
    setLoggedIn(false);
    setError(''); // Clear any existing error messages
    setUserData(
      { 
        username: '', 
        password: '' 
      });//Reset the userData
    /*Use the navigate function to redirect the
    user to the login page after logging out*/
    navigate('/');
  }, [navigate]);

  //===========JSX RENDERING=============================

  return (
    <>
      {/* App Container */}
        <Container className='appContainer'>
          <Routes>
            {/* Routes available if user is logged */}
            {loggedIn ? (
              <>
                {/* Route for Page1: HOME */}
                <Route path='/' element={
                  <Page1
                   scores={scores}
                      setScores={setScores}
                    logout={logout} 
                    loggedIn={loggedIn}
                    quizName={quizName}
                    error={error} 
                    currentUser={currentUser} 
                    setError={setError}
                    userScores={userScores}
                    setUserScores={setUserScores}
                    selectedQuiz={selectedQuiz}
                    setSelectedQuiz={setSelectedQuiz}
                    fetchUserScores={fetchUserScores}
                    userData={userData}
                  />
                }
                />
                {/* Route for Page2: GAME */}
                <Route
                  path='/page2'
                  element={
                    <Page2
                      logout={logout}
                      fetchQuizzes={fetchQuizzes}
                      setError={setError}
                      quizList={quizList}
                      quiz={quiz}
                      quizName={quizName}
                      setQuizName={setQuizName}
                      setQuiz={setQuiz}
                      setQuizList={setQuizList}
                      questions={questions}
                      setQuestions={setQuestions}
                      currentUser={currentUser}
                      setUserScores={setUserScores}
                      userScores={userScores}
                    />
                  }
                />
                {/* Route for Page3: Add Questions */}
                <Route path='/page3' element={
                  <Page3
                  quizName={quizName}
                  setQuizName={setQuizName}
                  quizList={quizList}
                  loggedIn={loggedIn}
                  logout={logout}
                  setError={setError}
                  setQuizList={setQuizList}
                  fetchQuizzes={fetchQuizzes}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  userData={userData}
                  questions={questions}
                  setQuestions={setQuestions}
                  setUserData={setUserData}
                  quiz={quiz}
                  error={error}
                  />
                }
                />
                {/* Route for Page4: User Account*/}
                <Route path='/page4' element={
                  <Page4
                    setError={setError} 
                    logout={logout}
                    currentUser={currentUser} 
                    setUsers={setUsers} 
                    setLoggedIn={setLoggedIn}
                    users={users} 
                  />
                }
                />
              </>
            ) : (
              <>
               {/* Routes available when the user is not logged in */}
                {/* Route for Login */}
                <Route exact path='/' element={
                  <Login
                    userData={userData} 
                    setUserData={setUserData} 
                    setLoggedIn={setLoggedIn} 
                    setError={setError} 
                  />
                }
                />
                {/* Route for Registration */}
                <Route
                  path='/reg'
                  element={
                    <Registration               
                      setError={setError} 
                    />
                  }
                />
              </>
            )}
          </Routes>         
        </Container>
    </>
  );
}
