// Import required modules
import React, { useCallback, useState } from 'react';// Import the React module to use React functionalities
import '../CSS/QuizDisplay.css'
//Components
import StartQuizForm from '../components/StartQuizForm';//Import the StartQuiz function component
import Quiz from './Quiz';//Import the Quiz function component
import Result from './Result';//Import the results function component

//QuizDisplay Function component
export default function QuizDisplay(//Export default quizDisplay component
  {// PROPS PASSED FROM PARENT COMPONENT
    selectedQuizId, 
    quiz, 
    setQuiz,
    fetchQuiz,
    quizName,
    currentUser,
    setError,
    questions,
    setTimer,
    quizTimer,
    setQuizTimer,
    timer,
    setSelectedQuizId,
    setUserScores,
    userScores
  }) {
    //======STATE VARIABLES=========== 
  const [quizIndex, setQuizIndex] = useState(0); // Current question index in the quiz
  // Boolean values to track whether the quiz has started or is completed 
  const [quizStarted, setQuizStarted] = useState(false);// Boolean to track whether the user has started the quiz
  const [quizCompleted, setQuizCompleted] = useState(false); // Boolean to track whether the quiz is completed
  const [currentScore, setCurrentScore] = useState(0);// State to store the user's score during the quiz

  
    //=========REQUESTS============
    //-------GET--------------------
    //Function to check if a score for the Quiz already exists
    const checkExistingScore = useCallback(async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve JWT token from local storage
        
        //Conditional rendering to check if the JWT token is missing
        if (!token) {
          console.log('Authentication required');//Log a message in the console for debugging purposes
          return null;// Exit the function if no token is found
        }

        //Send a GET request to the server 
        const response = await fetch (`http://localhost:3001/scores/findQuizScores/${quizName}/${currentUser.username}`, {
          method: 'GET',//HTTP request method
          mode: 'cors',//Enable Cross-Origin Resource Sharing 
          headers: {
            'Content-Type': 'application/json', // Specify the content type 
            'Authorization': `Bearer ${token}`,//Add the Authorization header 
          }
        });

        /* Conditional rendering to check if the response
          is not successful (status code is not in the range 200-299)*/
        if (!response.ok) {
          throw new Error ('Error fetching scores for the quiz');//Throw an error message if the GET request is unsuccessful
        }

        const result = await response.json();// Parse the JSON response

        // console.log("userScores test", userScores);//Log the user Scores in the console for debugging purposes
        // console.log(`results: ${result}`)//Log the JSON response in the console for debugging purposes

      // Conditional rendering if userScores is an array and contains objects with a name property
      if (Array.isArray(userScores)) {
         const existingScore = result.userScores.find(score => score.name === quizName);// Find the existing score for the current quiz
        // Conditional rendering to check if the score was found
        if (!existingScore) {
          console.error('No existing score was found for this quiz');//Log an error message in the console for debugging purposes
        } 

        //  console.log(existingScore);//Log the existing score in the console for debugging purposes
         return existingScore || null; // Return the found score or null if not found
       } 
       else {
        //  console.error('Invalid data structure for userScores');//Log an error message in the console for debugging purposes
        return null;// Return null if not found
       }
      } catch (error) {
        // console.error('Error fetching scores:', error.message);//Log an error message in the console for debugging purposes
        setError('Error fetching scores');// Update the error state to display an error message in the UI
        return null;//Return null in the case of an error
      }
    },[ 
      quizName, 
      setError, 
      currentUser.username
      ,userScores
    ])
    //--------PUT------------
    /*Function to update score if a score for the quiz already 
    exists and is better than the prevous result/score*/
  const updateScore = useCallback(async (scoreId) => {

    try {      
      const token = localStorage.getItem('token');// Retrieve token from localStorage

      if (!token) return// Exit function if no token is found
      
      //Send a PUT request to the server
      const response = await fetch (`http://localhost:3001/scores/updateScore/${scoreId}`, {
        method: 'PUT',//HTTP request method
        mode: 'cors',//Enable Cross-Origin Resource Sharing 
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type in the request payload
          'Authorization': `Bearer ${token}`,//Set the mode to cors, allowing cross-origin request
        },
        body: JSON.stringify({
          score: currentScore
        })
      })

      /* Conditional rendering to check if the response
      is not successful (status code is not in the range 200-299)*/
      if (!response.ok) {
        throw new Error('Error updating score');//Throw and error message if the POST request is unsuccessful
      }
      const result = await response.json();// Parse the JSON response

      // Update the user scores state with the new score
      setUserScores(prevScores => [result, ...prevScores])
    } catch (error) {
      console.error('Error saving score', error.message);//Log an error message in the console for debugging purposes
      setError('Error saving score', error.message)//Set the Error state with an error message
    }
  },[currentScore, setError, setUserScores])

  //-------------POST-------------------------
  // Function to add the user Score if a score does nor exist for the user
  const addScore = useCallback(async () => {//Define an async function to add a users Score
    try {
      
      const token = localStorage.getItem('token');// Retrieve JWT token from local storage
      // Conditional rendering to check if token is missing
      if (!token) {
        console.log('Authentication required');//Log a message in the console for debugging purposes
        return;//Exit the function if the token is missing
      }

      const existingScore = await checkExistingScore();// Check if a score for the quiz already exists

      //Conditional rendering to check if a score already exists
      if (existingScore) {      
        /*If an existing score is found, call the 
        updateScore function to update it*/
        await updateScore(existingScore._id) 
        return// Exit the function after updating the score
      }
      //Send a POST request to the server
      const response = await fetch(`http://localhost:3001/scores/addScore`, {
        method: 'POST',//HTTP request method
        mode: 'cors',//Set the mode to cors, allowing cross-origin request
        headers: {
          'Content-Type': 'application/json',// Specify the Content-Type 
          'Authorization': `Bearer ${token}`,//Add the Authorization header 
        },
        body: JSON.stringify({
          username: currentUser.username, // Username from the current user object
          name: quizName,// The name of the quiz being taken
          score: currentScore,// The user's score to be submitted
        })
      })
      const result = await response.json();//Parse the JSON response from the server
      
      if (response.status === 200 && result.message) {
        console.log(result.message);
        return;
      }

      // Response handling where the response is unsuccessful
      if (!response.ok) {
        throw new Error('Error saving score')//Throw an errror message if the POST request is unsuccessful
      }
      
      // Update the user scores state  
      setUserScores(prevScores => [result, ...prevScores]);
      
    } catch (error) {
      console.error('Error saving score', error.message);// Log an error message in the console for debugging purposes
      setError('Error saving score', error.message)// Update the error state to display an error message in the UI
    }
  }, [currentUser, quizName, setError, setUserScores, checkExistingScore, updateScore, currentScore])


  //=======EVENT LISTENERS==========
  // Function to move to the next question
  const handleNextQuestion = useCallback(() => {
    if (quiz && quiz.questions && quizIndex < quiz.questions.length - 1) {
      // Increment the quiz index to move to the next question
      setQuizIndex(quizIndex + 1)
      if (quizTimer) setTimer(10)// Reset timer if quiz timer is enabled
    }else{
       setQuizStarted(false)
       setQuiz(null) // Clear current quiz data
      setSelectedQuizId('')// Reset the selected quiz ID
      setQuizCompleted(true)// Mark quiz as completed
    }
  },[ quiz, 
    quizIndex,
    quizTimer, 
    setQuizIndex,
    setQuizStarted,
    setQuiz, 
    setSelectedQuizId,
    setTimer,
    setQuizCompleted
     ])

  //Function to start the quiz
  const handleQuizStart = useCallback(async(e) => {
    // Prevent the form from refreshing the page
    e.preventDefault();
    if (!selectedQuizId) return;// If no quiz is selected, return early

    try {
      await fetchQuiz(selectedQuizId)// Fetch the quiz by its ID
      setQuizStarted(true)// Set quiz as started
      setQuizIndex(0)// Reset question index
      setCurrentScore(0) // Reset score to 0
    
      if (quizTimer) {
        // Initialize timer if enabled
      setTimer(10)
      }
    } catch (error) {
      // Handle errors during quiz start
      setError(`Error starting quiz: ${error.message}`);
      console.error('Error starting quiz');// Log an error message in the console for debugging purposes
    }
  },[selectedQuizId, quizTimer, fetchQuiz, setTimer, setQuizIndex , setError])
  
    // Function to restart the quiz
    const handleRestart = useCallback(() => {
      setQuizIndex(0)// Reset the quiz index
      setCurrentScore(0);//Reset the quiz score
      setQuizStarted(true)// Update the error state to display an error message in the UI
      setQuizCompleted(false)// Mark quiz as not completed
      if (quizTimer) {
        setTimer(10)// Clear the timer
        handleQuizStart({preventDefault:() => {}})// Restart the quiz if the timer is enabled
      }
      else{
        setTimer(null)
      }
    },[quizTimer, handleQuizStart, setTimer])

    
  //======JSX RENDERING============

  return (
    <div id='quizDisplay'>    
      {/* Show the quiz start form if a quiz is 
      selected but not started */}
      {selectedQuizId && (
        <div id='quizDisplayForm'>
         {/* Form to start quiz */}
         <StartQuizForm
         handleQuizStart={handleQuizStart}
         quizTimer={quizTimer}
         setQuizTimer={setQuizTimer}
         quiz={quiz}
         quizStarted={quizStarted}
        //  quizName={quizName}
         />
        </div>
      )}
      {/* QUIZ */}
      {quiz && quizStarted && (
        // Quiz function component
        <Quiz
        selectedQuiz={quiz}
        quizIndex={quizIndex}
        setQuizIndex={setQuizIndex}
        handleRestart={handleRestart}
        handleNextQuestion={handleNextQuestion}
        quiz={quiz}
        currentScore={currentScore}
        setCurrentScore={setCurrentScore}
        quizTimer={quizTimer}
        quizName={quizName}
        timer={timer}
        questions={questions}
        quizCompleted={quizCompleted}
        setQuizCompleted={setQuizCompleted}
        />
      )}
      {quizCompleted && (
        <div>
          {/* Result function component */}
          <Result
          selectedQuizId={selectedQuizId}
          addScore={addScore}
          currentScore={currentScore}
          totalQuestions={questions.length || 0}
          currentUser={currentUser}
          quizName={quizName}
          />
        </div>
      )}
    </div>
  )
}
