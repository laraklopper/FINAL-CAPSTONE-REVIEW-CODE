// Import necessary modules and packages
import React, { useCallback, useEffect, useState } from 'react';// Import the React module to use React functionalities
import '../CSS/Page2.css'; // Import custom CSS file for styling Page2
// Components
import Header from '../components/Header';//Import the Header function component
import QuizDisplay from '../components/QuizDisplay';//Import the QuizDisplay function component
import Footer from '../components/Footer';//Import the Footer function component
import SelectQuizForm from '../components/SelectQuizForm';//Import the SelectQuizForm function component

// Page 2 function component
export default function Page2(//Export default page2 function component
  {// PROPS PASSED FROM PARENT COMPONENT
    quizList,
    setQuizList,
    logout,
    fetchQuizzes,
    setError,
    quiz,
    setQuiz,  
    setQuizName,
    userScores,
    setQuestions,
    questions,
    currentUser,
    quizName,
    setCurrentUser,
    setUserScores,
    fetchScores
    }
) {
  // =========STATE VARIABLES====================
  //QuizVariables
  const [selectedQuizId, setSelectedQuizId] = useState(''); // State to store the selected quiz ID
  //Timer variables
  const [timer, setTimer] = useState(10);// Timer for the quiz
  const [quizTimer, setQuizTimer] = useState(false);// Boolean to control the timer visibility


  //============USE EFFECT HOOK==================
  /* useEffect to fetch quizzes when the component 
  mounts or when fetchQuizzes changes*/
  useEffect(() => {
    let isMounted = true;// Prevent state updates on unmounted component
    const loadQuizzes = async () => {
      try {
        fetchQuizzes();// Call the function to fetch quizzes
      } 
      catch (error) {
        if (isMounted) setError('Error fetching quizzes', error)// Set the error state to display the error in the UI
        // setError('Failed to fetch quizzes', error)// Set the error state to display the error in the UI
        console.error('Failed to fetch quizzes');//Log an error message in the console for debugging purposes
      }
    }
    loadQuizzes()//Call the loadquizzes function
    return () => { isMounted = false }// Cleanup function
  }, [fetchQuizzes, setError]);

//==========================================

  //Function to randomise answers
  const shuffleArray = (array) => {
    /* Use the JavaScript sort method to shuffle the array
    The comparison function returns a random value between -0.5 and 0.5
    This results in a random order for each array element*/
    return array.sort(() => Math.random() - 0.5);
  };

  //=========REQUEST================
  //-----------GET-----------------------
  // Function to fetch a single quiz
  const fetchQuiz = useCallback(async (quizId) => {//Define async function to fetch a single Quiz
    try {
     
      if (!quizId) return;// Exit early if no quiz is selected
      const token = localStorage.getItem('token');//Retrieve authentication token from localStorage
      if (!token) return;// Return if no token is found

      // Send a GET request to fetch quiz data from the server
      const response = await fetch(`http://localhost:3001/quiz/findQuiz/${quizId}`, {
        method: 'GET',//HTTP request method
        mode: 'cors',//Enable Cors for cross-origin resourcing
        headers: {//Setup request headers
          'Content-Type': 'application/json',//Specify the content-type in the payload as JSON
          'Authorization': `Bearer ${token}`,//Attatch the token 
        }
      })

      /* Conditional rendering to check if the response
        is not successful (status code is not in the range 200-299)*/
      if (!response.ok) {
        throw new Error('Failed to fetch quiz');//Throw an error message if the GET request is unsuccessful
      }
     
      const fetchedQuiz = await response.json(); // Parse the JSON response
      console.log(fetchedQuiz)
      // Conditional rendering to check if fetchedQuiz is valid
      if (!fetchedQuiz || !fetchedQuiz.questions) {
        throw new Error('Invalid quiz data');// Throw error if the data type is invalid
      }

      // Shuffle the questions to randomize their order
      const shuffledQuestions = fetchedQuiz.questions.map(question => {
        const optionsWithCorrectAnswer = [...question.options, question.correctAnswer];// Combine options and correct answer
        const shuffledOptions = shuffleArray(optionsWithCorrectAnswer);// Shuffle the options
        return { ...question, options: shuffledOptions }; // Return the question with shuffled options
      });


      // Update quiz list and set quiz details
      setQuizList(prevQuizList =>
        // Update the quiz list
        prevQuizList.map((q) => (q._id === quizId ? fetchedQuiz : q))
      );
      setQuestions(shuffledQuestions);
      setQuizName(fetchedQuiz.name);// Set the quiz name
      setQuiz(fetchedQuiz);// Set the fetched quiz
      console.log(fetchedQuiz.name);//Log the fetched quiz name in the console for  debugging purposes
    } 
    catch (error) {
      setError(`Error fetching quiz: ${error.message}`);// Set the error state and an error messsage
      console.error(`Error fetching quiz: ${error.message}`);//Log an error message in the console for debugging purposes
    }
  }, [setQuizList, setError, setQuestions, setQuizName, setQuiz])



  // ==========JSX RENDERING==========
  return (
    <>
      {/* Render the Header with '' as the heading */}
      <Header heading="GAME" />
      {/* Section1: quizdisplay component and select quiz form */}
      <section className='section1'>
        {/* Render the select quiz component */}
        <SelectQuizForm
        selectedQuizId={selectedQuizId}
        quizList={quizList}
        setSelectedQuizId={setSelectedQuizId}
       />
        <div>          
           {/* Quiz Display component */}
          <QuizDisplay
            selectedQuizId={selectedQuizId}
            quiz={quiz}
            fetchQuiz={fetchQuiz}
            quizName={quizName}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setUserScores={setUserScores}
            questions={questions}
            quizTimer={quizTimer}
            setError={setError}
            setQuiz={setQuiz}           
            setQuizList={setQuizList}
            timer={timer}
            setTimer={setTimer}
            setQuizTimer={setQuizTimer}
            fetchScores={fetchScores}
            setSelectedQuizId={setSelectedQuizId}
            userScores={userScores}
          />
        </div>
      </section>
      {/* Footer */}
      <Footer logout={logout} />
    </>
  );
}