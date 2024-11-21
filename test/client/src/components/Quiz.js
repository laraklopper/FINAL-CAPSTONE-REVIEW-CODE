// Import necessary modules and packages
import React, { useEffect, useState } from 'react';// Import the React module to use React functionalities
// Bootstrap
import Row from 'react-bootstrap/Row';//Import Bootstrap Row 
import Col from 'react-bootstrap/Col';//Import Col from Bootstrap
import Button from 'react-bootstrap/Button';//Import Bootstrap Button Component

// Quiz function component
export default function Quiz({//Export default Quiz function component
  // PROPS PASSED FROM PARENT COMPONENT
  selectedQuiz,
  quizIndex,
  setCurrentScore,
  handleNextQuestion,
  handleRestart,
  currentScore,
  questions,
  quizTimer,
  timer,
  setQuizIndex
}) {
  // =============STATE VARIABLES=====================
  const [selectedOption, setSelectedOption] = useState(null);// State to track the selected answer option 
  const [feedback, setFeedback] = useState('');// Feedback message for correct/incorrect answers              
  const [timeLeft, setTimeLeft] = useState(10);// Timer state for countdown

  // ========USE EFFECT HOOK==================
  /* Effect to reset the question index to the first 
  question when the questions array changes */
  useEffect(() => {
    if (questions.length > 0) {
      setQuizIndex(0);
    }
  }, [questions, setQuizIndex]);

  // Effect to manage the timer countdown
  useEffect(() => {
    if (!quizTimer) return;//Conditional rendering to check if the timer is disabled

    setTimeLeft(timer);//Initial timer value
    let isMounted = true;// Flag to check component mount status
    // Create an interval to update the timer every second
    const interval = setInterval(() => {
      if (isMounted) {
        setTimeLeft((prevTime) => {// Update the timeLeft state
          // Conditional rendering to check 
          /*if timeLeft is less than or equal to 1, clear 
          the interval and handle the next question*/
          if (prevTime<= 1) {
            clearInterval(interval);// Stop the interval timer
            //Call the handleNextQuestion function and move to the next question
            handleNextQuestion(); 
            return 0// Set timeLeft to 0
          }
          // Decrease timeLeft by 1 second
          return prevTime - 1
        })
      }
    }, 1000);// Timer updates every second (1000 milliseconds)

    return () => {
      // Set isMounted to false to prevent state updates after unmount
      isMounted = false
      clearInterval(interval);// Clear the interval to prevent memory leaks
    }
  }, [timer, handleNextQuestion, quizTimer]);

  // Display loading text if quiz or questions are not available
  if (!selectedQuiz || !questions || questions.length === 0) {
    return <div>Loading...</div>;
  }

  // =======Utility function============
  // Function to format the timer into mm:ss format
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);  // Calculate the number of minutes
    const secs = seconds % 60; // Calculate the remaining seconds
    // Return the formatted time as a string in mm:ss format
    // Pad seconds with a leading zero if less than 10
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // ============EVENT LISTENERS=================
  /* Function to handle answer selection and 
  update the score if correct */
  const handleAnswerClick = (isCorrect) => {
    /*/ Conditional rendering to check if 
    the selected answer is correct*/
    if (isCorrect) {
      setCurrentScore(currentScore + 1); // Increment the score if the answer is correct
      setFeedback('correct');// Set feedback message for correct answer
    } else {
      setFeedback('incorrect');//Display a feedback message for incorrect answer
    }
    setTimeout(() => setFeedback(''), 1000)  // Clear the feedback message after 1 second
  };

  /* Function to handle option click and 
  update the selected option */
  const handleOptionClick = (option) => {
    setSelectedOption(option);  // Update the selected option
    /*Check if the selected option is the correct 
    answer and update the score accordingly*/
    handleAnswerClick(option === questions[quizIndex].correctAnswer);
    //Call the handleNextQuestion function and move to the next question
    handleNextQuestion();
  };

  // =================JSX RENDERING======================
  return (
    <div id='quiz'>
      <Row>
        <Col id='quizHeading'>
          {/* Display quiz name */}
          <h3 className='quizName'>{selectedQuiz.quizName}</h3>
        </Col>
      </Row>
      <div>
        <Row className='quizRow'>
          <Col xs={12} md={8} id='questionCol'>
            {/* Display question number */}
            <div id='questionNumber'>
              <label>
                <p className='number'>
                  QUESTION {quizIndex + 1} of {selectedQuiz.questions.length}
                </p>
              </label>
            </div>
          </Col>
          <Col xs={6} md={4} id='timerCol'>
            {/* Display timer if enabled */}
            {quizTimer && <div id='timer'>
              TIMER: {formatTimer(timeLeft)}
              </div>}
          </Col>
        </Row>
        {/* Question */}
        <div className='question'>
          <Row className='questionRow'>
            <Col md={9} className='questionCol'>
              {/* Display current question text */}
              <label className='questionLabel'>
                <h6 id='questionText'>
                  {questions[quizIndex].questionText}
                  </h6>
              </label>
            </Col>
            <Col md={3}></Col>
          </Row>
          <Row className='optionsRow'>
            <Col xs={6} md={4} className='optionCol'></Col>
            <Col xs={6} md={4} className='questionOptionCol'>
              {/* Map through and render options as buttons */}
              {questions[quizIndex].options.map((option, index) => (
                <Button
                  key={index} 
                  className='answerOption'
                  name='options'
                  checked={selectedOption=== option}
                  type='button'
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </Button>
              ))}
            </Col>
            <Col xs={6} md={4} className='optionsCol'></Col>
          </Row>
          <Row className='feedbackRow'>
            <Col xs={6} md={4}></Col>
            <Col xs={6} md={4} className='feedbackMessage'>
              {/* Display feedback message */}
              {feedback && <p className='feedback'>{feedback}</p>}
            </Col>
            <Col xs={6} md={4}></Col>
          </Row>
        </div>
        <Row className='quizNavRow'>
          <Col xs={6} md={4}>
            <div>
              {/* Display the current score */}
              <p id='resultText'>RESULT: {currentScore} of {selectedQuiz.questions.length}</p>
            </div>
          </Col>
          <Col xs={6} md={4}></Col>
          <Col xs={6} md={4}>
            {/* Button to move to next question */}
            <Button
              variant='primary'
              type='button'
              id='nextBtn'
              onClick={handleNextQuestion}
              aria-label='Next question'
            >
              NEXT QUESTION
            </Button>
            {/* Button to restart quiz */}
            <Button
              variant='primary'
              type='reset'
              onClick={handleRestart}
              id='resetBtn'
              aria-label='Restart quiz'
            >
              RESTART
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}
